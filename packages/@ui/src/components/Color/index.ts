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
  ColorAreaVariant,
  ColorCanvasGradientStyleSlots,
  ColorCanvasFieldProps,
  ColorCanvasStyleSlots,
  ColorInputStyleSlots,
  ColorFormat,
  ColorPopoverStyles,
  ColorProps,
  ColorRecentColorsStyleSlots,
  ColorSliderChannelStyleSlots,
  ColorSliderProps,
  ColorSliderStyleSlots,
  ColorSliderType,
  ColorSize,
  ColorStyleSlots,
  ColorStylesProp,
  ColorTriggerStyleSlots,
  ColorTriggerPosition,
  ColorTriggerProps,
  ColorState,
} from "./Color";
