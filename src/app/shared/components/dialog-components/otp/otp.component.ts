import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  btnDisable: boolean=true;
  
  constructor(
    public bottomSheetRef: MatBottomSheetRef<OtpComponent>,
    public dialogRef: MatDialogRef<OtpComponent>,
    public router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.startResendTimer();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    if(otp.length==6){
      this.btnDisable=false
    }else{
      this.btnDisable=true
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
  verify(){
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    this.router.navigate(['motor/quotes/proposal/review/payment']);
  }
}
