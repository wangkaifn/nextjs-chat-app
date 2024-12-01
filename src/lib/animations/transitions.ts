import { CSSProperties } from "react";

export interface TransitionStyles {
  unmounted?: CSSProperties;
  exiting?: CSSProperties;
  exited?: CSSProperties;
  entered?: CSSProperties;
  entering?: CSSProperties;
}

export const defaultTransitionStyles: TransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: { opacity: 0 },
};

export const slideTransitionStyles: TransitionStyles = {
  entering: { transform: "translateY(0)", opacity: 1 },
  entered: { transform: "translateY(0)", opacity: 1 },
  exiting: { transform: "translateY(20px)", opacity: 0 },
  exited: { transform: "translateY(20px)", opacity: 0 },
  unmounted: { transform: "translateY(20px)", opacity: 0 },
};

export const scaleTransitionStyles: TransitionStyles = {
  entering: { transform: "scale(1)", opacity: 1 },
  entered: { transform: "scale(1)", opacity: 1 },
  exiting: { transform: "scale(0.95)", opacity: 0 },
  exited: { transform: "scale(0.95)", opacity: 0 },
  unmounted: { transform: "scale(0.95)", opacity: 0 },
};

export const defaultDuration = 300;

export const defaultEasing = "cubic-bezier(0.4, 0, 0.2, 1)";
