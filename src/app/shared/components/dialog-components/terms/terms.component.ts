import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bottomSheetRef: MatBottomSheetRef<TermsComponent>,
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    
  }
}
