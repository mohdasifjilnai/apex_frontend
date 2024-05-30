import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-check-quotes-dialog',
  templateUrl: './check-quotes-dialog.component.html',
  styleUrls: ['./check-quotes-dialog.component.scss'],
})
export class CheckQuotesDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CheckQuotesDialogComponent>,
    private sharedDataService: SharedDataService,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }

  quotesChange() {
    // sessionStorage.setItem('vehiclePopup', 'true');
    if (this.data == 'renewal') {
      sessionStorage.removeItem('vehiclePopup');
      let insurerApiData = {
        transaction_id: sessionStorage.getItem('transaction_id'),
        insurer_quote_id: sessionStorage.getItem('renewalInsurerQuotesId'),
      };
      this.sharedDataService.quotesDataOnRenewal(insurerApiData);
      this.route.navigate(['/motor/quotes']);
    } else {
      sessionStorage.setItem('quotesUrl', 'true');

      this.route.navigate(['/motor/quotes']);
    }
  }
}
