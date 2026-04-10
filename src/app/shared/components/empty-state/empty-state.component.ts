/**
 * Empty State Component module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/shared/components/empty-state/empty-state.component.ts`.
 */
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('No hay elementos para mostrar.');
}
