/**
 * App Config module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/app.config.ts`.
 */
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { apiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiPrefixInterceptor]))
  ]
};
