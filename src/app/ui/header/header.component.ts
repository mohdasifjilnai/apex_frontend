import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { HelplineNumberComponent } from 'src/app/shared/components/dialog-components/helpline-number/helpline-number.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  elem: any;
  env = environment;
  isLoggedInVal: Observable<boolean> | any;
  d2dFlag: boolean = false;
  d2dExecutive: any;
  partnerStatusData: any;
  qrDisabled: boolean = false;
  isTracId: boolean = false;
  // isCopied: boolean = false;
  transactionId: any;
  currentUrl: any;
  @ViewChild('widgetId') widgetId!: ElementRef;
  id: any;
  copiedId: any;
  transactionIDByUrl: any;
  tokenData: any;
showProfile: any;
  partner_code: any;
  partner_name: any;
  first_name: any;
  last_name: any;
  middle_name: any;
  first_letter: any;
  partnerCodewithTraceId: any;
  constructor(
    private win: WindowRef,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedDataService,
    public bottomSheet: MatBottomSheet,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = sessionStorage.getItem('transaction_id');
    this.isLoggedInVal = this.authService.isLoggedIn;
    const userInfo = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    )?.executive_code;
    // this.d2dExecutive = userInfo?.split('D2D');
    // if (this.d2dExecutive.length > 1 && this.d2dExecutive[0] == '') {
    //   this.d2dFlag = true;
    // } else {
    //   this.d2dFlag = false;
    // }
    this.transactionIDByUrl = this.router.url.split('/')[3];

    if (window.innerWidth <= 999) {
      this.transactionId =
        this.id?.length > 10 ? this.id.substring(0, 10) + '...' : this.id;
      this.copiedId = this.id;
    } else if (this.id) {
      this.transactionId = this.id;
      this.copiedId = this.id;
    } else {
      this.transactionId = this.transactionIDByUrl;
      this.copiedId = this.transactionIDByUrl;
    }
    this.sharedService.getTransactionId.subscribe((res: any) => {
      if (window.innerWidth <= 999) {
        this.transactionId =
          res.length > 10 ? res.substring(0, 10) + '...' : res;
        this.copiedId = res;
      } else {
        this.transactionId = res;
        this.copiedId = res;
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        this.isTracId = this.currentUrl !== '/';
      }
    });

    /**
     * If the current URL is lost after a refresh, navigate to the current URL
     */
    if (!this.currentUrl) {
      this.currentUrl = this.router.url;
      this.isTracId = this.currentUrl !== '/';
    }
    /**
     * subscribe when the redirection is done from Review page on clicking of share button
     */
    this.sharedService?.insurerDetails?.subscribe((res) => {
      if (res) {
        if (window.innerWidth <= 999) {
          this.transactionId =
            res?.quote_response?.transaction_id.length > 10
              ? res?.quote_response?.transaction_id.substring(0, 10) + '...'
              : res?.quote_response?.transaction_id;

          this.copiedId = res?.quote_response?.transaction_id;
        } else {
          this.transactionId = res?.quote_response?.transaction_id;
          this.copiedId = res?.quote_response?.transaction_id;
        }
      }
    });
    this.tokenData = localStorage.getItem('token');
    if(this.tokenData){
      this.partner_code=localStorage.getItem('partner_code');
      this.first_name=localStorage.getItem('first_name')
      this.first_letter=this.first_name.charAt(0)
      this.middle_name=localStorage.getItem('middle_name')
      this.last_name=localStorage.getItem('last_name')
      this.partnerCodewithTraceId=JSON.parse(sessionStorage.getItem('partnerCodeTraceId') || '{}')
      if(this.partnerCodewithTraceId?.partner_code != undefined && this.partnerCodewithTraceId?.partner_code != null && this.partnerCodewithTraceId?.partner_code != ''){
        if(this.partnerCodewithTraceId?.partner_code != this.partner_code){
          this.tokenData=false
        }
      }
      this.sharedService.partnerCodeFromApiRes.subscribe((res) => {
        if (res !=this.partner_code) {
          this.tokenData=false
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.widgetId != undefined) {
      this.elem = this.widgetId.nativeElement;

      new this.win.nativeWindow.RB_AMS_SDK({
        userInfo: this.elem,
        islogIn: this.authService.setUser,
        UserlogOut: this.authService.logOut,
        amsurl: this.env.amsurl,
        partnerJourney: true,
        partnerUrl: this.env.profile_redirection,
      });
    }
  }
  helplineNumber() {
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(HelplineNumberComponent);
    }
  }
  /**
   * Copies the given text to the clipboard.
   * @param val the text to copy
   */
  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    // this.isCopied = true; // Set isCopied to true after copying
    this.sharedService.openSnackBar('Trace ID copied', true, 3000);
    // setTimeout(() => {
    //   this.isCopied = false; // Reset isCopied after 3 seconds
    // }, 3000);
  }
  /**
   * Redirects the user to the home page.
   */
  redirectHome() {
    this.router.navigate(['']);
  }
  profile(){
    this.showProfile=!this.showProfile
  }
}
