import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';
import moment from 'moment';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';

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
    widthObtained: 'auto',
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
  inspectionValue: any;
  enableIdvCard = true;
  breakIn = false;
  vehicleInspectionMessage: any;
  expiryListData: any;
  vehicleValueForm: any;
  vehicleType: any;
  registartionDate: any;
  satpNCB: any;
  showZeroNCB: boolean = false;

  constructor(
    private matDialog: WindowRef,
    private sharedData: SharedDataService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private apiservice: ApiService,
    private router: Router
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
    this.vehicleType = sessionStorage.getItem('vehicleType');
    let vehicleCard = JSON.parse(this.vehiclePopupList);
    if (vehicleCard) {
      this.vehicleCardData(vehicleCard);
    }
    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.vehicleCardData(this.parsedVehicleData);
    });

    this.sharedDataService.traceIdVehicleType.subscribe((cardData: any) => {
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.vehicleCardData(this.parsedVehicleData);
    });

    this.sharedDataService.inspectionCard.subscribe((cardData) => {
      this.inspectionValue = cardData;
    });

    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      if (this.enableIdvCard) {
        this.enableIdvCard = false;
        let quotationArray = idvData;
        this.breakIn = false;
        for (let i = 0; i <= quotationArray.length - 1; i++) {
          if (
            quotationArray[i]['status'] &&
            quotationArray[i]['is_breakin'] &&
            vehicleCard?.policy_expiry_date != 'Not Sure'
          ) {
            this.vehicleInspectionMessage =
              this.vehicleType == 'private_car'
                ? 'Vehicle inspection is required as your previous policy is expired'
                : 'Attention!! Some insurance company will ask for an inspection as previous policy is expired';
            this.breakIn = true;
          } else if (
            quotationArray[i]['status'] &&
            quotationArray[i]['is_breakin'] &&
            vehicleCard?.policy_expiry_date == 'Not Sure'
          ) {
            this.vehicleInspectionMessage =
              this.vehicleType == 'private_car'
                ? 'Vehicle inspection is required as your previous policy is not available'
                : 'Attention!! Some insurance company will ask for an inspection as previous policy date is not available.';
            this.breakIn = true;
          }
        }
      }
    });
    this.sharedDataService.disableInitiatesQuotes.subscribe((idvData) => {
      this.enableIdvCard = true;
    });
    this.sharedDataService.idvSliderHide.subscribe((idvHide) => {
      this.satpNCB = idvHide;
      if (this.satpNCB == 'satp' || this.satpNCB == 'bundled_tp') {
        this.showZeroNCB = true;
      } else {
        this.showZeroNCB = false;
      }
    });

    this.sharedDataService.throughEmailVehicle.subscribe((vehicleData) => {
      this.parsedVehicleData = vehicleData;
      this.router.navigate(['quotes']);
      this.throughEmail(vehicleData);
    });
  }

  vehicleCardData(data: any) {
    this.parsedVehicleData = data;
    this.policyDate = '';
    this.previousInsurer = '';
    this.previousNCB = '';
    this.newNCB = '';
    let regDateValue = new Date(this.parsedVehicleData?.registration_date);
    this.registrationDate = regDateValue;
    let regMonth = moment(this.registrationDate).month();
    this.registrationMonth = moment(regMonth + 1, 'MM').format('MMM');
    this.registrationYear = moment(this.registrationDate).year();
    this.registartionDate = moment(this.registrationDate).date();
    this.registartionDate =
      this.registartionDate < 10
        ? '0' + this.registartionDate
        : this.registartionDate;
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
    if (!this.parsedVehicleData?.user_car) {
      if (this.parsedVehicleData?.addNcbBoth?.new_ncb_name) {
        this.newNCB = this.parsedVehicleData?.addNcbBoth.new_ncb_name;
        this.previousNCB = this.parsedVehicleData?.addNcbBoth?.old_ncb_name;
      }
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
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
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
  /**
   
   *  this function use when use come through email to the quotes page
   */
  throughEmail(data: any) {
    this.policyDate = '';
    this.previousInsurer = '';
    this.previousNCB = '';
    this.newNCB = '';
    let regDateValue = new Date(data.allQuotesRequest?.registration_date);
    this.registrationDate = regDateValue;
    let regMonth = moment(this.registrationDate).month();
    this.registrationMonth = moment(regMonth + 1, 'MM').format('MMM');
    this.registrationYear = moment(this.registrationDate).year();
    this.registartionDate = moment(this.registrationDate).date();
    this.registartionDate =
      this.registartionDate < 10
        ? '0' + this.registartionDate
        : this.registartionDate;
    if (data.allQuotesRequest?.manufacture_date) {
      let manufactureDateValue = new Date(
        data.allQuotesRequest?.manufacture_date
      );
      this.manufactureDate = moment(manufactureDateValue, 'MM/YYYY');
      let manufactureMonth = moment(this.manufactureDate).month();
      this.manufactureMonth = moment(manufactureMonth + 1, 'MM').format('MMM');
      this.manufactureYear = moment(this.manufactureDate).year();
    }
    if (data.allQuotesRequest?.previous_policy_exp_date) {
      let inputDate = data.allQuotesRequest?.previous_policy_exp_date;
      let [day, month, year] = inputDate.split('/');
      let reformattedDate = `${month}/${day}/${year}`;
      this.policyDate = moment(reformattedDate).format('DD-MMM-YYYY');
    }

    this.getRTOData('rto_code', data.allQuotesRequest?.rb_rto_code);
    if (data.allQuotesRequest?.previous_insurer_code) {
      this.getInsurerData(data.allQuotesRequest?.previous_insurer_code);
    }
    if (data.allQuotesRequest?.previous_year_ncb) {
      this.getNcbList(data.allQuotesRequest?.previous_year_ncb);
    }
  }
  /**
   
   *  this function use when use come through email to the quotes page
   */
  getRTOData(type?: any, rb_rto_code?: any) {
    let apiData;

    apiData = type == 'rto_code' ? `?search_element=${rb_rto_code}` : '';

    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_rto_list}${apiData}`)
      .subscribe((res) => {
        this.parsedVehicleData.registration_city = res[0];
        let vehicleEmailData = {
          vehicle_variant: this.parsedVehicleData?.vehicle_variant,
          vehicle_model: this.parsedVehicleData?.vehicle_model,
          vehicle_make: this.parsedVehicleData?.vehicle_make,
          registration_city: this.parsedVehicleData.registration_city,
          registration_date:
            this.parsedVehicleData?.allQuotesRequest.registration_date,
          policy_expiry_date_email:
            this.parsedVehicleData?.allQuotesRequest.previous_policy_exp_date,
          // policy_expiry: this.parsedVehicleData?.allQuotesRequest.product_type,
          policy_expiry_type:
            this.parsedVehicleData?.allQuotesRequest.meta_data
              .policy_expiry_id_data,
          manufacture_date:
            this.parsedVehicleData?.allQuotesRequest.manufacture_date,
          previous_claimed: this.parsedVehicleData?.allQuotesRequest.is_claimed,
          user_car:
            this.parsedVehicleData?.allQuotesRequest.is_ownership_transfer,
          vehicle_fuel: this.parsedVehicleData?.vehicle_model.fuel,
          ncb_discount:
            this.parsedVehicleData?.allQuotesRequest.previous_year_ncb,
          allQuotesRequest: this.parsedVehicleData?.allQuotesRequest,
          isNewVehicleUpdate:
            this.parsedVehicleData?.allQuotesRequest.business_type == 'renewal'
              ? false
              : true,
          policy_expiry:
            this.parsedVehicleData?.allQuotesRequest.meta_data
              .policy_expiry_type,
          NoExpiryPolicy:
            this.parsedVehicleData?.allQuotesRequest.meta_data.NoExpiryPolicy,
          hidePreviousClaimed:
            this.parsedVehicleData?.allQuotesRequest.meta_data
              .hidePreviousClaimed,
        };
        if (
          this.parsedVehicleData?.allQuotesRequest.meta_data?.policy_expiry_type
        ) {
          vehicleEmailData.policy_expiry =
            this.parsedVehicleData?.allQuotesRequest.meta_data.policy_expiry_type;

          vehicleEmailData.hidePreviousClaimed =
            this.parsedVehicleData?.allQuotesRequest.meta_data.hidePreviousClaimed;
        } else {
          vehicleEmailData.policy_expiry =
            this.parsedVehicleData?.allQuotesRequest.product_type;
          vehicleEmailData.hidePreviousClaimed = true;
        }
        sessionStorage.setItem(
          'idvData',
          this.parsedVehicleData?.allQuotesRequest.meta_data.idvData
        );
        let addonValue;
        if (this.parsedVehicleData?.allQuotesRequest.meta_data.selectedAddons) {
          addonValue = JSON.parse(
            this.parsedVehicleData?.allQuotesRequest.meta_data.selectedAddons
          );
        }
        sessionStorage.setItem('selectedAddons', JSON.stringify(addonValue));
        let vehicleFrom = JSON.stringify(vehicleEmailData);
        sessionStorage.setItem(
          'newVehicleType',
          this.parsedVehicleData?.allQuotesRequest.business_type
        );
        sessionStorage.setItem('mmv_data', vehicleFrom);
        this.sharedDataService.vehicleCardEmailData(vehicleFrom);
      });
  }
  /**
   
   * this function use when use come through email to the quotes page
   */
  getInsurerData(insurer_code: any) {
    this.apiservice
      .getRequestedResponse(ApiConstants.get_previous_insurer)
      .subscribe((res) => {
        if (res) {
          let previousInsurerObject;
          // this.vehicleValueForm = sessionStorage.getItem('mmv_data');

          for (let i = 0; i <= res.length - 1; i++) {
            if (res[i].rb_insurer_code == insurer_code) {
              this.previousInsurer = res[i].rb_insurer_name;
              previousInsurerObject = res[i];
            }
          }
          let throughEmailInsurer = previousInsurerObject;
          // let vehicleFormUpdate = JSON.parse(this.vehicleValueForm);
          // vehicleFormUpdate.previous_insurer = previousInsurerObject;
          sessionStorage.setItem(
            'mmv_data_email',
            JSON.stringify(throughEmailInsurer)
          );
        }
      });
  }
  /**
   *  this function use when use come through email to the quotes page
   */
  getNcbList(previousYearNCB: any) {
    this.apiservice
      .getRequestedResponse(ApiConstants.ncb_list)
      .subscribe((res) => {
        this.expiryListData = res;
        this.vehicleValueForm = sessionStorage.getItem('mmv_data');
        let vehicleFormUpdate = JSON.parse(this.vehicleValueForm);

        for (let data of this.expiryListData) {
          if (data.old_ncb_value === previousYearNCB) {
            this.previousNCB = previousYearNCB;
            this.newNCB = data.new_ncb_value;
            vehicleFormUpdate.addNcbBoth = data;
          }
        }

        sessionStorage.setItem('mmv_data', JSON.stringify(vehicleFormUpdate));
      });
  }
}
