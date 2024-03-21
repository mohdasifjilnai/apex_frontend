import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
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
    modalName: ShareQuotesComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  showCard: boolean = false;
  quoteData: any;
  mmvData: any;
  reviewURL: boolean = false;
  gstToggleData: any;
  isRedirectData: boolean = false;
  redirectInsurerData: any;
  mmvItem: any;
  planType: any;

  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private sharedData: SharedDataService,
    private apiservice: ApiService
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
    this.planType = JSON.parse(sessionStorage.getItem('planType') || '{}');
    let gstValue = sessionStorage.getItem('gstValue');
    if (gstValue) {
      this.gstToggleData = JSON.parse(gstValue);
    }
    /**
     * subscribe when the redirection is done from Review page on clicking of share button
     */
    this.sharedData?.insurerDetails?.subscribe((res) => {
      if (res) {
        this.quoteData = res?.quote_response;
        this.getVehicleMMVPopup(
          res?.quote_request?.vehicle_type,
          res?.quote_request?.rb_mmv_id
        );
      }
    });
    const proposalParam = sessionStorage.getItem('proposal_param');
    if (proposalParam) {
      this.isRedirectData = true;
    }
    let mmvData = JSON.parse(sessionStorage.getItem('mmvData') || '{}');
    if (mmvData) {
      this.mmvItem = mmvData;
    }
    this.sharedData?.redirectInsurerDetails?.subscribe((res) => {
      if (res) {
        this.redirectInsurerData = res;
      }
    });
  }

  openShareModal() {
    this.openModal([this.quoteData], this.insuranceDetailsJSON);
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
  getVehicleMMVPopup(productType: any, mmvId: any) {
    let apiData;
    apiData = `?product_name=${productType}&rb_mmv_id=${mmvId}`;
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res) => {
        this.mmvItem = res;
        sessionStorage.setItem('mmvData', JSON.stringify(res));
      });
  }
}
