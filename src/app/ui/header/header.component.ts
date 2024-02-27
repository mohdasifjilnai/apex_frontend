import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
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
  @ViewChild('widgetId') widgetId!: ElementRef;
  constructor(private win: WindowRef, private authService: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
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
    setTimeout(() => {}, 2000);
  }
}
