"use client";

import React from 'react';
import { Transition } from 'react-transition-group';
import { defaultDuration, defaultTransitionStyles, TransitionStyles } from '@/lib/animations/transitions';

interface FadeTransitionProps {
  in?: boolean;
  duration?: number;
  children: React.ReactNode;
  styles?: TransitionStyles;
  onExited?: () => void;
}

export function FadeTransition({
  in: inProp = false,
  duration = defaultDuration,
  children,
  styles = defaultTransitionStyles,
  onExited,
}: FadeTransitionProps) {
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
            transition: `opacity ${duration}ms ease-in-out`,
            ...styles[state],
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}