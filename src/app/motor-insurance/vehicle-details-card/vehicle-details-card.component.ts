import { Component, OnInit } from '@angular/core';
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
    widthObtained: '75%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'vehicle-details-class',
  };
  constructor(
    private matDialog: WindowRef,
    private sharedData: SharedDataService
  ) {}

  ngOnInit(): void {}

  openDialog(edit: string): void {
    this.openVehicleDetailsPopup(null)
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
      resWidth = '75%';
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
