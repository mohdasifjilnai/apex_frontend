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
import { NotCertifiedComponent } from 'src/app/shared/components/dialog-components/not-certified/not-certified.component';

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
  is_cse: any;
  employee_code: any;
  cse: any;
  partner_code: any;
  traceIdUrl: any;
  partnerCodewithTraceId: any;
  notCertifiedComponentJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NotCertifiedComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'not-certifiedComponent-class',
  };
  currentPageUrl: any;
  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    public loaderService: LoaderService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private shareDataService: SharedDataService,
    private routerData: ActivatedRoute
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
        sessionStorage.setItem('throughEmail', 'true');
        this.routerData.url.subscribe((segments) => {
          const urlSegments = segments.map((segment) => segment.path);
          if (urlSegments[1]) {
            this.traceIdUrl = urlSegments[1];
            this.traceIdBaseData(this.traceIdUrl);
          }
        });
        // this.getInsurerCode(shareTransaction, insurer_quote_id);
      } else {
        this.renewalDetails = sessionStorage.getItem('renewalDetails');
        const parsedRenewalDetails = JSON.parse(this.renewalDetails);
        if (parsedRenewalDetails) {
          // this.getInsurerCode(
          //   parsedRenewalDetails?.transactional_details?.transaction_id,
          //   parsedRenewalDetails?.transactional_details?.quote_id
          // );
        } else {
          let shareData = JSON.parse(
            sessionStorage.getItem('sharable_transactionData') || '{}'
          );
          let shareabableObject = Object.keys(shareData);
          if (shareabableObject.length > 0) {
            sessionStorage.setItem('vehiclePopup', 'true');
            // this.getInsurerCode(
            //   shareData.transaction_id,
            //   shareData.insurer_quote_id
            // );
            this.routerData.url.subscribe((segments) => {
              const urlSegments = segments.map((segment) => segment.path);
              if (urlSegments[1]) {
                this.traceIdUrl = urlSegments[1];
                this.traceIdBaseData(this.traceIdUrl);
              }
            });
          }
        }
        const registrationNumberUrl = params?.get('reg_no');
        if (registrationNumberUrl) {
          sessionStorage.setItem('quotesUrl', 'true');
          sessionStorage.setItem('registrationNumber', registrationNumberUrl);

          this.shareDataService.vehicleDetails('reg_no');
        }
        this.routerData.url.subscribe((segments) => {
          const urlSegments = segments.map((segment) => segment.path);
          if (urlSegments[1]) {
            this.traceIdUrl = urlSegments[1];
            this.traceIdBaseData(this.traceIdUrl);
          }
        });
        // let quotesUrl = sessionStorage.getItem('quotesUrl');
        // if (!quotesUrl) {
        //   this.router.navigate(['']);
        // }
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
          this.openNotCertifiedPopup('Partner_Mapped');
          this.shareDataService.sendLoginPartner('quote');
          // this.openVehicleDetailsPopup(null);
        }
      }
    }
    this.is_cse = localStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = localStorage.getItem('employee_code');
    this.partner_code = localStorage.getItem('partner_code');
    if (this.partnerCodewithTraceId?.partner_code) {
      this.partner_code = this.partnerCodewithTraceId?.partner_code;
    }
    this.shareDataService.partnerCodeFromApiRes.subscribe((res) => {
      if (res) {
        this.partner_code = res;
      }
    });
    this.shareDataService.getIsNotCertifiedData.subscribe((notCertified) => {
      this.currentPageUrl = this.router.url;
      if (!this.currentPageUrl.includes('proposal')) {
        if (notCertified === 'quote') {
          this.openVehicleDetailsPopup(null);
        }
      }
    });
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
  back() {
    this.router.navigate(['']);
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
          sessionStorage.setItem(
            'vehicleType',
            this.quotesRequest.vehicle_type
          );
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
          let traceId = {
            trace_id: this.quotesRequest?.trace_id,
            partner_code: this.quotesRequest?.partner_code,
          };
          sessionStorage.setItem('partnerCodeTraceId', JSON.stringify(traceId));
          this.shareDataService.partnerCode(this.quotesRequest?.partner_code);
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

  traceIdBaseData(traceId: any) {
    this.apiService
      .getRequestedResponse(`${ApiConstants.fetch_trace_Id}${traceId}`)
      .subscribe((res: any) => {
        console.log(res);
        if (res != null) {
          sessionStorage.setItem('vehicleType', res.vehicle_type);
          sessionStorage.setItem('proposerType', res.customer_type);
          let traceIdValue = {
            trace_id: traceId,
            partner_code: res.partner_code,
          };
          sessionStorage.setItem(
            'partnerCodeTraceId',
            JSON.stringify(traceIdValue)
          );
          this.shareDataService.partnerCode(res.partner_code);
          sessionStorage.setItem('quotesUrl', 'true');
          sessionStorage.setItem('vehiclePopup', 'true');
          sessionStorage.setItem('productType', res.product_type);
          sessionStorage.setItem('transaction_id', res.transaction_id);
          sessionStorage.setItem('newVehicleType', res.business_type);
          localStorage.setItem('partner_code', res?.partner_code);
          if (res?.meta_data?.selectedAddons !== 'undefined') {
            let addonsValue = JSON.parse(res?.meta_data?.selectedAddons);

            sessionStorage.setItem(
              'selectedAddons',
              JSON.stringify(addonsValue)
            );
          } else {
            sessionStorage.setItem('selectedAddons', JSON.stringify(undefined));
          }
          sessionStorage.setItem(
            'mmv_data',
            JSON.stringify(res.meta_data.mmv_form_data)
          );
          this.shareDataService.vehicleCardEmailData(
            JSON.stringify(res.meta_data.mmv_form_data)
          );
          this.shareDataService.vehicleCardTypeData(
            JSON.stringify(res.meta_data.mmv_form_data)
          );
          sessionStorage.setItem(
            'lastSelectedTabIndex',
            res.meta_data?.selectedTabIndex
          );
          let throughEmail = sessionStorage.getItem('throughEmail');
          if (throughEmail) {
            this.shareDataService.vehicleCardDataEmail('throughEmail');
            sessionStorage.removeItem('throughEmail');
          }
        } else {
          let quotesUrl = sessionStorage.getItem('quotesUrl');
          if (!quotesUrl) {
            this.router.navigate(['']);
          }
        }
      });
  }
  /**
   * this fucntion use open Not Certified Popup modal
   */
  openNotCertifiedPopup(ObjData: any) {
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
      modalName: this.notCertifiedComponentJSON['modalName'],
      width: this.notCertifiedComponentJSON['widthObtained'],
      height: this.notCertifiedComponentJSON['heightObtained'],
      classNameObtained: this.notCertifiedComponentJSON['classObtained'],
      isOutSideClose: this.notCertifiedComponentJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
}
