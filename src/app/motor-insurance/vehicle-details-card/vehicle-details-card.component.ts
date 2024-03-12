import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';
import moment from 'moment';

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
  showLess: boolean = true;
  viewText: string = 'More';
  ProposalURL: boolean = false;
  vehicleData: any;
  parsedVehicleData: any = '';
  registrationDate: any;
  registrationMonth: any;
  registrationYear: any;
  manufactureDate: any;
  manufactureMonth: any;
  manufactureYear: any;
  policyDate: any;
  previousInsurer = '';
  previousNCB: any;
  vehiclePopupList: any;
  newNCB: any;

  constructor(
    private matDialog: WindowRef,
    private sharedData: SharedDataService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      const proposalSegment = segments.find(
        (segment) => segment.path === 'proposal'
      );
      if (proposalSegment) {
        const proposalValue = proposalSegment.path;
        this.ProposalURL = true;
      }
    });
    this.vehiclePopupList = sessionStorage.getItem('mmv_data');
    let vehicleCard = JSON.parse(this.vehiclePopupList);
    if (vehicleCard) {
      this.vehicleCardData(vehicleCard);
    }
    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.vehicleCardData(this.parsedVehicleData);
    });
  }

  vehicleCardData(data: any) {
    this.parsedVehicleData = data;
    this.policyDate = '';
    this.previousInsurer = '';
    this.previousNCB = '';
    this.newNCB = '';
    let regDateValue = new Date(this.parsedVehicleData?.registration_date);
    this.registrationDate = moment(regDateValue, 'MM/YYYY');
    let regMonth = moment(this.registrationDate).month();
    this.registrationMonth = moment(regMonth + 1, 'MM').format('MMM');
    this.registrationYear = moment(this.registrationDate).year();
    if (this.parsedVehicleData?.manufacture_date) {
      let manufactureDateValue = new Date(
        this.parsedVehicleData?.manufacture_date
      );
      this.manufactureDate = moment(manufactureDateValue, 'MM/YYYY');
      let manufactureMonth = moment(this.manufactureDate).month();
      this.manufactureMonth = moment(manufactureMonth + 1, 'MM').format('MMM');
      this.manufactureYear = moment(this.manufactureDate).year();
    }
    if (this.parsedVehicleData?.policy_expiry_date) {
      let policyExpiryDate = new Date(
        this.parsedVehicleData?.policy_expiry_date
      );
      this.policyDate = moment(policyExpiryDate).format('DD-MMM-YYYY');
    }

    if (this.parsedVehicleData?.previous_insurer?.rb_insurer_name) {
      this.previousInsurer =
        this.parsedVehicleData?.previous_insurer?.rb_insurer_name;
    }
    // if (this.parsedVehicleData?.ncb_discount) {
    //   this.previousNCB = this.parsedVehicleData?.ncb_discount;
    // }
    if (this.parsedVehicleData?.addNcbBoth?.new_ncb_name) {
      this.newNCB = this.parsedVehicleData?.addNcbBoth.new_ncb_name;
      this.previousNCB = this.parsedVehicleData?.addNcbBoth?.old_ncb_name;
    }
  }
  openDialog(edit: string): void {
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(VehicleDetailsPopupComponent);
    } else {
      this.openVehicleDetailsPopup(null);
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
  viewLess(text: any) {
    this.showLess = !this.showLess;
    this.viewText = 'More';
    if (text == 'More') {
      this.viewText = 'Less';
    }
  }
}
