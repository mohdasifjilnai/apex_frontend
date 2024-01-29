import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { };

  headersFormulated: any;
  

  /** 
 * Invokes for create the params
 **/
  createParams(params: Object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (typeof (v) == 'string') {
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
      const productHeaders = productModules ? productModules : ''
      return this.http.post(url, data);
  }
/** 
 * Invokes HTTP get Request
 **/
  getRequest(url: string, productModules?: string) {
    let returnValue;
    const productHeaders = productModules ? productModules : ''
    return this.http.get(url, this.getHeaderAsProductModule(productHeaders));
    }
/** 
 * Invokes HTTP header data Request
 **/
    getHeaderAsProductModule(product: string, isDoc?: any, isToken?: any,isDashboardAuth?:any,isrefresh_token?:any) {
      // this.headersFormulated = this.setHeader.getHeaders(product, isDoc, isToken,isDashboardAuth,isrefresh_token);
      return this.headersFormulated;
    }
/** 
 * Invokes HTTP put Request
 **/
    putRequest(url: string, dataObtained: any, productModules?: string) {
      const data = dataObtained ? dataObtained : {};
      const productHeaders = productModules ? productModules : ''
      return this.http.put(url, data, this.getHeaderAsProductModule(productHeaders));
  }

  
  /** 
 * Invokes HTTP patch Request
 **/
   patchRequest(url: string, dataObtained: any, productModules?: string) {
    const data = dataObtained ? dataObtained : {};
    const productHeaders = productModules ? productModules : ''
    return this.http.patch(url, data, this.getHeaderAsProductModule(productHeaders));
}

deleteRequestWithToken(url:string,productModules?: string){
  const productHeaders = productModules ? productModules : ''
  return this.http.delete(url,this.getHeaderAsProductModule(productHeaders));
}
}
