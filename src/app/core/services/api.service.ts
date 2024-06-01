import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Subject, catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FailureDialogComponent } from '../../../app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpService: HttpService, public dialog: MatDialog) {}
  getStatusEvent: Subject<any> = new Subject();
  addressLine: any = false;

  /**
   * method for get request api
   **/
  getRequestedResponse(
    url: string,
    productModuleName?: string,
    queryParamsUrl?: string
  ) {
    if (queryParamsUrl) {
      url = url + queryParamsUrl;
    }
    return this.httpService.getRequest(url, productModuleName).pipe(
      map((response: any) => response),
      catchError((err: any) => JSON.stringify(this.errorHandler(err)))
    );
  }
  errorHandler(err: any) {
    let error;
    const status = err;
    this.setStatusEvent(err);
    if (err.error) {
      error = err.error;
    } else if (err.details) {
      error = err.detail;
    } else {
      error = err;
    }

    if (err.status !== 401) {
      if (err.status !== 200) {
        if (
          err.status == 422 &&
          err.url.includes('api/v1/proposal/create_update_proposal/')
        ) {
          this.addressLine = false;
          if (err?.error?.detail[0]) {
            for (let error of err?.error?.detail[0]?.loc) {
              if (error === 'address_line') {
                this.addressLine = true;
              }
            }
            if (!this.addressLine) {
              const dialogRef = this.dialog.open(FailureDialogComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  errorData: error,
                  statusdata: status,
                },
                panelClass: 'failure-dialog-class',
              });
              dialogRef.afterClosed().subscribe((result: any) => {});
            }
          }
        } else if (err.status == 502) {
          const dialogRef = this.dialog.open(FailureDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {
              errorData: 'Bad gateway request',
              statusdata: status,
            },
            panelClass: 'failure-dialog-class',
          });
          dialogRef.afterClosed().subscribe((result: any) => {});
        }
        else if (err.status == 413) {
          const dialogRef = this.dialog.open(FailureDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {
              errorData: 'File size should not be more than 1MB',
              statusdata: status,
            },
            panelClass: 'failure-dialog-class',
          });
          dialogRef.afterClosed().subscribe((result: any) => {});
        } 
        else {
          const dialogRef = this.dialog.open(FailureDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {
              errorData: error,
              statusdata: status,
            },
            panelClass: 'failure-dialog-class',
          });
          dialogRef.afterClosed().subscribe((result: any) => {});
        }
      }
    } else if (err.status == 401) {
      localStorage.clear();
    }
  }

  setStatusEvent(addOnDataEmiited: any) {
    this.getStatusEvent.next(addOnDataEmiited);
  }

  /**
   * method for get request api without popup
   **/
  getRequestedResponsewithoutpopup(url: string, productModuleName?: string) {
    return this.httpService
      .getRequest(url, productModuleName)
      .pipe(catchError(this.handleError));
  }
  /**
   * method for post request api
   **/
  postRequestedResponse(url: any, body: any) {
    return this.httpService.postRequest(url, body).pipe(
      map((response: any) => response),
      catchError((err: any) => JSON.stringify(this.errorHandler(err)))
    );
  }

  /**
   * method for post request api
  //  **/
  // postRequestedResponseCreateProposal(url: any, body: any) {
  //   return this.httpService.postRequest(url, body).pipe(
  //     map((response: any) => response),
  //     catchError((err: HttpErrorResponse) => {
  //       JSON.stringify(err);
  //       return throwError(err);
  //     })
  //   );
  // }

  postRequestedResponseCreateProposal(url: any, body: any) {
    return this.httpService.postRequest(url, body).pipe(
      map((response: any) => response),
      catchError((err: HttpErrorResponse) => {
        JSON.stringify(err);
        JSON.stringify(this.errorHandler(err));
        return throwError(err);
      })
    );
  }
  /**
   * method for put request api
   **/
  putRequestedResponse(url: any, body: any) {
    return this.httpService.putRequest(url, body).pipe(
      map((response: any) => response),
      catchError((err: any) => JSON.stringify(this.errorHandler(err)))
    );
  }
  /**
   * method for patch request api
   **/
  patchRequestedResponse(url: any, body: any) {
    return this.httpService.patchRequest(url, body).pipe(
      map((response: any) => response),
      catchError((err: any) => JSON.stringify(this.errorHandler(err)))
    );
  }

  /**
   * method for post request api without popup
   **/
  postRequestedResponsewithoutpopup(url: any, body: any) {
    return this.httpService.postRequest(url, body).pipe(
      catchError((err: HttpErrorResponse) => {
        JSON.stringify(err);
        return throwError(err);
      })
    );
  }
  deleteData(url: any, body?: any) {
    return this.httpService.deleteRequestWithToken(url, body).pipe(
      map((response) => response),
      catchError((err) => JSON.stringify(err))
    );
  }

  deleteDataWithoutPopup(url: any, body?: any) {
    return this.httpService
      .deleteRequestWithToken(url, body)
      .pipe(catchError(this.handleError));
  }
  /**
   * method use for the error handing
   **/
  private handleError(error: HttpErrorResponse) {
    let errormessage: any;
    if (error) {
      for (const key in error.error) {
        errormessage = error.error[`${key}`];
      }
    }

    // Return an observable with a user-facing error message.
    // errormessage+="invalid"
    return throwError(() => new Error(errormessage));
  }
}
