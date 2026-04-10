/**
 * Main module.
 *
 * @remarks Provides the TypeScript implementation for `src/main.ts`.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
