import React, { StrictMode, useLayoutEffect } from "react";
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "../Toast.Toaster";
import { toast } from "../Toast.UseToast";
import type { ToastPosition } from "../Toast.Store";

const gsapMocks = vi.hoisted(() => ({
  fromTo: vi.fn(),
  killTweensOf: vi.fn(),
  set: vi.fn(),
  to: vi.fn(),
}));

vi.mock("gsap", () => ({ default: gsapMocks }));

vi.mock("@gsap/react", () => ({
  useGSAP: (callback: () => void) => {
    useLayoutEffect(() => {
      callback();
    }, []);
  },
}));

type ToastHandle = ReturnType<typeof toast>;
type ToastOptions = Parameters<typeof toast>[0];

const handles: ToastHandle[] = [];
const targets: HTMLElement[] = [];
let titleCount = 0;

function createTarget() {
  const target = document.createElement("div");
  target.style.position = "relative";
  document.body.appendChild(target);
  targets.push(target);
  return target;
}

function showToast(options: Partial<ToastOptions> = {}) {
  titleCount += 1;
  let handle!: ToastHandle;

  act(() => {
    handle = toast({
      title: `Toast ${titleCount}`,
      duration: Infinity,
      ...options,
    });
  });

  handles.push(handle);
  return handle;
}

function getPositionGroup(title: string) {
  return screen.getByText(title).closest("[data-toast-position]") as HTMLElement;
}

function rect(top: number, bottom: number): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    bottom,
    left: 0,
    right: 356,
    width: 356,
    height: bottom - top,
    toJSON: () => ({}),
  };
}

afterEach(() => {
  cleanup();

  act(() => {
    handles.splice(0).forEach((handle) => handle.dismiss());
  });

  targets.splice(0).forEach((target) => target.remove());
  titleCount = 0;
  gsapMocks.fromTo.mockClear();
  gsapMocks.killTweensOf.mockClear();
  gsapMocks.set.mockClear();
  gsapMocks.to.mockClear();
  vi.restoreAllMocks();
});

