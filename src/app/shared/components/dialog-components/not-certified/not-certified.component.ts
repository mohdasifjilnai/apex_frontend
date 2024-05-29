import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-not-certified',
  templateUrl: './not-certified.component.html',
  styleUrls: ['./not-certified.component.scss']
})
export class NotCertifiedComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotCertifiedComponent>,
    public bottomSheetRef: MatBottomSheetRef<NotCertifiedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }
 /**
   * this fucntion use for close pop up
   */
 Understand(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    window.location.href=environment?.profile_redirection
  }
}
