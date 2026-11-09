// Toast-only numeric animation. Each property has its own owner so a scale
// animation can run alongside a shared stack-position/opacity animation.
const properties = ["x", "y", "scale", "opacity", "height"] as const;
type Property = (typeof properties)[number];
type Value = number | `+=${number}` | ((index: number) => number);
type Values = Partial<Record<Property, Value>>;
type Options = Values & {
  duration: number;
  ease: (progress: number) => number;
  onComplete?: () => void;
};
type Targets = HTMLElement | HTMLElement[] | null;
interface State {
  values: Record<Property, number>;
  owners: Map<Property, () => void>;
}

const states = new WeakMap<HTMLElement, State>();

function stateFor(element: HTMLElement): State {
  let state = states.get(element);
  if (!state) {
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);
    state = {
      values: {
        x: 0,
        y: 0,
        scale: 1,
        opacity: Number.parseFloat(style?.opacity || "1"),
        height: element.getBoundingClientRect().height,
      },
      owners: new Map(),
    };
    states.set(element, state);
  }
  return state;
}

function write(element: HTMLElement, state: State, property: Property, value: number) {
  state.values[property] = value;
  if (property === "opacity") element.style.opacity = String(value);
  else if (property === "height") element.style.height = `${value}px`;
  else {
    const { x, y, scale } = state.values;
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }
}

function elements(targets: Targets) {
  return targets ? (Array.isArray(targets) ? targets : [targets]) : [];
}

function resolve(value: Value, index: number, current: number) {
  if (typeof value === "function") return value(index);
  return typeof value === "string" ? current + Number(value.slice(2)) : value;
}

function set(targets: Targets, values: Values) {
  elements(targets).forEach((element, index) => {
    const state = stateFor(element);
    properties.forEach((property) => {
      const value = values[property];
      if (value === undefined) return;
      state.owners.get(property)?.();
      write(element, state, property, resolve(value, index, state.values[property]));
    });
  });
}

function to(targets: Targets, options: Options) {
  let frame: number | undefined;
  let remaining = 0;
  const tracks: Array<{
    element: HTMLElement;
    state: State;
    property: Property;
    from: number;
    to: number;
    active: boolean;
  }> = [];

  elements(targets).forEach((element, index) => {
    const state = stateFor(element);
    properties.forEach((property) => {
      const value = options[property];
      if (value === undefined) return;
      state.owners.get(property)?.();
      const track = {
        element,
        state,
        property,
        from: state.values[property],
        to: resolve(value, index, state.values[property]),
        active: true,
      };
      remaining++;
      tracks.push(track);
      state.owners.set(property, () => {
        if (!track.active) return;
        track.active = false;
        state.owners.delete(property);
        if (--remaining === 0 && frame !== undefined) cancelAnimationFrame(frame);
      });
    });
  });

  // A group shares one clock, including the dismissed toast and its neighbors.
  const start = performance.now();
  const tick = (now: number) => {
    const progress = options.duration <= 0 ? 1 : Math.min(1, (now - start) / options.duration);
    const eased = options.ease(progress);
    tracks.forEach((track) => {
      if (!track.active) return;
      write(track.element, track.state, track.property,
        progress === 1 ? track.to : track.from + (track.to - track.from) * eased);
      if (progress === 1) {
        track.active = false;
        track.state.owners.delete(track.property);
      }
    });
    if (progress === 1) options.onComplete?.();
    else frame = requestAnimationFrame(tick);
  };
  if (!remaining) return;
  if (options.duration <= 0) tick(start);
  else frame = requestAnimationFrame(tick);
}

function stop(targets: Targets) {
  elements(targets).forEach((element) => {
    const state = states.get(element);
    if (state) Array.from(state.owners.values()).forEach((cancel) => cancel());
  });
}

export const toastAnimation = {
  set,
  to,
  stop,
  fromTo(targets: Targets, from: Values, options: Options) {
    set(targets, from);
    to(targets, options);
  },
  getProperty(element: HTMLElement, property: Property) {
    return stateFor(element).values[property];
  },
};
