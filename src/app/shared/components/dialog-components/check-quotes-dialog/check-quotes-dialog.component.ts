import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    private route: Router
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
    sessionStorage.removeItem('vehiclePopup');
    let insurerApiData = {
      transaction_id: sessionStorage.getItem('transaction_id'),
      insurer_quote_id: sessionStorage.getItem('renewalInsurerQuotesId'),
    };
    this.sharedDataService.quotesDataOnRenewal(insurerApiData);
    this.route.navigate(['/motor/quotes']);
  }
}
