import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  MaxLengthValidator,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { environment } from 'src/environments/environment';
import { OtpComponent } from '../dialog-components/otp/otp.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-proposal-share',
  templateUrl: './proposal-share.component.html',
  styleUrls: ['./proposal-share.component.scss'],
})
export class ProposalShareComponent implements OnInit {
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
  isCommunicationGroup: boolean = true;
  isCommunicationField: boolean = false;
  isActiveIcon: any;
  inputPlaceholder: any;
  shareQuotationForm!: FormGroup;
  quotes_id: any[] = [];
  successMessage: boolean = false;
  formControlName: any;
  partner_name: any;
  message: any;
  failureMessage: boolean = false;
  gstToggleData: any;
  currentDate: Date = new Date();
  startDate: any;
  previousPolicyDetails: any;
  proposalNumber: any;
  generateProposalData: any;
  quoteData: any;
  startDateRollover: any;
  nextDateValue: any;

  constructor(
    public dialogRef: MatDialogRef<ProposalShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedDataService: SharedDataService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet
  ) {
    this.shareQuotationForm = this.formBuilder.group({
      whatsApp_number: new FormControl('', [
        Validators.pattern(/^[6-9]\d{9}$/),
      ]),
      contact_number: new FormControl('', [Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new FormControl('', [Validators.pattern(/^.+@.+[.].+$/)]),
    });
  }

  ngOnInit(): void {
    this.partner_name = localStorage.getItem('ta_user_name');
    for (let value of this.data?.data) {
      this.quotes_id.push(value?.quote_id);
    }
    let gstValue = sessionStorage.getItem('gstValue');
    if (gstValue) {
      this.gstToggleData = JSON.parse(gstValue);
    }
    this.sharedDataService.previousPolicyDetails$.subscribe((details) => {
      this.previousPolicyDetails = details[0];
      this.proposalNumber = details[1];
      this.generateProposalData = details[2];
      this.quoteData = details[3];
    });
    if (this.previousPolicyDetails == null) {
      this.startDate = this.currentDate;
    } else if (this.previousPolicyDetails?.policy_expiry_date) {
      this.startDateRollover = this.previousPolicyDetails?.policy_expiry_date;
      const [day, month, year] = this.startDateRollover.split('/'); // Split the string into parts

      // Create a new Date object with the provided date
      const currentDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      // Get the next day
      const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

      // Format the updated date back into 'dd/mm/yyyy' format
      const newDay = ('0' + nextDate.getDate()).slice(-2);
      const newMonth = ('0' + (nextDate.getMonth() + 1)).slice(-2);
      const newYear = nextDate.getFullYear();

      this.nextDateValue = `${newDay}/${newMonth}/${newYear}`;
    }
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
  /**
   * this fucntion use for share inspection
   */
  share() {
    this.isCommunicationGroup = false;
  }
  /**
   * this fucntion use for share inspection by social media
   */
  communication(event: any) {
    this.shareQuotationForm.reset();
    this.isActiveIcon = event;
    this.isCommunicationField = true;
  }
  anyFieldValid() {
    return Object.values(this.shareQuotationForm.controls).some(
      (control) => control.touched && control.valid
    );
  }
  /**
   * Share Quotes Api Integration
   */
  shareQuotes() {
    let message: any;
    if (this.shareQuotationForm.get('email')?.value != '') {
      message =
        'Send to Email ' +
        this.shareQuotationForm.get('email')?.value +
        ' successfully';
    } else if (this.shareQuotationForm.get('contact_number')?.value != null) {
      message =
        'Send to Mobile Number +91-' +
        this.shareQuotationForm.get('contact_number')?.value +
        ' successfully';
    }
    this.sharedDataService
      .shareQuotes(
        this.data?.data,
        'proposal',
        this.partner_name,
        `motor/quotes/proposal/${this.data?.data[0]?.transaction_id}/review?proposal=true`,
        this.shareQuotationForm.get('email')?.value,
        this.shareQuotationForm.get('contact_number')?.value,
        this.quotes_id
      )
      .subscribe(
        (res) => {
          if (res?.message == 'Success') {
            this.sharedDataService.openSnackBar(message, true);
            this.shareQuotationForm.reset();
          } else {
            this.failureMessage = true;
            this.message = res?.message;
            setTimeout(() => {
              this.failureMessage = false;
            }, 5000);
            this.shareQuotationForm.reset();
          }
        },
        (error) => {
          this.shareQuotationForm.reset();
        }
      );
  }
  proceedToPayment() {
    this.dialogRef.close();
    let sendCommunicationObject = {
      transaction_id: this.quoteData?.transaction_id,
      share_type: 'otp',
      partner_name: this.generateProposalData?.customer_details?.full_name,
      URL: `${environment['apex']}motor/quotes/proposal/${this.quoteData?.transaction_id}/review?proposal=true`,
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
        if (res['message'] == 'Success') {
          if (window.innerWidth <= 999) {
            this.bottomSheet.open(OtpComponent);
          } else {
            this.openModal(sendCommunicationObject, this.otpDialog);
          }
        }
      });
  }
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
}
