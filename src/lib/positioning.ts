interface ComputePositionArgs {
  anchorElement: HTMLElement;
  desiredDimensions: {
    width: number;
    height: number;
  };
}

// const HEADER_HEIGHT = 30;
const MOBILE_BREAKPOINT = 560;
const RESPONSIVE_DIMENSIONS = {
  mobile: {
    width: 300,
    height: 200,
  },
  desktop: {
    width: 400,
    height: 260,
  },
};

export function computePopoverDimensions() {
  if (typeof window === "undefined") {
    return RESPONSIVE_DIMENSIONS.desktop;
  }

  if (window.innerWidth > MOBILE_BREAKPOINT) {
    return RESPONSIVE_DIMENSIONS.desktop;
  }

  return {
    width: window.innerWidth,
    height: 200,
  };
}

/** This will eventually be the height of the arrow. */
const VERTICAL_GAP = 5;

export function computePosition({
  anchorElement: anchor,
  desiredDimensions,
}: ComputePositionArgs) {
  const rect = anchor.getBoundingClientRect();
  const rectMiddle = rect.left + rect.width / 2;
  const desiredWidth = desiredDimensions.width;

  // First, try to place the rectangle where it should be, which is centered on the middle.
  let left = rectMiddle - desiredWidth / 2;
  if (left < 0) {
    left = 0;
  }

  // If the rectangle is too far to the right, we need to cut it off.
  let cutoffFromRight = 0;
  let right = left + desiredWidth;
  if (right > window.innerWidth) {
    cutoffFromRight = right - window.innerWidth;
    right = window.innerWidth;
  }

  // Widen the rectangle to the left by the amount we cut off from the right.
  left = left - cutoffFromRight;
  if (left < 0) {
    left = 0;
  }

  let width = right - left;

  let top = rect.bottom + window.scrollY + VERTICAL_GAP;
  let bottom = top + desiredDimensions.height;
  if (bottom > window.innerHeight + window.scrollY) {
    // flip the orientation.
    top = rect.top - desiredDimensions.height - VERTICAL_GAP + window.scrollY;
  }

  const position = {
    top,
    left,
  };

  const computedDimensions = {
    width,
    height: desiredDimensions.height,
  };

  return {
    computedDimensions,
    position,
  };
}
