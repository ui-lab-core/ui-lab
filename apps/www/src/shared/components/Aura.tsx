"use client";
import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const getThemeColor = (variableName: string, fallback: string) => {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const tempDiv = document.createElement("div");
  tempDiv.style.display = "none";
  document.body.appendChild(tempDiv);
  tempDiv.style.color = `var(${variableName})`;
  let computed = window.getComputedStyle(tempDiv).color;
  if (!computed || computed === "" || computed === "rgba(0, 0, 0, 0)") {
    tempDiv.style.color = `oklch(var(${variableName}))`;
    computed = window.getComputedStyle(tempDiv).color;
  }
  document.body.removeChild(tempDiv);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (ctx) {
    ctx.fillStyle = computed;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return new THREE.Color(r / 255, g / 255, b / 255);
  }
  return new THREE.Color(fallback);
};

const SHAPES = {
  /** Vertical gradient that brightens toward the bottom edge. */
  flat: 0,
  /** Filled elliptical dome rising from below the bottom center. */
  arc: 1,
  /** Only the dome's rim, like light cresting a horizon. */
  ring: 2,
  /** Narrow cone aimed straight up from the bottom center. */
  beam: 3,
  /** Round glow centered at the crest height. */
  orb: 4,
  /** Low glow along the bottom that swells into a plateaued hill beneath the center. */
  hill: 5,
} as const;

export type AuraShape = keyof typeof SHAPES;

interface StarryAuraProps {
  shape?: AuraShape;
  /** Use 'accent' to restore the theme's single-color appearance. */
  colorMode?: "chromatic" | "accent";
  gridDensity?: number;
  dotSize?: number;
  twinkleSpeed?: number;
  twinkleSharpness?: number;
  sparsity?: number;
  baseOpacity?: number;
  accentOpacity?: number;
  /** Height of the shape's crest above the bottom edge, as a fraction of the canvas height. Ignored by 'flat'. */
  arcHeight?: number;
  /** Horizontal stretch of the shape relative to its height. Ignored by 'flat'. */
  arcSpread?: number;
  /** Speed of the light pulses traveling out from the shape's source. */
  emissionSpeed?: number;
  bgVariable?: string;
  accentVariable?: string;
}

