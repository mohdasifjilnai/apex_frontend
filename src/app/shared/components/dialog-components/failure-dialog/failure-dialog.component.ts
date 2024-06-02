import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-failure-dialog',
  templateUrl: './failure-dialog.component.html',
  styleUrls: [
    './failure-dialog.component.scss',
    '../success-dialog/success-dialog.component.scss',
  ],
})
export class FailureDialogComponent implements OnInit {
  faliureData: any;
  errorMessage: any;
  constructor(
    public dialogRef: MatDialogRef<FailureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: WindowRef,
    private sharedService: SharedDataService
  ) {
    this.faliureData = data['data'];
    if (this.faliureData?.error_message) {
      this.errorMessage = this.faliureData?.error_message;
    }
    if (data?.statusdata?.status == 422) {
      this.errorMessage = data['statusdata']['message'];
    } else if (data?.statusdata?.status == 500) {
      this.errorMessage = data['errorData']['message'];
    } else if (data?.statusdata?.status == 409) {
      this.errorMessage = data['errorData']['message'];
    }
    else if (
      (data?.data?.status == false && data?.data?.insurer_code != 'digit') ||
      data?.data?.err_code == 1
    ) {
      // this.sharedService.openSnackBar(data?.data?.error_message, true, 3000);
    } else if (
      (data?.data?.status == false && data?.data?.insurer_code == 'digit') ||
      data?.data?.err_code == 1
    ) {
      this.errorMessage = data?.data?.error_message;
    } else if (!data?.errorData?.verification_status) {
      this.errorMessage = data?.errorData?.error_message
        ? data?.errorData?.error_message
        : data?.errorData;
    }
  }
  // failureJSON: {
  //   modalName: any;
  //   widthObtained: string;
  //   heightObtained: string;
  //   topObtained: string;
  //   isOutSideClose: boolean;
  //   classObtained: string;
  // } = {
  //   modalName: FailureDialogComponent,
  //   widthObtained: '70%',
  //   heightObtained: 'auto',
  //   topObtained: 'auto',
  //   isOutSideClose: true,
  //   classObtained: 'nonPOS-class',
  // };
  ngOnInit(): void {
    // this.failurePopup(this.faliureData);
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }

  // failurePopup(data: any) {
  //   this.errorMessage = data?.error_message;
  // }

  // openFailurePopup(objData: any) {
  //   let resWidth;
  //   let resTop;
  //   if (window.screen.width <= 767) {
  //     resWidth = '95%';
  //     resTop = '5%';
  //   } else {
  //     resWidth = '900px';
  //     resTop = '5%';
  //   }
  //   const obj: any = {
  //     modalName: this.failureJSON['modalName'],
  //     width: this.failureJSON['widthObtained'],
  //     height: this.failureJSON['heightObtained'],
  //     classNameObtained: this.failureJSON['classObtained'],
  //     isOutSideClose: this.failureJSON['isOutSideClose'],
  //     minWidth: resWidth,
  //     dataInfo: {
  //       data: objData,
  //       top: resTop,
  //     },
  //   };

  //   this.matDialog.openDialog(obj);
  // }
}
