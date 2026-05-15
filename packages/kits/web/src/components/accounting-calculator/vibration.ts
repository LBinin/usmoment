import type { BusinessKeyboardProps } from "@usmoment/ui-web";

export function triggerAccountingCalculatorVibration(
  vibrate: BusinessKeyboardProps["vibrate"],
): void {
  if (!vibrate || typeof navigator === "undefined" || !navigator.vibrate) {
    return;
  }

  try {
    navigator.vibrate(resolveVibrationDuration(vibrate));
  } catch {
    // Haptic feedback is best-effort and should never block panel closing.
  }
}

function resolveVibrationDuration(
  vibrate: Exclude<BusinessKeyboardProps["vibrate"], false>,
): number {
  if (vibrate === "heavy") return 30;
  if (vibrate === "medium") return 20;
  return 10;
}
