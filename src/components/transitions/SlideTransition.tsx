"use client";

import React from "react";
import { Transition } from "react-transition-group";
import {
  defaultDuration,
  TransitionStyles,
} from "@/lib/animations/transitions";

const slideStyles: TransitionStyles = {
  entering: { transform: "translateY(0)", opacity: 1 },
  entered: { transform: "translateY(0)", opacity: 1 },
  exiting: { transform: "translateY(20px)", opacity: 0 },
  exited: { transform: "translateY(20px)", opacity: 0 },
};

interface SlideTransitionProps {
  in?: boolean;
  duration?: number;
  children: React.ReactNode;
  styles?: TransitionStyles;
  onExited?: () => void;
}

export function SlideTransition({
  in: inProp = false,
  duration = defaultDuration,
  children,
  styles = slideStyles,
  onExited,
}: SlideTransitionProps) {
  return (
    <Transition
      in={inProp}
      timeout={duration}
      onExited={onExited}
      unmountOnExit
    >
      {(state) => (
        <div
          style={{
            transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
            ...styles[state],
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}
