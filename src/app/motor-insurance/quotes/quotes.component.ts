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
import { IdleService } from 'src/app/core/services/idle.service';
import { VehicleDetailsPopupNewComponent } from '../vehicle-details-popup-new/vehicle-details-popup-new.component';
declare const webengage: any;
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
    modalName: VehicleDetailsPopupNewComponent,
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
  isPopupClose: any;
  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    public loaderService: LoaderService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private shareDataService: SharedDataService,
    private routerData: ActivatedRoute,
    private idleService: IdleService
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
      }
    } else {
      this.vehicleDetailsJSON['classObtained'] = 'vehicle-details-class';
    }
  }

  ngOnInit(): void {
    this.idleService.startWatching();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.withoutVehicleNumber = sessionStorage.getItem('withoutVehicleNumber');
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const hostParts = url.host.split('.');
    let subdomain = hostParts[0];
    if (subdomain == 'd2c') {
      sessionStorage.setItem('vehicleLoginPopup', 'false');
    } else {
      sessionStorage.setItem('vehicleLoginPopup', 'true');
    }

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
            sessionStorage.setItem('alreadyCalled', 'true');
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
                // this.traceIdBaseData(this.traceIdUrl);
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
            let alreadyCalledData = sessionStorage.getItem('alreadyCalled');
            if (alreadyCalledData != 'true') {
              this.traceIdBaseData(this.traceIdUrl);
              //           const initiate_quotes_payload=sessionStorage.getItem('mmv_data')
              // this.shareDataService.initiate_Quotes_APi(initiate_quotes_payload)
            }
          }
        });
        // let quotesUrl = sessionStorage.getItem('quotesUrl');
        // if (!quotesUrl) {
        //   this.router.navigate(['']);
        // }
      }
    });

    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
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
    // let popupData = sessionStorage.getItem('vehiclePopup');
    // if (popupData == 'true') {
    //   // if (vehiclePopup != 'true') {
    //   //   let quotesUrl = sessionStorage.getItem('quotesUrl');
    //   //   if (quotesUrl) {
    //   //     this.openNotCertifiedPopup('Partner_Mapped');
    //   //     this.shareDataService.sendLoginPartner('quote');
    //   //   }
    //   // }
    // } else {
    const vehiclePopup = sessionStorage.getItem('vehiclePopup');
    let quotesUrl = sessionStorage.getItem('quotesUrl');
    if (quotesUrl) {
      if (vehiclePopup != 'true') {
        if (window.innerWidth <= 999) {
          this.bottomSheet.open(VehicleDetailsPopupComponent, {
            disableClose: true, // Disable closing on outside click
          });
        } else {
          this.openVehicleDetailsPopup(null);
        }
      }
    }
    // }
    this.is_cse = sessionStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = sessionStorage.getItem('employee_code');
    this.partner_code = sessionStorage.getItem('partner_code');
    if (this.partnerCodewithTraceId?.partner_code) {
      this.partner_code = this.partnerCodewithTraceId?.partner_code;
    }
    this.shareDataService.partnerCodeFromApiRes.subscribe((res) => {
      if (res) {
        this.partner_code = res;
      }
    });
    this.shareDataService.getIsNotCertifiedData.subscribe((notCertified) => {
      let vehicleLogin = sessionStorage.getItem('vehicleLoginPopup');
      // let popupLogin;
      // if (vehicleLogin) {
      //   popupLogin = JSON.parse(vehicleLogin);
      // }
      if (vehicleLogin == 'true') {
        this.currentPageUrl = this.router.url;
        if (
          !this.currentPageUrl.includes('proposal') &&
          this.currentPageUrl != '/'
        ) {
          if (notCertified === 'quote') {
            if (window.innerWidth <= 999) {
              this.bottomSheet.open(VehicleDetailsPopupComponent, {
                disableClose: true, // Disable closing on outside click
              });
            } else {
              this.openVehicleDetailsPopup(null);
            }
          }
        }
        this.isPopupClose = false;
        sessionStorage.setItem('vehicleLoginPopup', 'false');
      }
    });
    sessionStorage.removeItem('kycData');
    const partnerCodeTraceId = JSON.parse(
      sessionStorage.getItem('partnerCodeTraceId') || '{}'
    );
    if (partnerCodeTraceId) {
      // this.getTraceIdCommercialVehicle(partnerCodeTraceId?.trace_id)
    }
  }
  ngOnDestroy(): void {
    this.idleService.stopWatching();
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
    const vehicleType = sessionStorage.getItem('vehicleType');
    let apiData;
    if (id) {
      if (vehicleType == 'commercial_vehicle') {
        apiData = `?rb_mmv_id=${id}`;
      } else {
        apiData = `?product_name=${type}&rb_mmv_id=${id}`;
      }
    }
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
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
      .getRequestedResponse(`${ApiConstants.fetch_trace_Id()}${traceId}`)
      .subscribe((res: any) => {
        if (res != null) {
          const vehicleType = sessionStorage.getItem('vehicleType');
          if (vehicleType != 'commercial_vehicle') {
            sessionStorage.setItem('vehicleType', res?.vehicle_type);
          } else {
            sessionStorage.setItem('vehicleType', 'commercial_vehicle');
          }
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
          if (res?.is_rb_renewal) {
            sessionStorage.setItem('renewalType', 'renewal');
            sessionStorage.setItem('renewalPolicyNumber', res?.policy_number);
            let apiUrl;
            if (
              res?.registration_no != null &&
              res?.registration_no != '' &&
              res?.registration_no != undefined
            ) {
              this.getRenewalData(res?.registration_no);
            } else {
              this.getRenewalData(res?.policy_number);
            }
          }
          sessionStorage.setItem('productType', res.product_type);
          sessionStorage.setItem('transaction_id', res.transaction_id);
          sessionStorage.setItem('newVehicleType', res.business_type);
          if (res?.registration_no != null) {
            sessionStorage.setItem('registrationNumber', res?.registration_no);
          }
          if (res?.partner_code == null) {
            sessionStorage.setItem('partner_code', '');
          } else {
            if (res?.partner_code != null) {
              sessionStorage.setItem('partner_code', res?.partner_code);
            }
            if (
              res.meta_data.mmv_form_data?.partner_details?.first_name != null
            ) {
              sessionStorage.setItem(
                'first_name',
                res.meta_data.mmv_form_data?.partner_details?.first_name
              );
            }
            if (
              res.meta_data.mmv_form_data?.partner_details?.last_name != null
            ) {
              sessionStorage.setItem(
                'last_name',
                res.meta_data.mmv_form_data?.partner_details?.last_name
              );
            }
            if (
              res.meta_data.mmv_form_data?.partner_details?.middle_name != null
            ) {
              sessionStorage.setItem(
                'middle_name',
                res.meta_data.mmv_form_data?.partner_details?.middle_name
              );
            }
            if (res.meta_data.mmv_form_data?.partner_details?.token != null) {
              sessionStorage.setItem(
                'token',
                res.meta_data.mmv_form_data?.partner_details?.token
              );
            }
            if (
              res.meta_data.mmv_form_data?.partner_details?.employee_code !=
              null
            ) {
              sessionStorage.setItem(
                'employee_code',
                res.meta_data.mmv_form_data?.partner_details?.employee_code
              );
            }
            if (res.meta_data.mmv_form_data?.partner_details?.is_cse != null) {
              sessionStorage.setItem(
                'is_cse',
                res.meta_data.mmv_form_data?.partner_details?.is_cse
              );
            }
            if (
              res.meta_data.mmv_form_data?.partner_details?.pos_status != null
            ) {
              sessionStorage.setItem(
                'pos_status',
                res.meta_data.mmv_form_data?.partner_details?.pos_status
              );
            }
          }
          if (
            res?.meta_data?.selectedAddons !== 'undefined' &&
            res?.meta_data?.selectedAddons != null
          ) {
            let addonsValue = res?.meta_data?.selectedAddons || 'undefined';
            sessionStorage.setItem(
              'selectedAddons',
              JSON.stringify(addonsValue)
            );
          } else {
            sessionStorage.setItem('selectedAddons', JSON.stringify(undefined));
          }
          sessionStorage.setItem(
            'mmv_data',
            JSON.stringify(res?.meta_data?.mmv_form_data)
          );
          sessionStorage.setItem(
            'withoutVehicleNumber',
            res.meta_data.mmv_form_data?.form_value?.withoutVehicleNumber
          );
          this.shareDataService.getVehicleType(res.vehicle_type);
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
    this.isPopupClose = true;
    sessionStorage.setItem('vehicleLoginPopup', 'true');
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

  getRenewalData(apiUrl: any) {
    // let apiUrl;
    // apiUrl = `?registration_number=${registartionNumber.toUpperCase()}`;
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_renewal_policy}${apiUrl}`)
      .subscribe((res: any) => {
        if (res?.status) {
          sessionStorage.setItem('RenewalPreviousDetails', JSON.stringify(res));
          sessionStorage.setItem(
            'coverageType',
            JSON.stringify(
              res?.previous_policy_details?.previous_policy_details
                ?.renewal_coverage_type
            )
          );
          this.shareDataService.getRenewalData(res);
        }
      });
  }
}
