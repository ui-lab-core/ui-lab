import { ColorArea, ColorCanvasField, ColorRoot, ColorSlider, ColorTrigger } from "./Color";

const Color = Object.assign(ColorRoot, {
  Trigger: ColorTrigger,
  Area: ColorArea,
  Canvas: ColorCanvasField,
  Slider: ColorSlider,
});

export { Color };
export type {
  ColorAreaProps,
  ColorCanvasFieldProps,
  ColorProps,
  ColorSliderProps,
  ColorStyleSlots,
  ColorStylesProp,
  ColorTriggerProps,
  ColorState,
} from "./Color";


