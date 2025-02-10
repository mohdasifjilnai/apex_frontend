import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgOtpInputComponent } from 'ng-otp-input';
import { RevisedPremiumBreakupComponent } from '../revised-premium-breakup/revised-premium-breakup.component';

declare const webengage: any;
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @ViewChild('ngOtpInput') ngOtpInput!: NgOtpInputComponent;
  otp: any;
  loader: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '45px',
      height: '45px',
      'border-radius': '8px',
    },
  };

  failureJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ErrorDialogComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };
  initiateQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: RevisedPremiumBreakupComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: false,
    classObtained: 'revised-quotes-class',
  };
  resendDisabled = false;
  countdown = 60;
  btnDisable: boolean = true;
  transactionId: any;
  communicationData: any;
  proposalId: any;
  quoteData: any;
  breakIn: any;
  library: any;
  @ViewChild('myform') myform!: ElementRef;

  paymentObject: any;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<OtpComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    public dialogRef: MatDialogRef<OtpComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private matDialog: WindowRef,
    private renderer: Renderer2,
    public bottomSheet: MatBottomSheet,
    private matDialogs: MatDialog
  ) {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
    if (window.innerWidth <= 999) {
      this.communicationData = this.bottomSheetdata;
    } else {
      this.communicationData = data['sendCommunicationObject'];
    }

    this.quoteData = sessionStorage.getItem('quotes_data');
    this.breakIn = JSON.parse(this.quoteData)['is_breakin'];

    if (JSON.parse(this.quoteData)['insurer_code'] == 'digit') {
      this.failureJSON['modalName'] = ErrorDialogComponent;
    } else {
      this.failureJSON['modalName'] = FailureDialogComponent;
    }
  }

  ngOnInit(): void {
    this.startResendTimer();
  }

  ngAfterViewInit(): void {
    // this.myform.nativeElement.innerHTML = this.paymentObject.form;
    // this.myform.nativeElement.getElementsByTagName('form')[0].submit();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    if (otp.length == 6) {
      this.btnDisable = false;
      // this.verify();
    } else {
      this.btnDisable = true;
    }
  }
  /**
   * Starts the countdown timer for OTP resend.
   * Sets the initial countdown value to 60 seconds and disables the resend button.
   * Updates the countdown every second and enables the resend button when the countdown reaches 0.
   */
  startResendTimer() {
    this.resendDisabled = true;
    this.countdown = 60;

    const timer = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(timer);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
  openModal(data: any, jsonData: any) {
    let resWidth;
    let resTop;

    if (window.screen.width <= 999) {
      resWidth = 'auto';
      resTop = '0';
    } else {
      resWidth = 'auto';
      resTop = '0';
    }

    const dialogConfig = {
      width: jsonData['widthObtained'] || resWidth,
      height: jsonData['heightObtained'] || 'auto',
      panelClass: jsonData['classObtained'],
      disableClose: !jsonData['isOutSideClose'],
      data: data,
    };

    this.matDialogs.open(RevisedPremiumBreakupComponent, dialogConfig);
  }

  openRevPremiumBreakupModal(data: any): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: data,
    };

    if (window.innerWidth <= 999) {
      this.bottomSheet.open(RevisedPremiumBreakupComponent, bottomSheetConfig);
    } else {
      this.openModal(data, this.initiateQuotesJSON);
    }
  }

  verify() {
    const vehcileType = sessionStorage.getItem('vehicleType');
    webengage.track('Payment_OTP_submitted', {
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: vehcileType,
    });
    this.loader = true;

    let url = `${ApiConstants.verify_otp}?transaction_id=${this.transactionId}&otp=${this.otp}`;
    this.apiService.getRequestedResponse(url).subscribe((res) => {
      if (res['message'] == 'Invalid OTP') {
        this.sharedDataService.openSnackBar(
          'Please enter valid otp',
          false,
          3000
        );
        this.loader = false;
        this.ngOtpInput.setValue('');
      } else if (res['message'] == 'OTP Expired') {
        this.sharedDataService.openSnackBar('OTP Expired', false, 3000);
        this.loader = false;
        this.ngOtpInput.setValue('');
      } else {
        let renewalType = sessionStorage.getItem('renewalType');
        if (renewalType == 'renewal' || renewalType == 'rollover') {
          this.apiService
          .getRequestedResponse(
            `${
              ApiConstants['redirection_payment_getway']
            }${this.proposalId.replace(/['"]+/g, '')}`
          )
          .subscribe(
            (payment_getway_response) => {
              if (payment_getway_response) {
                this.paymentObject = payment_getway_response;

                if (!payment_getway_response.is_html) {
                  window.location.href =
                    payment_getway_response.url;
                } else {
                  let paymentObjectValue =
                    this.paymentObject.form.replace(
                      '<html><head></head><body>',
                      ''
                    );
                  // </body></html>
                  let paymentObjectValueData =
                    this.paymentObject.form.replace(
                      '</form></body></html>',
                      `<input  type='submit'   value=''></form>`
                    );
                  this.paymentObject.form = paymentObjectValueData;

                  this.myform.nativeElement.innerHTML =
                    this.paymentObject.form;
                  this.myform.nativeElement
                    .getElementsByTagName('form')[0]
                    .submit();
                }
                // this.library = payment_getway_response;
                // this.myform.nativeElement.submit();
                // window.location.href = payment_getway_response;
                this.loader = false;
                if (window.innerWidth <= 999) {
                  this.bottomSheetRef.dismiss();
                } else {
                  this.dialogRef.close();
                }
              }
            },
            (error) => {
              this.loader = false;
              if (window.innerWidth <= 999) {
                this.bottomSheetRef.dismiss();
              } else {
                this.dialogRef.close();
              }
            }
          );
        } else{
          this.apiService
                      .getRequestedResponse(
                        `${
                          ApiConstants['redirection_payment_getway']
                        }${this.proposalId.replace(/['"]+/g, '')}`
                      )
                      .subscribe(
                        (payment_getway_response) => {
                          if (payment_getway_response) {
                            this.paymentObject = payment_getway_response;

                            // this.library = payment_getway_response;
                            // window.location.href = payment_getway_response;
                            if (!payment_getway_response.is_html) {
                              window.location.href =
                                payment_getway_response.url;
                            } else {
                              let paymentObjectValue =
                                this.paymentObject.form.replace(
                                  '<html><head></head><body>',
                                  ''
                                );
                              // </body></html>
                              let paymentObjectValueData =
                                this.paymentObject.form.replace(
                                  '</form></body></html>',
                                  `<input  type='submit'   value=''></form>`
                                );
                              this.paymentObject.form = paymentObjectValueData;

                              this.myform.nativeElement.innerHTML =
                                this.paymentObject.form;
                              this.myform.nativeElement
                                .getElementsByTagName('form')[0]
                                .submit();
                            }
                            this.loader = false;
                            if (window.innerWidth <= 999) {
                              this.bottomSheetRef.dismiss();
                            } else {
                              this.dialogRef.close();
                            }
                          }
                        },
                        (error) => {
                          this.loader = false;
                          if (window.innerWidth <= 999) {
                            this.bottomSheetRef.dismiss();
                          } else {
                            this.dialogRef.close();
                          }
                        }
                      );
        }
      }
    });
  }
  resendotp() {
    this.resendDisabled = false;
    this.loader = false;
    this.ngOtpInput.setValue('');
    this.apiService
      .postRequestedResponse(
        `${ApiConstants.send_communication()}`,
        this.communicationData
      )
      .subscribe((res) => {
        if (res) {
          this.startResendTimer();
          this.sharedDataService.openSnackBar(
            'The otp send successfully',
            true,
            3000
          );
        }
      });
  }

  openFailurePopup(objData: any) {
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
      modalName: this.failureJSON['modalName'],
      width: this.failureJSON['widthObtained'],
      height: this.failureJSON['heightObtained'],
      classNameObtained: this.failureJSON['classObtained'],
      isOutSideClose: this.failureJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
}
