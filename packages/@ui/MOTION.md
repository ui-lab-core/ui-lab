# Motion API

Motion uses shared CSS primitives, semantic interaction overrides, and no React animation props. Override a token on :root, a subtree, or an individual component. Defaults are resolved at the element, so hover timing cannot disable toggle or layout motion.

## Curves

--ease-in: cubic-bezier(0.4, 0, 1, 1). Accelerating exits.
--ease-out: cubic-bezier(0, 0, 0.2, 1). Responsive controls and entrances.
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1). Smooth repeating changes.
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1). Layout changes with a gradual settle.
--ease-linear: linear. Constant-speed motion.

Routine interactions do not bounce or overshoot, particularly colors and opacity.

## Durations

--duration-fast: 100ms. Press and hover entry.
--duration-normal: 150ms. Hover leave, focus, tooltips, and exits.
--duration-moderate: 200ms. Toggles, indicators, small reveals, and overlay entrances.
--duration-slow: 300ms. Larger panel resizing, content resizing, and toast stack movement.
--duration-slower: 500ms. Available for deliberate emphasis; not the default for controls.
--duration-pulse: 2000ms and --duration-loop: 1500ms are separate ambient-animation periods.

## Semantic overrides

Use --hover-enter-duration, --hover-leave-duration, and --hover-easing for hover feedback. --hover-duration remains the resolved interaction-state duration.

Use --press-duration / --press-easing, --toggle-duration / --toggle-easing, --focus-duration / --focus-easing, --layout-duration / --layout-easing, --enter-duration / --enter-easing, and --exit-duration / --exit-easing for their respective interactions.

Toggles include Switch, Checkbox, Radio, and disclosure indicators. Layout uses ease-out-quint. Enter uses ease-out; exit uses ease-in. Focus, press, hover, and toggles use ease-out. Tooltips enter over 150ms rather than the default 200ms overlay entrance.

Existing panel, tabs indicator, chart, and ring duration overrides remain available. Their easing overrides consistently end in -easing. CSS overrides should use time values in ms or s and CSS easing keywords or cubic-bezier curves; GSAP toast motion supports those same curves through CustomEase.

Setting a semantic duration to 0ms disables that interaction's animation. Reduced-motion preferences disable component transitions and ambient animations, content-size animation, and toast movement. Overlay unmounting reads computed transition timings rather than assuming a fixed duration.

## Migration

--ease-snappy-pop and --ease-decelerate become --ease-out.
--ease-gentle-ease becomes --ease-in-out.
--ease-settle-in becomes --ease-out-quint.
--hover-transition-timing-function becomes --hover-easing.
--focus-transition-timing-function becomes --focus-easing; --focus-transition-duration becomes --focus-duration.
--ring-transition-timing-function becomes --ring-easing.
--press-ease becomes --press-easing; --panel-ease becomes --panel-easing.

## Research and design basis

Transitions.dev uses shared motion tokens, smooth ease-out for surface/layout motion, named transition properties, and reduced-motion support. Its more expressive bounce recipes are inspiration, not suitable defaults for every control: https://transitions.dev/ and https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/SKILL.md

Material's duration/easing guidance supplies the established standard, acceleration, and deceleration curves and recommends short desktop transitions: https://m1.material.io/motion/duration-easing.html

Fluent recommends timing according to element size and travel distance, with consistent natural motion and reduced-motion support: https://fluent2.microsoft.design/motion

The exact duration scale and interaction assignments here are this library's design choices, informed by those references; they are not claims about proprietary application implementations.
