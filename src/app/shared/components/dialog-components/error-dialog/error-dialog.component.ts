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
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
