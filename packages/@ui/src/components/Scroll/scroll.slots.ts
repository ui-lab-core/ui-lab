import * as React from "react";

type SlotComponent = React.ElementType;
type SlotDefinitions = Record<string, SlotComponent>;

type SlotElement<Component extends SlotComponent> = React.ReactElement<
  React.ComponentProps<Component>,
  Component
>;

type ResolvedComponentSlots<Definitions extends SlotDefinitions> = {
  [Name in keyof Definitions]?: SlotElement<Definitions[Name]>;
};

interface NamedComponent {
  displayName?: string;
  name?: string;
  render?: NamedComponent;
}

function getComponentName(component: unknown): string | undefined {
  if (typeof component !== "function" && (typeof component !== "object" || component === null)) {
    return undefined;
  }

  const namedComponent = component as NamedComponent;
  return (
    namedComponent.displayName ??
    namedComponent.name ??
    namedComponent.render?.displayName ??
    namedComponent.render?.name
  );
}

function isSlotComponent(childType: unknown, slotComponent: SlotComponent): boolean {
  if (childType === slotComponent) return true;

  const childName = getComponentName(childType);
  const slotName = getComponentName(slotComponent);
  return Boolean(childName && slotName && childName === slotName);
}

/**
 * Creates a resolver for compound components whose placement is owned by their parent.
 * Recognized slot elements are removed from normal children and returned by name so the
 * parent can render them at stable internal locations. The last declaration wins when a
 * singleton slot is declared more than once.
 */
export function createComponentSlotResolver<const Definitions extends SlotDefinitions>(
  definitions: Definitions,
) {
  const entries = Object.entries(definitions) as [keyof Definitions, SlotComponent][];

  return (children: React.ReactNode) => {
    const slots: ResolvedComponentSlots<Definitions> = {};
    const content: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const match = entries.find(([, component]) => isSlotComponent(child.type, component));
        if (match) {
          (slots as Record<keyof Definitions, React.ReactElement>)[match[0]] = child;
          return;
        }
      }

      content.push(child);
    });

    return { content, slots };
  };
}