const StarryGridShader = ({
  shape = "hill",
  colorMode = "chromatic",
  gridDensity = 170,
  dotSize = 0.3,
  twinkleSpeed = 1.5,
  twinkleSharpness = 0.5,
  sparsity = 0.1,
  baseOpacity = 0.04,
  accentOpacity = 0.3,
  arcHeight = 1.25,
  arcSpread = 2.5,
  emissionSpeed = 0.4,
  bgVariable = "--background-900",
  accentVariable = "--accent-500",
}: StarryAuraProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const startTime = useRef<number | null>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_grid_density: { value: gridDensity },
      u_dot_size: { value: dotSize },
      u_speed: { value: twinkleSpeed },
      u_sharpness: { value: twinkleSharpness },
      u_sparsity: { value: sparsity },
      u_base_opacity: { value: baseOpacity },
      u_accent_opacity: { value: accentOpacity },
      u_shape: { value: SHAPES[shape] },
      u_arc_height: { value: arcHeight },
      u_arc_spread: { value: arcSpread },
      u_emission_speed: { value: emissionSpeed },
      u_is_dark: { value: 1.0 },
      u_background: { value: new THREE.Color(0, 0, 0) },
      u_accent: { value: new THREE.Color(1, 1, 1) },
      u_chromatic: { value: colorMode === "chromatic" ? 1.0 : 0.0 },
    }),
    [
      shape,
      gridDensity,
      dotSize,
      twinkleSpeed,
      twinkleSharpness,
      sparsity,
      baseOpacity,
      accentOpacity,
      arcHeight,
      arcSpread,
      emissionSpeed,
      colorMode,
    ],
  );

  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;
    const updateColors = () => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        const bgColor = getThemeColor(bgVariable, "#000000");
        const accentColor = getThemeColor(accentVariable, "#ffffff");
        const luminance = 0.299 * bgColor.r + 0.587 * bgColor.g + 0.114 * bgColor.b;
        mat.uniforms.u_is_dark.value = luminance < 0.5 ? 1.0 : 0.0;
        mat.uniforms.u_background.value.copy(bgColor);
        mat.uniforms.u_accent.value.copy(accentColor);
      }
    };
    const throttledUpdate = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        updateColors();
        throttleTimeout = null;
      }, 100);
    };
    updateColors();
    const observer = new MutationObserver(throttledUpdate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => {
      observer.disconnect();
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [bgVariable, accentVariable, uniforms]);

  useFrame((state) => {
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    startTime.current ??= state.clock.elapsedTime;
    mat.uniforms.u_time.value = state.clock.elapsedTime - startTime.current;
    mat.uniforms.u_resolution.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          uniform float u_time;
          uniform vec2 u_resolution;
          uniform float u_grid_density;
          uniform float u_dot_size;
          uniform float u_speed;
          uniform float u_sharpness;
          uniform float u_sparsity;
          uniform float u_base_opacity;
          uniform float u_accent_opacity;
          uniform int u_shape;
          uniform float u_arc_height;
          uniform float u_arc_spread;
          uniform float u_emission_speed;
          uniform float u_is_dark;
          uniform vec3 u_background;
          uniform vec3 u_accent;
          uniform float u_chromatic;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }

          void main() {
            vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
            vec2 uv = vUv * aspect;
            vec2 gridUv = fract(uv * u_grid_density) - 0.5;
            vec2 cellId = floor(uv * u_grid_density);
            float dotRandom = hash(cellId);

            // --- LIGHT FIELD ---
            // sourceDist is 0.0 at the light's source and 1.0 at the shape's edge;
            // field is the shape's brightness, which also drives dot density.
            const float SOURCE_DEPTH = 0.12;
            vec2 cellCenter = (cellId + 0.5) / u_grid_density;
            vec2 fromSource = vec2(cellCenter.x - 0.5 * aspect.x, cellCenter.y + SOURCE_DEPTH);
            float arcRadius = u_arc_height + SOURCE_DEPTH;
            float sourceDist = length(vec2(fromSource.x / u_arc_spread, fromSource.y)) / arcRadius;
            float body = pow(clamp(1.0 - sourceDist, 0.0, 1.0), 1.4);
            float rim = exp(-pow((sourceDist - 1.0) / 0.10, 2.0));
            float halo = exp(-max(sourceDist - 1.0, 0.0) * 5.0) * 0.18;
            float field;

            if (u_shape == 0) {
              sourceDist = cellCenter.y;
              field = pow(1.0 - cellCenter.y, 3.0);
            } else if (u_shape == 2) {
              field = rim * 0.9 + halo + body * 0.12;
            } else if (u_shape == 3) {
              // Cone narrows toward the source and widens as it rises.
              float coneWidth = fromSource.y * 0.32 * u_arc_spread;
              float cone = exp(-pow(fromSource.x / coneWidth, 2.0));
              float reach = pow(clamp(1.0 - fromSource.y / (arcRadius * 1.4), 0.0, 1.0), 0.8);
              sourceDist = fromSource.y / arcRadius;
              field = cone * reach;
            } else if (u_shape == 4) {
              vec2 fromCenter = vec2(cellCenter.x - 0.5 * aspect.x, cellCenter.y - u_arc_height);
              sourceDist = length(vec2(fromCenter.x / u_arc_spread, fromCenter.y)) / 0.45;
              float core = pow(clamp(1.0 - sourceDist, 0.0, 1.0), 1.6);
              field = core + exp(-max(sourceDist - 1.0, 0.0) * 5.0) * 0.12;
            } else if (u_shape == 5) {
              // A narrow peak rising from a wide, low skirt.
              float centerOffset = abs(vUv.x - 0.5);
              float bump = exp(-pow(centerOffset / (0.12 * u_arc_spread), 3.0));
              float skirt = exp(-pow(centerOffset / (0.24 * u_arc_spread), 2.0));
              float hillHeight = u_arc_height * (0.06 + 0.12 * skirt + 0.82 * bump);
              sourceDist = cellCenter.y / hillHeight;
              float crest = exp(-pow((sourceDist - 1.0) / 0.12, 2.0));
              // Dim the shoulders so the light concentrates beneath the crest.
              float centerBias = mix(0.25, 1.0, max(bump, skirt * 0.6));
              field = (pow(1.0 - smoothstep(0.0, 1.15, sourceDist), 1.6) + crest * 0.3) * centerBias;
            } else {
              field = body * 0.85 + rim * 0.55 + halo;
            }
            field = clamp(field, 0.0, 1.0);

            // Stagger each node along a power-on wave that radiates out from the source.
            float ignitionTime = 0.15 + min(sourceDist, 1.6) * 1.4 + dotRandom * 0.16;
            float ignitionAge = u_time - ignitionTime;
            float powerOn = smoothstep(0.0, 0.55, ignitionAge);
            float ignitionGlow = 0.35 * powerOn * (1.0 - smoothstep(0.55, 1.0, ignitionAge));

            // Denser field inside the arc; only the rarest nodes survive outside it.
            float dynamicSparsity = mix(1.0, u_sparsity, field);
            float canTwinkle = smoothstep(dynamicSparsity, dynamicSparsity + 0.05, dotRandom);

            float speed = (0.5 + dotRandom) * u_speed;
            float phase = dotRandom * 6.28;
            float twinkle = sin(u_time * speed + phase) * 0.5 + 0.5;

            // Thin arcs of light travel outward from the source and fade as they reach the rim.
            float emission = 0.5 + 0.5 * sin(6.2831853 * (sourceDist * 5.0 - u_time * u_emission_speed * 0.5));
            emission = pow(emission, 8.0) * smoothstep(1.1, 0.2, sourceDist);

            twinkle = clamp(pow(twinkle, u_sharpness) * 0.8 + emission * 0.7, 0.0, 1.0) * canTwinkle * field;
            twinkle = max(twinkle, ignitionGlow * field);

            float themeAdjustedBase = mix(u_base_opacity * 0.3, u_base_opacity, u_is_dark);
            float finalBase = themeAdjustedBase * field;
            float intensity = finalBase + (twinkle * u_accent_opacity);

            float dotDist = length(gridUv);
            float dotMask = smoothstep(u_dot_size, u_dot_size - 0.1, dotDist);

            // Brighter in dark mode; darker and more muted against light backgrounds.
            float hue = sourceDist * 0.65 + vUv.x * 0.25;
            float colorBrightness = mix(0.32, 0.74, u_is_dark);
            float colorAmplitude = mix(0.10, 0.25, u_is_dark);
            vec3 chromaticColor = vec3(colorBrightness) + vec3(colorAmplitude) * cos(
              6.2831853 * (hue + vec3(0.0, 0.33, 0.67))
            );
            vec3 starColor = mix(u_accent, chromaticColor, u_chromatic);
            vec3 finalColor = mix(u_background, starColor, twinkle);
            gl_FragColor = vec4(finalColor, dotMask * intensity * powerOn);
          }
        `}
      />
    </mesh>
  );
};

export default function StarryAura(props: StarryAuraProps) {
  return (
    <div className="absolute inset-0 h-full w-full -z-10 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <StarryGridShader {...props} />
      </Canvas>
    </div>
  );
}
