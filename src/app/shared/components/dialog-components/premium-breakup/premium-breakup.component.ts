import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
@Component({
  selector: 'app-premium-breakup',
  templateUrl: './premium-breakup.component.html',
  styleUrls: ['./premium-breakup.component.scss'],
})
export class PremiumBreakupComponent implements OnInit {
  initiateQuotes: any;
  gstToggleData = true;
  constructor(
    public dialogRef: MatDialogRef<PremiumBreakupComponent>,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<PremiumBreakupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dataToBottomSheet: any
  ) {
    if (data['data'] != null) {
      this.initiateQuotes = data.data;
    } else if (dataToBottomSheet != null) {
      this.initiateQuotes = dataToBottomSheet;
    }
  }
  ngOnInit(): void {
    let gstValue = sessionStorage.getItem('gstValue');
    if (gstValue) {
      this.gstToggleData = JSON.parse(gstValue);
    }
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
  cancelBreakupPremium(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
