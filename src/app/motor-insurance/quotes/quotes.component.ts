import { Component, OnInit } from '@angular/core';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
  withoutVehicleNumber:any
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
    heightObtained: '77%',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'vehicle-details-class',
  };
  constructor(public matDialog: WindowRef,private sharedDataService:SharedDataService,public bottomSheet: MatBottomSheet,public dialog: MatDialog) {}

  ngOnInit(): void {
    this.withoutVehicleNumber=localStorage.getItem('withoutVehicleNumber')
    if(this.withoutVehicleNumber=='false'){
      if (window.innerWidth <= 768) {
        this.bottomSheet.open(VehicleDetailsPopupComponent);
      } else {
        this.openVehicleDetailsPopup(null);
      }
      
    }
  }
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
}
