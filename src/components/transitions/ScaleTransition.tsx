"use client";

import React from "react";
import { Transition } from "react-transition-group";
import {
  defaultDuration,
  scaleTransitionStyles,
  TransitionStyles,
} from "@/lib/animations/transitions";

interface ScaleTransitionProps {
  in?: boolean;
  duration?: number;
  children: React.ReactNode;
  styles?: TransitionStyles;
  onExited?: () => void;
  className?: string;
}

export function ScaleTransition({
  in: inProp = false,
  duration = defaultDuration,
  children,
  styles = scaleTransitionStyles,
  onExited,
  className,
}: ScaleTransitionProps) {
  return (
    <Transition
      in={inProp}
      timeout={duration}
      onExited={onExited}
      unmountOnExit
    >
      {(state) => (
        <div
          className={className}
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
