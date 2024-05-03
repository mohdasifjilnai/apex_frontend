import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-review-addons',
  templateUrl: './review-addons.component.html',
  styleUrls: ['./review-addons.component.scss'],
})
export class ReviewAddonsComponent implements OnInit {
  previousAddons: any;
  insurerData: any;
  constructor(
    public dialogRef: MatDialogRef<ReviewAddonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bottomSheetRef: MatBottomSheetRef<ReviewAddonsComponent>,
    private sharedData: SharedDataService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.previousAddons = this.sharedData.previousAddons;
  }
  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
}
