import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class GlobalLoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService:LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = performance.now(); // Record the start time
    return next.handle(request).pipe(
      tap(() => {
        const endTime = performance.now(); // Record the end time
        const pendingTime = endTime - startTime; // Calculate the pending time
        if(pendingTime>=1000){
          this.loaderService.show();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    )
  }
}
