import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-non-pos-popup',
  templateUrl: './non-pos-popup.component.html',
  styleUrls: ['./non-pos-popup.component.scss'],
})
export class NonPosPopupComponent implements OnInit {
  constructor(
    private matDialog: WindowRef,
    private sharedDataService: SharedDataService,
    public dialogRef: MatDialogRef<NonPosPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}
  nonPosProduct = true;
  ngOnInit(): void {}
  nonPOSJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NonPosPopupComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };

  openNonPOSPopup(objData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }
    const obj: any = {
      modalName: this.nonPOSJSON['modalName'],
      width: this.nonPOSJSON['widthObtained'],
      height: this.nonPOSJSON['heightObtained'],
      classNameObtained: this.nonPOSJSON['classObtained'],
      isOutSideClose: this.nonPOSJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  continueQuotes() {
    const transactionId = sessionStorage.getItem('transaction_id');
    this.dialogRef.close();
    this.router.navigate([`quotes/proposal/${transactionId}`]);
  }
}
