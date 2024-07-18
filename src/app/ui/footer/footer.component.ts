import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { NavigationEnd, Router } from '@angular/router';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentUrl: any;
  extractedPath: any;
  payout: boolean = false;
  constructor(private router: Router, public bottomSheet: MatBottomSheet) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        const urlParts = this.currentUrl.split('/');
        this.extractedPath = urlParts.length;
      }
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const executive_code = localStorage.getItem('partner_code');
    if (token != null && executive_code != null) {
      this.payout = true;
    }
  }
  termsCondition() {
    if (window.innerWidth <= 999) {
      const bottomSheetConfig: MatBottomSheetConfig = {
        data: 'footer',
        panelClass: 'terms-class',
      };
      this.bottomSheet.open(TermsComponent, bottomSheetConfig);
    }
  }
}
