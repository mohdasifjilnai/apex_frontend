import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  otp: any;
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
  resendDisabled = false;
  countdown = 60;
  btnDisable: boolean = true;
  transactionId: any;
  communicationData: any;
  proposalId: any;
  quoteData: any;
  constructor(
    public bottomSheetRef: MatBottomSheetRef<OtpComponent>,
    public dialogRef: MatDialogRef<OtpComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
    this.communicationData = data['sendCommunicationObject'];
    this.quoteData = sessionStorage.getItem('quotes_data');
  }

  ngOnInit(): void {
    this.startResendTimer();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    if (otp.length == 6) {
      this.btnDisable = false;
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

  resendOtp() {
    this.startResendTimer();
  }
  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
  verify() {
    let url = `${ApiConstants.verify_otp}?transaction_id=${this.transactionId}&otp=${this.otp}`;
    this.apiService.getRequestedResponse(url).subscribe((res) => {
      if (res['message'] == 'Invalid OTP') {
        this._snackBar.open('Please enter valid otp');
      } else {
        if (window.innerWidth <= 999) {
          this.bottomSheetRef.dismiss();
        } else {
          this.dialogRef.close();
        }
        this.apiService
          .getRequestedResponse(
            `${ApiConstants.generate_proposal}?insurer_code=${
              JSON.parse(this.quoteData)['insurer_code']
            }&proposal_id=${this.proposalId}`
          )
          .subscribe((generatedProposal: any) => {
            if (generatedProposal) {
              this.apiService
                .getRequestedResponse(
                  `${ApiConstants['redirection_payment_getway']}${this.proposalId}`
                )
                .subscribe((payment_getway_response) => {
                  if (payment_getway_response['url']) {
                    window.location.href = payment_getway_response['url'];
                  }
                });
            }
          });
      }
    });
  }
  resendotp() {
    this.apiService
      .postRequestedResponse(
        `${ApiConstants.send_communication}`,
        this.communicationData
      )
      .subscribe((res) => {
        if (res) {
          console.log(res, 'resend');
        }
      });
  }
}
