import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // public loggedIn = new BehaviorSubject<boolean>(false);
  // public userExecutiveCode = new BehaviorSubject<string>('');
  // public obtainedToken = new BehaviorSubject<string>('');

  // constructor() {
  //   this.logOut = this.logOut.bind(this);
  // }

  // get isLoggedIn() {
  //   return this.loggedIn.asObservable();
  // }

  // getToken(data: any) {
  //   this.obtainedToken.next(data);
  // }

  // getUserExecutiveCode(data: any) {
  //   this.userExecutiveCode.next(data);
  // }

  // setUser = (user: {
  //   token: string;
  //   user_type: string;
  //   email: string;
  //   first_name: string;
  //   tier: string;
  //   registration_date: string;
  //   username: string;
  //   pos_code: string;
  // }) => {
  //   if (user && user.token) {
  //     localStorage.setItem('token', user.token);
  //     localStorage.setItem('ta_token', user.token);
  //     localStorage.setItem('ta_user_type', user.user_type);
  //     localStorage.setItem('ta_user_email', user.email);
  //     localStorage.setItem('ta_user_name', user.first_name);
  //     localStorage.setItem('tier', user.tier);
  //     localStorage.setItem('registration_date', user.registration_date);
  //     localStorage.setItem('code', user.username);
  //     localStorage.setItem('ta_pos_code', user.pos_code);
  //     this.loggedIn.next(true);
  //     this.getToken(user.token);
  //     this.getUserExecutiveCode(user.username);
  //   } else {
  //     this.logOut();
  //   }
  // };

  // /**
  //  * We don't required logout function
  //  * as currenlty we are not checcking for this
  //  * just to clear out value
  //  */
  // logOut() {
  //   localStorage.removeItem('ta_token');
  //   localStorage.removeItem('ta_user_type');
  //   localStorage.removeItem('ta_partner_id');
  //   localStorage.removeItem('ta_user_email');
  //   localStorage.removeItem('ta_user_name');
  //   localStorage.removeItem('registration_date');
  //   localStorage.removeItem('tier');
  //   localStorage.removeItem('code');
  //   this.loggedIn.next(false);

  //   // window.location.href = environment.apex;
  // }

  public loggedIn = new BehaviorSubject<boolean>(false);
  public userExecutiveCode = new BehaviorSubject<string>('');
  public obtainedToken = new BehaviorSubject<string>('');
  standAloneUrl: any;
  standAloneFlag: any;

  constructor() {
    this.logOut = this.logOut.bind(this);

    this.standAloneUrl = window.location.href;
    this.standAloneFlag = this.standAloneUrl.includes('stand-alone-helpdesk');
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getToken(data: any) {
    this.obtainedToken.next(data);
  }

  getUserExecutiveCode(data: any) {
    this.userExecutiveCode.next(data);
  }

  setUser = (user: {
    token: string;
    user_type: string;
    email: string;
    first_name: string;
    tier: string;
    registration_date: string;
    username: string;
    pos_code: string;
  }) => {
    if (user && user.token) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('ta_token', user.token);
      localStorage.setItem('ta_user_type', user.user_type);
      localStorage.setItem('ta_user_email', user.email);
      localStorage.setItem('ta_user_name', user.first_name);
      localStorage.setItem('tier', user.tier);
      localStorage.setItem('registration_date', user.registration_date);
      localStorage.setItem('code', user.username);
      localStorage.setItem('ta_pos_code', user.pos_code);
      this.loggedIn.next(true);
      this.getToken(user.token);
      this.getUserExecutiveCode(user.username);
    } else {
      this.logOut();
    }
  };

  /**
   * We don't required logout function
   * as currenlty we are not checcking for this
   * just to clear out value
   */
  logOut() {
    localStorage.removeItem('ta_token');
    localStorage.removeItem('ta_user_type');
    localStorage.removeItem('ta_partner_id');
    localStorage.removeItem('ta_user_email');
    localStorage.removeItem('ta_user_name');
    localStorage.removeItem('registration_date');
    localStorage.removeItem('tier');
    localStorage.removeItem('code');
    this.loggedIn.next(false);

    const token = localStorage.getItem('token');
    if (token) {
      if (!this.standAloneFlag) {
        // window.location.href = environment.partner_v2;
      }
    }
  }

  getTokenFromStorage() {
    return localStorage.getItem('token');
  }
}
