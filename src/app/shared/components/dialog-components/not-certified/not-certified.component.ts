import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { OtpComponent } from '../otp/otp.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-not-certified',
  templateUrl: './not-certified.component.html',
  styleUrls: ['./not-certified.component.scss'],
})
export class NotCertifiedComponent implements OnInit {
  previousPolicyDetails: any;
  proposalNumber: any;
  generateProposalData: any;
  quoteData: any;
  proposalData: any;
  otpDialog: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: OtpComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'otp-popup',
  };
  loader: boolean = false;
  partner_code: any;
  hideLogin: boolean = false;
  partnerCodeTraceId: any;
  isQuotePopUp: any;
  constructor(
    public dialogRef: MatDialogRef<NotCertifiedComponent>,
    public bottomSheetRef: MatBottomSheetRef<NotCertifiedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedDataService: SharedDataService,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.sharedDataService.getLoginPartner.subscribe((partner) => {
      this.isQuotePopUp = partner;
    });
    this.sharedDataService.previousPolicyDetails$.subscribe((details) => {
      this.previousPolicyDetails = details[0];
      this.generateProposalData = details[2];
      this.quoteData = details[3];
    });
    this.proposalData = this.sharedDataService.proposalData;
    this.partnerCodeTraceId = JSON.parse(
      sessionStorage.getItem('partnerCodeTraceId') || '{}'
    );
    this.partner_code = this.partnerCodeTraceId?.partner_code;
    if (this.partner_code == null || this.partner_code == '') {
      this.hideLogin = true;
    }
  }
  /**
   * this fucntion use for close pop up
   */
  Understand(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    window.location.href = environment?.profile_redirection;
  }

  procced() {
    if (this.isQuotePopUp == 'quote') {
      this.dialogRef.close();
      this.sharedDataService.sendNotCertifiedData('quote');
    } else if (this.isQuotePopUp == 'edit') {
      this.dialogRef.close();
      this.sharedDataService.sendNotCertifiedData('edit');
    } else {
      this.loader = true;
      if (this.proposalData) {
        let sendCommunicationObject = {
          transaction_id: this.proposalData?.quote_response?.transaction_id,
          share_type: 'otp',
          partner_name: this.generateProposalData?.customer_details?.full_name,
          URL: `${environment['apex']}motor/quotes/proposal/${this.quoteData?.transaction_id}/review`,
          mail_id: this.generateProposalData?.customer_details?.email_id,
          mobile_no: this.generateProposalData?.customer_details?.mobile_number,
          quote_id: [this.proposalData?.quote_response?.quote_id],
          quote_request_id: this.proposalData?.quote_response?.quote_request_id,
        };
        this.apiService
          .postRequestedResponse(
            `${ApiConstants.send_communication}`,
            sendCommunicationObject
          )
          .subscribe((res) => {
            this.dialogRef.close();
            this.loader = false;
            if (res['message'] == 'Success') {
              if (window.innerWidth <= 999) {
                const bottomSheetConfig: MatBottomSheetConfig = {
                  data: sendCommunicationObject, // Pass your data here
                };
                this.bottomSheet.open(OtpComponent, bottomSheetConfig);
              } else {
                this.openModal(sendCommunicationObject, this.otpDialog);
              }
            }
          });
      } else {
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
          .postRequestedResponse(
            `${ApiConstants.send_communication}`,
            sendCommunicationObject
          )
          .subscribe((res) => {
            this.loader = false;
            this.dialogRef.close();
            if (res['message'] == 'Success') {
              if (window.innerWidth <= 999) {
                const bottomSheetConfig: MatBottomSheetConfig = {
                  data: sendCommunicationObject, // Pass your data here
                };
                this.bottomSheet.open(OtpComponent, bottomSheetConfig);
              } else {
                this.openModal(sendCommunicationObject, this.otpDialog);
              }
            }
          });
      }
    }
  }
  login() {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    window.location.href = environment?.profile_redirection;
  }
  openModal(sendCommunicationObject: any, jsonData: any) {
    sendCommunicationObject['share_type'] = 'resend';
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
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
}
