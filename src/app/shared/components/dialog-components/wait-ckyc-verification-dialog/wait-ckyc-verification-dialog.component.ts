import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from '../../../../api.constant';

@Component({
  selector: 'app-wait-ckyc-verification-dialog',
  templateUrl: './wait-ckyc-verification-dialog.component.html',
  styleUrls: ['./wait-ckyc-verification-dialog.component.scss'],
})
export class WaitCkycVerificationDialogComponent implements OnInit {
  isWaitingTime: boolean = false;
  ckycData: any;
  ckycBody: any;
  constructor(
    public dialogRef: MatDialogRef<WaitCkycVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
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
        this.isWaitingTime = true;
        this.ckycData = res;
      });
  }

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }

  onProceedData(resData:any){
    this.dialogRef.close(resData);
  }
}
