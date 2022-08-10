import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AppContextService } from '../services/app-context.service';
import { AlertDialogComponent } from '@spidersmart/ng';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private toastService: ToastrService,
        private dialog: MatDialog,
        private appContextService: AppContextService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError (error => {
                    if (error instanceof HttpErrorResponse) {
                        switch (error.status) {
                            case 404:
                                this.toastService.error('There was an issue contacting the server.  Please try again.');
                                break;
                            case 403:
                                this.toastService.error('You do not have authorization to perform that action.');
                                break;
                            case 401:
                                const accessDeniedDialog = this.dialog.open(AlertDialogComponent, {
                                    data: {
                                        title: 'Authentication Invalid',
                                        alert: 'Your login session has expired or been invalidated. Please login again.',
                                        buttonText: 'Login Now'
                                    }
                                });
                                accessDeniedDialog.afterClosed().subscribe((confirmed: boolean) => {
                                    window.location.href = this.appContextService.getEnvironmentVariable('authUrl');
                                });
                                break;
                        }
                    }
                    return throwError(error);
                }
            )
        );
    }
}
