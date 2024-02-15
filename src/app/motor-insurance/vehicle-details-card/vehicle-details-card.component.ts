import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';

@Component({
  selector: 'app-vehicle-details-card',
  templateUrl: './vehicle-details-card.component.html',
  styleUrls: ['./vehicle-details-card.component.scss'],
})
export class VehicleDetailsCardComponent implements OnInit {
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
  showLess: boolean=true;
  viewText:string='More'
  constructor(
    private matDialog: WindowRef,
    private sharedData: SharedDataService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openDialog(edit: string): void {
    if (window.innerWidth <= 768) {
      this.bottomSheet.open(VehicleDetailsPopupComponent);
    } else {
      this.openVehicleDetailsPopup(null)
    }
    this.sharedData.sendVehicleEditData(edit);
  }

  /**
   * this fucntion use vehicle details open pop up modal
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
  viewLess(text:any){
    this.showLess=!this.showLess;
    this.viewText='More'
    if(text=='More'){
      this.viewText='Less'
    }
  }
}
