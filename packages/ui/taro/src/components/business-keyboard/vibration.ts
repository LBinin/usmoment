import type { BusinessKeyboardVibrate } from "./index";

type VibrationHost = {
  Taro?: {
    vibrateShort?: (options: { type?: Exclude<BusinessKeyboardVibrate, false> }) => void;
  };
  wx?: {
    vibrateShort?: (options?: { type?: Exclude<BusinessKeyboardVibrate, false> }) => void;
  };
};

export function triggerVibration(
  vibrate: BusinessKeyboardVibrate | undefined,
): void {
  if (!vibrate) return;

  const host = globalThis as VibrationHost;

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