describe("Toast portal containers", () => {
  it("portals the default Toaster through document.body", async () => {
    const view = render(<Toaster />);
    showToast({ title: "Default portal" });

    const alert = await screen.findByRole("alert");
    expect(document.body).toContainElement(alert);
    expect(view.container).not.toContainElement(alert);
  });

  it("uses fixed positioning for the default viewport target", async () => {
    render(<Toaster />);
    showToast({ title: "Viewport toast" });

    await screen.findByText("Viewport toast");
    expect(getPositionGroup("Viewport toast").style.position).toBe("fixed");
  });

  it("portals into a custom target and uses absolute positioning", async () => {
    const target = createTarget();
    const view = render(<Toaster container={target} />);
    showToast({ title: "Contained toast" });

    const alert = await screen.findByRole("alert");
    expect(target).toContainElement(alert);
    expect(view.container).not.toContainElement(alert);
    expect(getPositionGroup("Contained toast").style.position).toBe("absolute");
  });

  it("does not fall back to body for explicit null targets", () => {
    const view = render(<Toaster container={null} />);
    showToast({ title: "No target" });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    view.rerender(<Toaster container={() => null} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("Toast channel routing", () => {
  it("routes default and named toasts only to their matching Toasters", async () => {
    const defaultTarget = createTarget();
    const namedTarget = createTarget();
    render(
      <>
        <Toaster container={defaultTarget} />
        <Toaster toasterId="named" container={namedTarget} />
      </>
    );

    showToast({ title: "Default channel" });
    showToast({ toasterId: "named", title: "Named channel" });

    await screen.findAllByRole("alert");
    expect(within(defaultTarget).getByText("Default channel")).toBeInTheDocument();
    expect(within(defaultTarget).queryByText("Named channel")).not.toBeInTheDocument();
    expect(within(namedTarget).getByText("Named channel")).toBeInTheDocument();
    expect(within(namedTarget).queryByText("Default channel")).not.toBeInTheDocument();
  });

  it("allows different toaster IDs to render the same position simultaneously", async () => {
    const firstTarget = createTarget();
    const secondTarget = createTarget();
    render(
      <>
        <Toaster toasterId="first" container={firstTarget} />
        <Toaster toasterId="second" container={secondTarget} />
      </>
    );

    showToast({ toasterId: "first", position: "bottom-right", title: "First" });
    showToast({ toasterId: "second", position: "bottom-right", title: "Second" });

    await screen.findAllByRole("alert");
    expect(within(firstTarget).getByText("First")).toBeInTheDocument();
    expect(within(secondTarget).getByText("Second")).toBeInTheDocument();
  });

  it("deduplicates Toasters with the same ID and position", async () => {
    const firstTarget = createTarget();
    const secondTarget = createTarget();
    render(
      <>
        <Toaster toasterId="duplicate" container={firstTarget} />
        <Toaster toasterId="duplicate" container={secondTarget} />
      </>
    );

    showToast({ toasterId: "duplicate", title: "Only once" });

    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(1));
    expect(
      within(firstTarget).queryByText("Only once") ||
        within(secondTarget).queryByText("Only once")
    ).toBeInTheDocument();
  });

  it("releases the old singleton claim when toasterId changes", async () => {
    const firstTarget = createTarget();
    const secondTarget = createTarget();
    const view = render(<Toaster toasterId="before" container={firstTarget} />);
    showToast({ toasterId: "before", title: "Before" });
    showToast({ toasterId: "after", title: "After" });

    expect(await within(firstTarget).findByText("Before")).toBeInTheDocument();
    view.rerender(<Toaster toasterId="after" container={firstTarget} />);
    expect(await within(firstTarget).findByText("After")).toBeInTheDocument();

    render(<Toaster toasterId="before" container={secondTarget} />);
    expect(await within(secondTarget).findByText("Before")).toBeInTheDocument();
  });

  it("updates and dismisses the intended scoped toast", async () => {
    const firstTarget = createTarget();
    const secondTarget = createTarget();
    render(
      <>
        <Toaster toasterId="first" container={firstTarget} />
        <Toaster toasterId="second" container={secondTarget} />
      </>
    );

    const first = showToast({ toasterId: "first", title: "First original" });
    showToast({ toasterId: "second", title: "Second original" });
    await screen.findAllByRole("alert");

    act(() => first.update({ title: "First updated" }));
    expect(within(firstTarget).getByText("First updated")).toBeInTheDocument();
    expect(within(secondTarget).getByText("Second original")).toBeInTheDocument();

    act(() => first.dismiss());
    expect(within(firstTarget).queryByRole("alert")).not.toBeInTheDocument();
    expect(within(secondTarget).getByText("Second original")).toBeInTheDocument();
  });
});

describe("Toast container-relative layout", () => {
  it("preserves the offsets for all six positions", async () => {
    const target = createTarget();
    render(<Toaster toasterId="positions" container={target} />);

    const expected: Record<ToastPosition, Partial<CSSStyleDeclaration>> = {
      "top-left": { top: "1.5rem", left: "1.5rem" },
      top: { top: "1.5rem", left: "50%", transform: "translateX(-50%)" },
      "top-right": { top: "1.5rem", right: "1.5rem" },
      "bottom-left": { bottom: "1.5rem", left: "1.5rem" },
      bottom: { bottom: "1.5rem", left: "50%", transform: "translateX(-50%)" },
      "bottom-right": { bottom: "1.5rem", right: "1.5rem" },
    };

    (Object.keys(expected) as ToastPosition[]).forEach((position) => {
      showToast({
        toasterId: "positions",
        position,
        title: position,
      });
    });

    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(6));

    Object.entries(expected).forEach(([position, styles]) => {
      const group = target.querySelector(
        `[data-toast-position="${position}"]`
      ) as HTMLElement;
      expect(group).toBeInTheDocument();
      expect(group.style.position).toBe("absolute");
      Object.entries(styles).forEach(([property, value]) => {
        expect(group.style[property as keyof CSSStyleDeclaration]).toBe(value);
      });
    });
  });

  it("caps width against the containing block instead of the viewport", async () => {
    const target = createTarget();
    render(<Toaster container={target} />);
    showToast({ title: "Sized toast" });

    await screen.findByText("Sized toast");
    const group = getPositionGroup("Sized toast");
    const stack = group.firstElementChild as HTMLElement;

    expect(group.style.width).toBe("356px");
    expect(group.style.maxWidth).toBe("calc(100% - 3rem)");
    expect(group.style.maxWidth).not.toContain("vw");
    expect(stack.style.width).toBe("100%");
  });

  it("uses custom top and bottom rectangles for entrance offsets", async () => {
    const target = createTarget();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this === target) return rect(100, 400);
        if (this.getAttribute("role") === "alert") return rect(140, 200);
        return rect(0, 0);
      }
    );

    render(<Toaster toasterId="boundary" container={target} />);
    showToast({ toasterId: "boundary", position: "top", title: "Top spawn" });
    showToast({ toasterId: "boundary", position: "bottom", title: "Bottom spawn" });

    await waitFor(() => expect(gsapMocks.fromTo).toHaveBeenCalledTimes(2));
    const topCall = gsapMocks.fromTo.mock.calls.find(([element]) =>
      (element as HTMLElement).textContent?.includes("Top spawn")
    );
    const bottomCall = gsapMocks.fromTo.mock.calls.find(([element]) =>
      (element as HTMLElement).textContent?.includes("Bottom spawn")
    );

    expect(topCall?.[1].y).toBe(-124);
    expect(bottomCall?.[1].y).toBe(284);
  });

  it("keeps singleton behavior stable under React Strict Mode", async () => {
    const firstTarget = createTarget();
    const view = render(
      <StrictMode>
        <Toaster toasterId="strict" container={() => firstTarget} />
      </StrictMode>
    );
    showToast({ toasterId: "strict", title: "Strict toast" });

    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(1));
    view.unmount();

    const secondTarget = createTarget();
    render(
      <StrictMode>
        <Toaster toasterId="strict" container={() => secondTarget} />
      </StrictMode>
    );

    expect(await within(secondTarget).findByText("Strict toast")).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });
});
