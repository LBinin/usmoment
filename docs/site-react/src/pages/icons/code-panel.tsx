import { StaticCodeBlock } from "../../shared/component-explorer/code-block";

type CodePanelProps = {
  code: string;
  copiedLabel: string;
  copyLabel: string;
  label: string;
};

export function CodePanel(props: CodePanelProps) {
  return (
    <section className="icons-code-panel">
      <h3>{props.label}</h3>
      <StaticCodeBlock
        copiedLabel={props.copiedLabel}
        copyLabel={props.copyLabel}
        value={props.code}
      />
    </section>
  );
}
