/**
 * App module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/app.ts`.
 */
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vitasalud-mesa-ayuda');
}
