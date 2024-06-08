import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgOtpInputComponent } from 'ng-otp-input';

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
  formHtmlData: any;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<OtpComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    public dialogRef: MatDialogRef<OtpComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private matDialog: WindowRef
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
    //     this.formHtmlData = `<form name='PostForm' method='POST' action='https://rgiservices.reliancegeneral.co.in/RGIPayment/PaymentGateway.aspx'>
    //     <input type='hidden' name='AgentCode' type='text' value='UUeSKDBzo0keinNukq6CjQ%3d%3d'>
    //     <input type='hidden' name='BasCode' type='text' value='ZovtlfNieDnRxXgKhrLj9A%3d%3d'>
    //     <input type='hidden' name='AgentMobileNo' type='text' value='WHfq4u%2fgLFRZWlAoHOfLig%3d%3d'>
    //     <input type='hidden' name='AgentEmailID' type='text' value='cOw4OaY1VWcKIlEx2y2IHfOthyAQW3daKPUVUT%2bRNRQ%3d'>
    //     <input type='hidden' name='CustomerName' type='text' value='2oAEyM%2bWP5B%2flAQHwo9SIw%3d%3d'>
    //     <input type='hidden' name='CustomerMobileNo' type='text' value='PcVgOQ9wb6GTluHhd12eCA%3d%3d'>
    //     <input type='hidden' name='CustomerEmailID' type='text' value='t%2fPWYktcsbIC%2bm2DWLDmadlug0koes8mimPFeQtszxU%3d'>
    //     <input type='hidden' name='UserID' type='text' value=''>
    //     <input type='hidden' name='ProposalNo' type='text' value='NZb5VY8Zv3ZmgxchNqMLqg%3d%3d'>
    //     <input type='hidden' name='TransactionNumber' type='text' value='SIpFV1%2brnhA%2bSttaClNJ8g%3d%3d'>
    //     <input type='hidden' name='ProposalAmount' type='text' value='tpqGWTTvSubgDh5NQi1UPA%3d%3d'>
    //     <input type='hidden' name='BundledProposalNo' type='text' value=''>
    //     <input type='hidden' name='BundledTransactionID' type='text' value=''>
    //     <input type='hidden' name='GatewayID' type='text' value='hfkfOapKXjEWprZsezreNA%3d%3d'>
    //     <input type='hidden' name='ReturnURL' type='text' value='h6JJk2OeeRYU8ppJV5Ty%2bupuznICnt%2bURfRzRNzSCDVAdbvUR0eyr9Iov%2bjpeyXUPheJ%2fPu0NWl3JzH%2f9N02iS6pQLf92OcjL%2b%2bhcXZhBEKOCDBkUhSKjWcIPeKA3MCzeeR%2fhPvH%2fxICxnnPrXpg0D1DBlZkllDqI7sJ8ydY3gY%3d'>
    //     <input type='hidden' name='SystemID' type='text' value='CnVJxib9D7tmzutyP6GOIQ%3d%3d'>
    //     <input type='hidden' name='SubSystemID' type='text' value='BWJvR8KFL%2fo5saszZHZJRw%3d%3d'>
    //     <input type='hidden' name='IntegrationResponseurl' type='text' value='h6JJk2OeeRYU8ppJV5Ty%2bupuznICnt%2bURfRzRNzSCDVAdbvUR0eyr9Iov%2bjpeyXUPheJ%2fPu0NWl3JzH%2f9N02iS6pQLf92OcjL%2b%2bhcXZhBEKOCDBkUhSKjWcIPeKA3MCzeeR%2fhPvH%2fxICxnnPrXpg0D1DBlZkllDqI7sJ8ydY3gY%3d'>
    //     <input type='hidden' name='EMIFrequency' type='text' value=''>
    //     <input type='hidden' name='ProductCode' type='text' value='cQ73leYBCbnmKrVtQZgFSA%3d%3d'>
    //     <input type='hidden' name='PolicyTenure' type='text' value='uOKsB0WbALQ5inOUryamzw%3d%3d'>
    //     <input type='hidden' name='PolicyStratDate' type='text' value='NYAwxWisWndj51AG%2fGIDdw%3d%3d'>
    //     <input type='hidden' name='CustomerAddress' type='text' value='xrZSyzt3%2bEkhG1DqDmbzPC%2fOTCN%2faqcUR%2fbOgnHfpWpxgBpbhursRrcm173507ZaxV%2bJrcCWglBWgPCW7zM30ANP3dB2VWVCVBVuy%2flXYVsIjFI8TZ4CZikdQ3rl5KS0JtAZ5VxvX0ap5Qq%2btc7rEMbaI2IjCm55vcXOxAv2h%2bpFPIekdI4CKL06ROE9GT1b'>
    //     <input type='hidden' name='CustomerPincode' type='text' value='OJnRm7ZqIKeNeYOPh3%2buZw%3d%3d'>
    //     <input type='hidden' name='Pan' type='text' value='2KL7%2b%2f8Ic14yqISQCdB%2bEg%3d%3d'>
    //     <input type='hidden' name='CKYC' type='text' value='vHD%2b2x1lu282zcHUdAJ7lw%3d%3d'>
    //     <input type='hidden' name='IsDocumentUpload' type='text' value='KpLZS8YIy4eoHg5HGfIsHw%3d%3d'>
    //     <input type='hidden' name='IsForm60' type='text' value='KpLZS8YIy4eoHg5HGfIsHw%3d%3d'>
    //     <input type='hidden' name='OldPGResponse' type='text' value=''>
    //     <input type='hidden' name='IsSuccess' type='text' value='yg8A278BKECeD1F9rGmazg%3d%3d'>
    // </form>`;

    //     this.formHtmlData.forms[0].submit();
  }

  ngOnInit(): void {
    this.startResendTimer();
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
  verify() {
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
        if (renewalType == 'renewal') {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.generate_renewal_proposal}?insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }&proposal_id=${this.proposalId.replace(/['"]+/g, '')}`
            )
            .subscribe(
              (generatedProposal: any) => {
                if (generatedProposal.status) {
                  sessionStorage.setItem(
                    'proposal_punched',
                    generatedProposal.status
                  );
                  if (generatedProposal.is_breakin) {
                    this.loader = false;
                    if (window.innerWidth <= 999) {
                      this.bottomSheetRef.dismiss();
                    } else {
                      this.dialogRef.close();
                    }
                    this.router.navigate([
                      `quotes/proposal/${this.transactionId}/review/inspection`,
                    ]);
                  } else {
                    this.apiService
                      .getRequestedResponse(
                        `${
                          ApiConstants['redirection_payment_getway']
                        }${this.proposalId.replace(/['"]+/g, '')}`
                      )
                      .subscribe(
                        (payment_getway_response) => {
                          if (payment_getway_response) {
                            if (!payment_getway_response.is_html) {
                              window.location.href =
                                payment_getway_response.url;
                            } else {
                              this.formHtmlData = payment_getway_response.form;
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
                  }
                } else {
                  if (
                    JSON.parse(this.quoteData)['insurer_code'] == 'digit' &&
                    generatedProposal.ckyc_link
                  ) {
                    this.failureJSON['modalName'] = ErrorDialogComponent;
                    this.openFailurePopup(generatedProposal);
                  } else {
                    this.failureJSON['modalName'] = FailureDialogComponent;
                    this.openFailurePopup(generatedProposal);
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
        } else {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.generate_proposal}?insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }&proposal_id=${this.proposalId.replace(/['"]+/g, '')}`
            )
            .subscribe(
              (generatedProposal: any) => {
                if (generatedProposal.status) {
                  sessionStorage.setItem('proposal_punched', 'true');
                  if (generatedProposal.is_breakin) {
                    this.loader = false;
                    if (window.innerWidth <= 999) {
                      this.bottomSheetRef.dismiss();
                    } else {
                      this.dialogRef.close();
                    }
                    this.router.navigate([
                      `quotes/proposal/${this.transactionId}/review/inspection`,
                    ]);
                  } else {
                    this.apiService
                      .getRequestedResponse(
                        `${
                          ApiConstants['redirection_payment_getway']
                        }${this.proposalId.replace(/['"]+/g, '')}`
                      )
                      .subscribe(
                        (payment_getway_response) => {
                          if (payment_getway_response) {
                            // this.library = payment_getway_response;
                            // window.location.href = payment_getway_response;
                            if (!payment_getway_response.is_html) {
                              window.location.href =
                                payment_getway_response.url;
                            } else {
                              this.formHtmlData = payment_getway_response.form;
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
                } else {
                  if (
                    JSON.parse(this.quoteData)['insurer_code'] == 'digit' &&
                    generatedProposal.ckyc_link
                  ) {
                    this.failureJSON['modalName'] = ErrorDialogComponent;
                    this.openFailurePopup(generatedProposal);
                  } else {
                    this.failureJSON['modalName'] = FailureDialogComponent;
                    this.openFailurePopup(generatedProposal);
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
        `${ApiConstants.send_communication}`,
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
