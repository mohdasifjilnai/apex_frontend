import { Component, OnInit } from '@angular/core';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
  withoutVehicleNumber: any;
  waitquotationData: any = sessionStorage.getItem('waitquotationData');
  vehicleDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: VehicleDetailsPopupComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'vehicle-details-class',
  };
  isLoading: boolean = true;
  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    public loaderService: LoaderService
  ) {
    this.loaderService.isLoading().subscribe((isLoading: any) => {
      this.isLoading = isLoading;
      if (!isLoading) {
        return;
      }
    });
  }

  ngOnInit(): void {
    this.withoutVehicleNumber = localStorage.getItem('withoutVehicleNumber');
    let popupData = sessionStorage.getItem('vehiclePopup');
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(VehicleDetailsPopupComponent);
    } else {
      if (!popupData) {
        this.openVehicleDetailsPopup(null);
      }
    }

    sessionStorage.removeItem('proposal_Id');
  }
  receivedData: any;
  // receivedCheckBoxValue: any;
  // receiveDataFromChild(data: string) {
  //   this.receivedData = data;
  //   this.receivedCheckBoxValue = data;
  // }
  /**
   * this fucntion use vehicle vehicle details modal
   */
  openVehicleDetailsPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '900px';
      resTop = '5%';
    }

    const obj: any = {
      modalName: this.vehicleDetailsJSON['modalName'],
      width: this.vehicleDetailsJSON['widthObtained'],
      height: this.vehicleDetailsJSON['heightObtained'],
      classNameObtained: this.vehicleDetailsJSON['classObtained'],
      isOutSideClose: this.vehicleDetailsJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  back() {
    this.router.navigate(['/motor']);
  }
}
