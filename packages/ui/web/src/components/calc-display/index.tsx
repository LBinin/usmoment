import React from "react";
import "./style.css";

export type CalcDisplayProps = {
  animated?: boolean;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  className?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  expression: string;
  expressionClassName?: string;
  expressionStyle?: React.CSSProperties;
  expressionVisible?: boolean;
  footer?: React.ReactNode;
  footerClassName?: string;
  footerStyle?: React.CSSProperties;
  header?: React.ReactNode;
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  prefix?: React.ReactNode;
  prefixClassName?: string;
  prefixStyle?: React.CSSProperties;
  result: string;
  resultClassName?: string;
  resultStyle?: React.CSSProperties;
  shouldShowExpression?: (expression: string) => boolean;
  style?: React.CSSProperties;
};

export function CalcDisplay(props: CalcDisplayProps) {
  const animated = props.animated ?? true;
  const expression = props.expression;
  const hasExpression = expression.trim().length > 0;
  const isExpressionVisible =
    hasExpression &&
    (props.expressionVisible ??
      props.shouldShowExpression?.(props.expression) ??
      false);

  return (
    <div
      className={joinClassNames(
        "usm-calc-display",
        isExpressionVisible
          ? "usm-calc-display--expression-visible"
          : "usm-calc-display--expression-hidden",
        !animated && "usm-calc-display--motionless",
        props.className,
      )}
      style={props.style}
    >
      {props.header !== undefined && (
        <div
          className={joinClassNames(
            "usm-calc-display__header",
            props.headerClassName,
          )}
          style={props.headerStyle}
        >
          {props.header}
        </div>
      )}
      <div
        className={joinClassNames(
          "usm-calc-display__body",
          props.bodyClassName,
        )}
        style={props.bodyStyle}
      >
        {props.prefix !== undefined && (
          <div
            className={joinClassNames(
              "usm-calc-display__prefix",
              props.prefixClassName,
            )}
            style={props.prefixStyle}
          >
            {props.prefix}
          </div>
        )}
        <div
          className={joinClassNames(
            "usm-calc-display__content",
            props.contentClassName,
          )}
          style={props.contentStyle}
        >
          <div
            className={joinClassNames(
              "usm-calc-display__result",
              props.resultClassName,
            )}
            style={{
              transform: isExpressionVisible
                ? "scale(1)"
                : "scale(var(--usm-calc-display-result-scale, 1.5))",
              ...props.resultStyle,
            }}
          >
            {props.result || "0"}
          </div>
          <div
            aria-hidden={!isExpressionVisible}
            className={joinClassNames(
              "usm-calc-display__expression",
              props.expressionClassName,
            )}
            style={props.expressionStyle}
          >
            {expression}
          </div>
        </div>
      </div>
      {props.footer !== undefined && (
        <div
          className={joinClassNames(
            "usm-calc-display__footer",
            props.footerClassName,
          )}
          style={props.footerStyle}
        >
          {props.footer}
        </div>
      )}
    </div>
  );
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
