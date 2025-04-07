import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SetHeaderService } from './set-header.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private setHeader: SetHeaderService) {}

  headersFormulated: any;

  /**
   * Invokes for create the params
   **/
  createParams(params: Object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v == 'string') {
          httpParams = httpParams.set(k, v);
        } else {
          httpParams = httpParams.set(k, JSON.stringify(v));
        }
      }
    }
    return httpParams;
  }
  /**
   * Invokes HTTP post Request
   **/
  postRequest(url: string, dataObtained: any, productModules?: string) {
    const data = dataObtained ? dataObtained : {};
    const productHeaders = productModules ? productModules : '';
    return this.http.post(
      url,
      data,
      this.getHeaderAsProductModule(productHeaders)
    );
  }
  /**
   * Invokes HTTP get Request
   **/
  getRequest(url: string, productModules?: string) {
    let returnValue;
    const productHeaders = productModules ? productModules : '';
    return this.http.get(url, this.getHeaderAsProductModule(productHeaders));
  }
  /**
   * Invokes HTTP header data Request
   **/
  getHeaderAsProductModule(isToken?: any) {
    this.headersFormulated = this.setHeader.getHeaders(isToken);
    return this.headersFormulated;
  }
  /**
   * Invokes HTTP put Request
   **/
  putRequest(url: string, dataObtained: any, productModules?: string) {
    const data = dataObtained ? dataObtained : {};
    const productHeaders = productModules ? productModules : '';
    return this.http.put(
      url,
      data,
      this.getHeaderAsProductModule(productHeaders)
    );
  }

  /**
   * Invokes HTTP patch Request
   **/
  patchRequest(url: string, dataObtained: any, productModules?: string) {
    const data = dataObtained ? dataObtained : {};
    const productHeaders = productModules ? productModules : '';
    return this.http.patch(
      url,
      data,
      this.getHeaderAsProductModule(productHeaders)
    );
  }

  deleteRequestWithToken(url: string, productModules?: string) {
    const productHeaders = productModules ? productModules : '';
    return this.http.delete(url, this.getHeaderAsProductModule(productHeaders));
  }

  getData(url:any): Observable<any> {
    // Create custom headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',  // Make sure content type is set correctly
      'Authorization': environment?.token,  // Use token from localStorage or sessionStorage
      'key-1': environment?.key_1, // Example of custom headers
      'key-2': environment?.key_2
    });

    // Make HTTP GET request with headers
    return this.http.get<any>(url, { headers });
  }
}
