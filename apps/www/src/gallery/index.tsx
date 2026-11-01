"use client";

import type { ReactNode } from "react";
import { CardAnimation } from "./timelines/card.animation";
import { DividerAnimation } from "./timelines/divider.animation";
import { ExpandAnimation } from "./timelines/expand.animation";
import { GridAnimation } from "./timelines/grid.animation";
import { FlexAnimation } from "./timelines/flex.animation";
import { GroupAnimation } from "./timelines/group.animation";
import { GalleryAnimation } from "./timelines/gallery.animation";
import { PopoverAnimation } from "./timelines/popover.animation";
import { ListAnimation } from "./timelines/list.animation";
import { PanelAnimation } from "./timelines/panel.animation";
import { PageAnimation } from "./timelines/page.animation";
import { BannerAnimation } from "./timelines/banner.animation";
import { ButtonAnimation } from "./timelines/button.animation";
import { CheckboxAnimation } from "./timelines/checkbox.animation";
import { ConfirmAnimation } from "./timelines/confirm.animation";
import { CommandAnimation } from "./timelines/command.animation";
import { DateAnimation } from "./timelines/date.animation";
import { ColorAnimation } from "./timelines/color.animation";
import { InputAnimation } from "./timelines/input.animation";
import { RadioAnimation } from "./timelines/radio.animation";
import { SelectAnimation } from "./timelines/select.animation";
import { SliderAnimation } from "./timelines/slider.animation";
import { SwitchAnimation } from "./timelines/switch.animation";
import { TextareaAnimation } from "./timelines/textarea.animation";
import { BadgeAnimation } from "./timelines/badge.animation";
import { LabelAnimation } from "./timelines/label.animation";
import { TooltipAnimation } from "./timelines/tooltip.animation";
import { ProgressAnimation } from "./timelines/progress.animation";
import { ToastAnimation } from "./timelines/toast.animation";
import { PathAnimation } from "./timelines/path.animation";
import { MenuAnimation } from "./timelines/menu.animation";
import { TabsAnimation } from "./timelines/tabs.animation";
import { AnchorAnimation } from "./timelines/anchor.animation";
import { ScrollAnimation } from "./timelines/scroll.animation";
import { ToolbarAnimation } from "./timelines/toolbar.animation";
import { CarouselAnimation } from "./timelines/Carousel.animation";
import { TimelineAnimation } from "./timelines/Timeline.animation";
import { SkeletonAnimation } from "./timelines/Skeleton.animation";
import { LoadingAnimation } from "./timelines/Loading.animation";
import { ModalAnimation } from "./timelines/modal.animation";
import { AlertAnimation } from "./timelines/Alert.animation";
import { ChartAnimation } from "./timelines/chart.animation";
import { TableAnimation } from "./timelines/table.animation";
import { ImageAnimation } from "./timelines/image.animation";
import { VideoAnimation } from "./timelines/video.animation";
import { VoiceAnimation } from "./timelines/voice.animation";
import { MaskAnimation } from "./timelines/mask.animation";
import { CodeAnimation } from "./timelines/code.animation";
import { FrameAnimation } from "./timelines/frame.animation";
import { IconAnimation } from "./timelines/icon.animation";

export const previews: Record<string, ReactNode> = {
  anchor: <AnchorAnimation />,
  badge: <BadgeAnimation />,
  banner: <BannerAnimation />,
  path: <PathAnimation />,
  button: <ButtonAnimation />,
  card: <CardAnimation />,
  checkbox: <CheckboxAnimation />,
  color: <ColorAnimation />,
  command: <CommandAnimation />,
  confirm: <ConfirmAnimation />,
  date: <DateAnimation />,
  divider: <DividerAnimation />,
  panel: <PanelAnimation />,
  flex: <FlexAnimation />,
  expand: <ExpandAnimation />,
  gallery: <GalleryAnimation />,
  grid: <GridAnimation />,
  group: <GroupAnimation />,
  input: <InputAnimation />,
  label: <LabelAnimation />,
  select: <SelectAnimation />,
  slider: <SliderAnimation />,
  menu: <MenuAnimation />,
  tabs: <TabsAnimation />,
  textarea: <TextareaAnimation />,
  toast: <ToastAnimation />,
  tooltip: <TooltipAnimation />,
  switch: <SwitchAnimation />,
  list: <ListAnimation />,
  popover: <PopoverAnimation />,
  progress: <ProgressAnimation />,
  radio: <RadioAnimation />,
  mask: <MaskAnimation />,
  modal: <ModalAnimation />,
  scroll: <ScrollAnimation />,
  table: <TableAnimation />,
  page: <PageAnimation />,
  code: <CodeAnimation />,
  frame: <FrameAnimation />,
  toolbar: <ToolbarAnimation />,
  carousel: <CarouselAnimation />,
  timeline: <TimelineAnimation />,
  skeleton: <SkeletonAnimation />,
  loading: <LoadingAnimation />,
  alert: <AlertAnimation />,
  chart: <ChartAnimation />,
  image: <ImageAnimation />,
  icon: <IconAnimation />,
  video: <VideoAnimation />,
  voice: <VoiceAnimation />,
};
