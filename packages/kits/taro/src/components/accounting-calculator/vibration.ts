import type { BusinessKeyboardProps } from "@usmoment/ui-taro";

type AccountingCalculatorVibrationHost = {
  Taro?: {
    vibrateShort?: (options: {
      type?: Exclude<BusinessKeyboardProps["vibrate"], false>;
    }) => void;
  };
  wx?: {
    vibrateShort?: (options?: {
      type?: Exclude<BusinessKeyboardProps["vibrate"], false>;
    }) => void;
  };
};

export function triggerAccountingCalculatorVibration(
  vibrate: BusinessKeyboardProps["vibrate"],
): void {
  if (!vibrate) return;

  const host = globalThis as AccountingCalculatorVibrationHost;

  try {
    if (host.Taro?.vibrateShort) {
      host.Taro.vibrateShort({ type: vibrate });
      return;
    }

    if (host.wx?.vibrateShort) {
      host.wx.vibrateShort({ type: vibrate });
      return;
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(resolveVibrationDuration(vibrate));
    }
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
