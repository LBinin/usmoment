import type { BusinessKeyboardVibrate } from "./index";

export function triggerVibration(
  vibrate: BusinessKeyboardVibrate | undefined,
): void {
  if (!vibrate || typeof navigator === "undefined" || !navigator.vibrate) {
    return;
  }

  try {
    navigator.vibrate(resolveVibrationDuration(vibrate));
  } catch {
    // Haptic feedback is best-effort and should never block keyboard input.
  }
}

function resolveVibrationDuration(
  vibrate: Exclude<BusinessKeyboardVibrate, false>,
): number {
  if (vibrate === "heavy") return 30;
  if (vibrate === "medium") return 20;
  return 10;
}
