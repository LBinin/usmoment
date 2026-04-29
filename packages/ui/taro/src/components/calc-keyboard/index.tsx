import React from "react";

type CalcKeyboardProps = {
  onPress: (token: string) => void;
};

export function CalcKeyboard(props: CalcKeyboardProps) {
  const keys = ["1", "2", "3", "+", "-", ".", "0"];

  return (
    <div>
      {keys.map((key) => (
        <button key={key} onClick={() => props.onPress(key)} type="button">
          {key}
        </button>
      ))}
    </div>
  );
}
