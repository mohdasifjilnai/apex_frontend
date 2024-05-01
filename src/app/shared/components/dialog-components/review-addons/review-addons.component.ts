import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-addons',
  templateUrl: './review-addons.component.html',
  styleUrls: ['./review-addons.component.scss']
})
export class ReviewAddonsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReviewAddonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bottomSheetRef: MatBottomSheetRef<ReviewAddonsComponent>,
  ) { }

  ngOnInit(): void {
  }
  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    
  }

}
