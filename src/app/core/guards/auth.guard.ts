import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (sessionStorage.getItem('isPayment')) {
      this.router.navigate(['motor']);
      return false;
    }else if(sessionStorage.getItem('proposal_punched')=='true'){
      let transactionId=sessionStorage.getItem('transaction_id')
      this.router.navigate([`motor/quotes/proposal/${transactionId}/review/payment-failure`]);
      return false
    }
    return true;
  }
}
