import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payout-info',
  templateUrl: './payout-info.component.html',
  styleUrls: ['./payout-info.component.scss']
})
export class PayoutInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PayoutInfoComponent>,) { }

  ngOnInit(): void {
  }
 /**
   * this fucntion use for close pop up
   */
 onClose(): void {
  this.dialogRef.close();
}
}
