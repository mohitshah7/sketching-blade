// src/utils/useSwipe.js
import { useRef } from 'react';

/**
 * Reusable touch swipe hook for mobile gallery navigation.
 * - Swipe left -> calls onSwipeLeft (typically next image)
 * - Swipe right -> calls onSwipeRight (typically previous image)
 * - Ensures horizontal intent so normal vertical scrolling is never hijacked.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 45 }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Must exceed threshold and have strong horizontal orientation to prevent interference with vertical scrolling
    if (Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return { onTouchStart, onTouchEnd };
}

