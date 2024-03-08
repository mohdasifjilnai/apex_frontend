import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { PremiumBreakupComponent } from 'src/app/shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { ShareQuotesComponent } from 'src/app/shared/components/dialog-components/share-quotes/share-quotes.component';
import { ProposalShareComponent } from 'src/app/shared/components/proposal-share/proposal-share.component';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.scss'],
})
export class InsuranceDetailsComponent implements OnInit {
  insuranceDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ProposalShareComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'insurance-details-class',
  };
  showCard: boolean = false;
  quoteData: any;
  mmvData: any;
  reviewURL: boolean=false;

  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.url.subscribe((segments) => {
      const proposalSegment = segments.find(
        (segment) => segment.path === 'review'
      );
      if (proposalSegment) {
        const proposalValue = proposalSegment.path;
        this.reviewURL = true;
      }
    });
  }

  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
  }

  openShareModal(data: any) {
    this.openModal(data, this.insuranceDetailsJSON);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '100%';
      resTop = '0';
    }

    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  changeInsurer() {
    this.router.navigate(['/motor/quotes']);
  }
  premiumBreakup() {
    this.bottomSheet.open(PremiumBreakupComponent);
  }
}
