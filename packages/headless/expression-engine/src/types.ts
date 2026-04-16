export type EngineOptions = {
  scale?: number;
};

export type ExpressionEngine = {
  input: (token: string) => void;
  evaluate: () => string;
  expression: () => string;
  clear: () => void;
};
