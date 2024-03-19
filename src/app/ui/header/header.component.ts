import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
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
  isCopied: boolean = false;
  transactionId: any;
  currentUrl: any;
  @ViewChild('widgetId') widgetId!: ElementRef;
  constructor(
    private win: WindowRef,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.sharedService.getTransactionId.subscribe((res: any) => {
      this.transactionId = res;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        this.isTracId = this.currentUrl !== '/motor';
      }
    });

    /**
     * If the current URL is lost after a refresh, navigate to the current URL
     */
    if (!this.currentUrl) {
      this.currentUrl = this.router.url;
      this.isTracId = this.currentUrl !== '/motor';
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
    this.isCopied = true; // Set isCopied to true after copying
    this.sharedService.openSnackBar('Trace ID copied', 'Success');
    setTimeout(() => {
      this.isCopied = false; // Reset isCopied after 3 seconds
    }, 3000);
  }
}
