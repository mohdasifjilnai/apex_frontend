import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from '../../../../api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-wait-ckyc-verification-dialog',
  templateUrl: './wait-ckyc-verification-dialog.component.html',
  styleUrls: ['./wait-ckyc-verification-dialog.component.scss'],
})
export class WaitCkycVerificationDialogComponent implements OnInit {
  isWaitingTime: boolean = false;
  ckycData: any;
  ckycBody: any;
  isCustomerDetails: boolean = true;
  redirectionUrlViaForm: any;
  error_message: any;
  constructor(
    public dialogRef: MatDialogRef<WaitCkycVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {
    this.ckycBody = data['data'];
  }

  ngOnInit(): void {
    this.fetchCkyc(this.ckycBody);
  }

  /**
   * fetch ckyc data from api
   */
  fetchCkyc(body: any) {
    this.isWaitingTime = false;
    this.apiService
      .postRequestedResponse(ApiConstants.fetch_ckyc_data, body)
      .subscribe((res) => {
        if (res['customer_details'] != null) {
          this.isWaitingTime = true;
          this.isCustomerDetails = true;
          this.ckycData = res.customer_details;
          this.sharedDataService?.fetchCKycFormData.subscribe((res) => {
            this.sharedDataService?.createProposalId('ckyc', res);
          });
          this.sharedDataService.getFetchedCkycData(res);
        } else {
          this.redirectionUrlViaForm = res['redirection_url_via_form'];
          this.error_message = res['error_message'];
          this.isWaitingTime = true;
          this.isCustomerDetails = false;
        }
      });
  }

  /**
   * this fucntion use for close pop up
   */

  onProceedData(resData: any) {
    this.dialogRef.close(resData);
  }
  /**
   *  this function use redirect to insurer
   */
  redirectInsurer(redirectionUrlViaForm: any) {
    window.location.href = redirectionUrlViaForm;
  }
}
