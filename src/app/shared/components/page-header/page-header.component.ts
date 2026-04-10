/**
 * Page Header Component module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/shared/components/page-header/page-header.component.ts`.
 */
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
