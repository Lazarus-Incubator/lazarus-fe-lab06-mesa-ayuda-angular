/**
 * Loading State Component module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/shared/components/loading-state/loading-state.component.ts`.
 */
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.css'
})
export class LoadingStateComponent {
  readonly label = input('Cargando informacion...');
}
