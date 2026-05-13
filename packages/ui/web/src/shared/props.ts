export type ResolvableProp<TInput, TValue> =
  | TValue
  | ((input: TInput) => TValue | undefined)
  | undefined;

export function resolvePropValue<TInput, TValue>(
  prop: ResolvableProp<TInput, TValue>,
  input: TInput,
): TValue | undefined {
  if (typeof prop === "function") {
    return (prop as (input: TInput) => TValue | undefined)(input);
  }

  return prop;
}
