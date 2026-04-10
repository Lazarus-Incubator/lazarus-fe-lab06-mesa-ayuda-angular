import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DataPanelComponent } from '../../../../shared/components/data-panel/data-panel.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DataPanelComponent,
    EmptyStateComponent,
    EnumLabelPipe,
    LoadingStateComponent,
    NgStyle,
    PageHeaderComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly vm$ = this.dashboardService.getDashboard();

  width(value: number, total: number): string {
    if (!total) {
      return '0%';
    }

    return `${Math.max((value / total) * 100, 6)}%`;
  }

  hasBarData(values: Array<{ value: number }>): boolean {
    return values.some((item) => item.value > 0);
  }
}
