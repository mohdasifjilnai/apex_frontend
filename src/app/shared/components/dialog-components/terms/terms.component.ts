import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  insurerCode: any;
  currentUrl: any;
  extractedPath: any;
  constructor(
    public dialogRef: MatDialogRef<TermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    public bottomSheetRef: MatBottomSheetRef<TermsComponent>
  ) {}

  ngOnInit(): void {
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    this.insurerCode = kycData;
  }

  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
}
