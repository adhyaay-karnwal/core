import { DailyWidgetGrid } from "./daily-widget-grid.client";
import type { OverviewCell, WidgetOption } from "~/components/overview/types";

interface Props {
  /** `null` = layout never persisted (apply defaults). `[]` = user removed all. */
  initialCells: OverviewCell[] | null;
  widgetOptions: WidgetOption[];
  onSave: (cells: OverviewCell[]) => void;
  widgetPat: string | null;
  baseUrl: string;
}

export function DailyWidgetPanel({
  initialCells,
  widgetOptions,
  onSave,
  widgetPat,
  baseUrl,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <DailyWidgetGrid
        initialCells={initialCells}
        widgetOptions={widgetOptions}
        onSave={onSave}
        widgetPat={widgetPat}
        baseUrl={baseUrl}
      />
    </div>
  );
}
