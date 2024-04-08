import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: [
    './error-dialog.component.scss',
    '../success-dialog/success-dialog.component.scss',
  ],
})
export class ErrorDialogComponent implements OnInit {
  errorMessage: any;
  link: any;
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.errorMessage = data['data']['message'];
    this.link = data['data']['ckyc_link'];
  }

  ngOnInit(): void {}

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
  shareLink(link: any) {
    window.location.href = link;
  }
}
