import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { NavigationEnd, Router } from '@angular/router';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentUrl: any;
  extractedPath: any;
  constructor(private router: Router,public bottomSheet: MatBottomSheet,) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        const urlParts = this.currentUrl.split('/');
        this.extractedPath=urlParts.length
      }
    });
  }

  ngOnInit(): void {

  }
  termsCondition(){
    if (window.innerWidth <= 999) {
      const bottomSheetConfig: MatBottomSheetConfig = {
        data: 'footer',
      };
      this.bottomSheet.open(TermsComponent,bottomSheetConfig);
    }
  }

}
