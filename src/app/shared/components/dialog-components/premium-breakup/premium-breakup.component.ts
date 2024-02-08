import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-premium-breakup',
  templateUrl: './premium-breakup.component.html',
  styleUrls: ['./premium-breakup.component.scss']
})
export class PremiumBreakupComponent implements OnInit {
  initiateQuotes:any
  constructor(
    public dialogRef: MatDialogRef<PremiumBreakupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initiateQuotes=data['initiateQuotes']    
  }

  ngOnInit(): void {
  }
   /**
   * this fucntion use for close pop up
   */
    onClose(): void {
      this.dialogRef.close();
    }

}
