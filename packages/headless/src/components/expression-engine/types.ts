export type EngineOptions = {
  scale?: number;
};

export type ExpressionEngine = {
  backspace: () => void;
  input: (token: string) => void;
  evaluate: () => string;
  expression: () => string;
  clear: () => void;
};
