import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SetHeaderService {
  httpHeaders: any;

  constructor() {}

  gettoken() {
    return !!localStorage.getItem('token');
  }

  getHeaders(isToken: boolean) {
    const token = localStorage.getItem('token');

    {
      /**
       * product type will get from http headers
       * As this has to be maintain at UI end
       * So that product headers can be configurable according to prodct need
       * Thus it will be avoidabel to maintain at http end
       */
      // const token = localStorage.getItem('token');

      this.httpHeaders = {
        headers: new HttpHeaders(''),
      };
    }
    if (token) {
      this.httpHeaders.headers = this.httpHeaders.headers.append(
        'Authorization',
        `Token ${token}`
      );
    }

    return this.httpHeaders;
  }
}
