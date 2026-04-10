import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../utils/api.util';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);

  const request = req.clone({
    url: isAbsoluteUrl ? req.url : `${API_BASE_URL}/${req.url}`,
    setHeaders: authService.snapshot
      ? {
          'X-User-Id': `${authService.snapshot.id}`
        }
      : {}
  });

  return next(request);
};
