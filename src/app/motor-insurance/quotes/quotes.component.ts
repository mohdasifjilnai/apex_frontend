import { Component, OnInit } from '@angular/core';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
  withoutVehicleNumber: any;
  waitquotationData: any = sessionStorage.getItem('waitquotationData');
  checkWheeler: any;
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
  isLoading: boolean = true;
  quotesRequest: any;
  vehicleMMVData: any;
  renewalDetails: any;
  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    public loaderService: LoaderService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private shareDataService: SharedDataService
  ) {
    this.loaderService.isLoading().subscribe((isLoading: any) => {
      this.isLoading = isLoading;
      if (!isLoading) {
        return;
      }
    });

    this.checkWheeler = JSON.parse(
      sessionStorage.getItem('checkWheeler') || '{}'
    );
    if (sessionStorage.getItem('registrationNumber')) {
      if (
        (sessionStorage.getItem('vehicleType') == 'private_car' &&
          this.checkWheeler['is_four_wheeler']) ||
        (sessionStorage.getItem('vehicleType') == 'two_wheeler' &&
          this.checkWheeler['is_two_wheeler'])
      ) {
        this.vehicleDetailsJSON['classObtained'] = 'vehicle-details-class';
      } else {
        this.vehicleDetailsJSON['classObtained'] = 'warn-details-class';
      }
    } else {
      this.vehicleDetailsJSON['classObtained'] = 'vehicle-details-class';
    }
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.withoutVehicleNumber = localStorage.getItem('withoutVehicleNumber');

    this.route.queryParamMap.subscribe((params) => {
      const shareTransaction = params?.get('transaction_id_share');
      const insurer_quote_id = params?.get('insurer_quote_id');
      if (shareTransaction != null && insurer_quote_id != null) {
        sessionStorage.setItem('vehiclePopup', 'true');
        sessionStorage.setItem('quotesUrl', 'true');
        sessionStorage.setItem('transaction_id', shareTransaction);
        this.getInsurerCode(shareTransaction, insurer_quote_id);
      } else {
        this.renewalDetails = sessionStorage.getItem('renewalDetails');
        const parsedRenewalDetails = JSON.parse(this.renewalDetails);
        if (parsedRenewalDetails) {
          this.getInsurerCode(
            parsedRenewalDetails?.transactional_details?.transaction_id,
            parsedRenewalDetails?.transactional_details?.quote_id
          );
        } else {
          let shareData = JSON.parse(
            sessionStorage.getItem('sharable_transactionData') || '{}'
          );
          let shareabableObject = Object.keys(shareData);
          if (shareabableObject.length > 0) {
            sessionStorage.setItem('vehiclePopup', 'true');
            this.getInsurerCode(
              shareData.transaction_id,
              shareData.insurer_quote_id
            );
          }
        }
        const registrationNumberUrl = params?.get('reg_no');
        if (registrationNumberUrl) {
          sessionStorage.setItem('quotesUrl', 'true');
          sessionStorage.setItem('registrationNumber', registrationNumberUrl);
          this.shareDataService.vehicleDetails('');
        }
        let quotesUrl = sessionStorage.getItem('quotesUrl');
        if (!quotesUrl) {
          this.router.navigate(['/motor']);
        }
      }
    });
    this.shareDataService.renewalQuotes.subscribe((quotesValue: any) => {
      if (
        quotesValue?.transaction_id != null &&
        quotesValue?.insurer_quote_id != null
      ) {
        this.getInsurerCode(
          quotesValue?.transaction_id,
          quotesValue?.insurer_quote_id
        );
      }
    });
    let popupData = sessionStorage.getItem('vehiclePopup');
    if (window.innerWidth <= 999) {
      if (!popupData) {
        this.bottomSheet.open(VehicleDetailsPopupComponent, {
          disableClose: true, // Disable closing on outside click
        });
      }
    } else {
      if (!popupData) {
        let quotesUrl = sessionStorage.getItem('quotesUrl');
        if (quotesUrl) {
          this.openVehicleDetailsPopup(null);
        }
      }
    }
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
  back() {
    this.router.navigate(['/motor']);
  }
  /**
   * Get the insurer code for the given transaction id and insurer quote id.
   *
   * @param transaction_id - The transaction id.
   * @param insurer_quote_id - The insurer quote id.
   */
  getInsurerCode(transaction_id: any, insurer_quote_id: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${transaction_id}/${insurer_quote_id}`
      )
      .subscribe((response: any) => {
        if (response) {
          this.quotesRequest = response.quote_request;
          sessionStorage.setItem('vehicleType', this.quotesRequest.vehicle_type);
          sessionStorage.setItem(
            'newVehicleType',
            this.quotesRequest.business_type
          );
          sessionStorage.setItem(
            'proposerType',
            this.quotesRequest.customer_type
          );
          sessionStorage.setItem(
            'productType',
            this.quotesRequest.product_type
          );
          sessionStorage.setItem(
            'lastSelectedTabIndex',
            this.quotesRequest?.meta_data?.selectedTabIndex
          );

          this.renewalDetails = sessionStorage.getItem('renewalDetails');
          if (this.renewalDetails) {
            let allData = {
              rb_mmv_id: this.quotesRequest.rb_mmv_id,
              vehicle_type: this.quotesRequest.vehicle_type,
              quotesRequest: this.quotesRequest,
            };
            this.shareDataService.renewalData(JSON.stringify(allData));
          } else {
            this.getVehicleMMVPopup(
              '',
              this.quotesRequest.rb_mmv_id,
              this.quotesRequest.vehicle_type,
              this.quotesRequest
            );
          }
        }
      });
  }

  /**
   * Fetches the list of vehicle makes, models, and variants based on the vehicle type and stores them in the component's state.
   * @param name - The search term used to filter the list of makes, models, and variants.
   * @param id - The ID of the make, model, or variant to be preselected.
   */
  getVehicleMMVPopup(name: any, id: any, type?: any, allRequestData?: any) {
    let apiData;
    if (id) {
      apiData = `?product_name=${type}&rb_mmv_id=${id}`;
    }
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res: any) => {
        if (res) {
          this.vehicleMMVData = res;
          this.vehicleMMVData[0].displayMM = `${this.vehicleMMVData[0].rb_make_name} | ${this.vehicleMMVData[0].rb_model_name}`;
          let mmvData = {
            vehicle_model: this.vehicleMMVData[0],
            vehicle_make: this.vehicleMMVData[0],
            vehicle_variant: this.vehicleMMVData[0],
            allQuotesRequest: allRequestData,
            vehicle_fuel: this.vehicleMMVData[0].fuel,
          };
          this.shareDataService.vehicleCardDataEmail(mmvData);
        }
      });
  }
}
