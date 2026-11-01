import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ApiError {
  status: number;
  msg?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let msg: string | undefined;

      if (error.status === 0) {
        msg = !navigator.onLine
          ? 'No internet connection. Please check your network.'
          : 'Cannot connect to the server. Please try again.';
      } else {
        msg = error.error?.msg; // undefined if backend sent no msg (e.g. HTML from a proxy)
      }

      return throwError(() => ({ status: error.status, msg }) as ApiError);
    })
  
  );