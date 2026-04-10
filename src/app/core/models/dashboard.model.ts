/**
 * Dashboard Model module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/core/models/dashboard.model.ts`.
 */
export interface DashboardMetric {
  label: string;
  value: number;
  accent?: string;
}

export interface DashboardBarDatum {
  label: string;
  value: number;
}
