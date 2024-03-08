import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { OtpComponent } from 'src/app/shared/components/dialog-components/otp/otp.component';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-proposal-review',
  templateUrl: './proposal-review.component.html',
  styleUrls: ['./proposal-review.component.scss'],
})
export class ProposalReviewComponent implements OnInit {
  otpDialog: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: OtpComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'otp-popup',
  };
  termsAndConditionJson: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: TermsComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'terms-class',
  };
  quoteData: any;
  generateProposalData: any;
  transactionId: any;

  constructor(
    private route: Router,
    private shareData: SharedDataService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.generateProposal();
  }
  navigateToUrl(titleName: string) {
    this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
    this.shareData.sendProposalReviewEditId(titleName);
  }
  back() {
    this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
  }
  submitReview() {
    let sendCommunicationObject = {
      transaction_id: this.quoteData?.transaction_id,
      share_type: 'otp',
      partner_name: this.generateProposalData?.customer_details?.full_name,
      URL: `${environment['apex']}motor/quotes/proposal/${this.quoteData?.transaction_id}/review`,
      mail_id: this.generateProposalData?.customer_details?.email_id,
      mobile_no: this.generateProposalData?.customer_details?.mobile_number,
      quote_id: [this.quoteData?.quote_id],
      quote_request_id: this.quoteData?.quote_request_id,
    };
    this.apiService
      .postRequestedResponse(`${ApiConstants.send_communication}`, sendCommunicationObject)
      .subscribe((res) => {
        if (res['message'] == 'Success') {
          if (window.innerWidth <= 999) {
            this.bottomSheet.open(OtpComponent);
          } else {
            this.openModal(sendCommunicationObject, this.otpDialog);
          }
        }
      });
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(sendCommunicationObject: any, jsonData: any) {
    sendCommunicationObject['share_type'] = 'resend';
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '100%';
      resTop = '5%';
    }
    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        sendCommunicationObject,
        top: resTop,
      },
    };
    this.matDialog.openDialog(obj);
  }
  openDialog(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(TermsComponent);
    } else {
      this.openModal('', this.termsAndConditionJson);
    }
  }
  generateProposal() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.generate_proposal}/?insurer_code=${
          this.quoteData['insurer_code']
        }&proposal_id=${sessionStorage.getItem('proposal_Id')}`
      )
      .subscribe((res) => {
        this.generateProposalData = res;
      });
  }
}
