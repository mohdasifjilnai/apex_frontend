import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-wait-ckyc-verification-dialog',
  templateUrl: './wait-ckyc-verification-dialog.component.html',
  styleUrls: ['./wait-ckyc-verification-dialog.component.scss'],
})
export class WaitCkycVerificationDialogComponent implements OnInit {
  isWaitingTime: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<WaitCkycVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isWaitingTime = true;
    }, 5000);
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
