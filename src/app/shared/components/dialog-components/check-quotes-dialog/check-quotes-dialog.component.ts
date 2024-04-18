import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-check-quotes-dialog',
  templateUrl: './check-quotes-dialog.component.html',
  styleUrls: ['./check-quotes-dialog.component.scss']
})
export class CheckQuotesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CheckQuotesDialogComponent>,) { }

  ngOnInit(): void {
  }

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
