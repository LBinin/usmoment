import { ApiTable, row } from "../../shared/component-explorer/api-table";
import type { Locale } from "../../shared/i18n";

type InfoTableProps = {
  description: string;
  locale: Locale;
  rows: ReturnType<typeof row>[];
  title: string;
};

export function InfoTable(props: InfoTableProps) {
  return (
    <section>
      <div className="icons-block-heading">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      <div className="icons-section icons-info-table">
        <ApiTable locale={props.locale} rows={props.rows} />
      </div>
    </section>
  );
}
