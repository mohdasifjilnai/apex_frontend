import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.scss'],
})
export class ShareQuotesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShareQuotesComponent>,
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
