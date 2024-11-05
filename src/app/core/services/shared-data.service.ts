import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ApiConstants } from 'src/app/api.constant';
import { Router } from '@angular/router';
import { SseService } from './sse.service';
import moment from 'moment';
import { LoaderService } from './loader.service';
import { LongPollingService } from './long-polling.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/components/dialog-components/snackbar/snackbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();
  getRegistrationData: Subject<any> = new Subject();
  getSelectedvehicle: Subject<any> = new Subject();
  getProgressValue: Subject<any> = new Subject();
  getSelectedVehicleType: Subject<any> = new Subject();
  getRegistrationValue: Subject<any> = new Subject();
  regNumberData = new BehaviorSubject<any>(null);
  getProposalReviewDetails = new BehaviorSubject<any>(null);
  quotationListing: Subject<any> = new Subject();
  registrationMonthSelection: Subject<any> = new Subject();
  disableInsurer: Subject<any> = new Subject();
  detailNotFound: Subject<any> = new Subject();
  vehicleCardValue: Subject<any> = new Subject();
  longPollingInfo!: any;
  getProposalDetails: Subject<any> = new Subject();
  getErrorProposalDetails: Subject<any> = new Subject();
  getValueWithoutRegistration: Subject<any> = new Subject();
  fetchKycData: Subject<any> = new Subject();
  quotesData: Subject<any> = new Subject();
  fetchCKycFormData: Subject<any> = new Subject();
  registrationAddressData: Subject<any> = new Subject();
  financedAddressData: Subject<any> = new Subject();
  fetchedCkycData: Subject<any> = new Subject();
  addOnsBaseProposalType: Subject<any> = new Subject();
  idvValue: Subject<any> = new Subject();
  idvSliderHide: Subject<any> = new Subject();
  selectedADDOnsList: Subject<any> = new Subject();
  enableQuotesAction: Subject<any> = new Subject();
  enableCarLoader: Subject<any> = new Subject();
  enableChooseIDV: Subject<any> = new Subject();
  getTransactionId: Subject<any> = new Subject();
  tabChanges: Subject<any> = new Subject();
  inspectionCard: Subject<any> = new Subject();
  insurerDetails: Subject<any> = new Subject();
  redirectInsurerDetails: Subject<any> = new Subject();
  disableInitiatesQuotes: Subject<any> = new Subject();
  throughEmailVehicle: Subject<any> = new Subject();
  downloadBreakupResponse: Subject<any> = new Subject();
  vehicleCardEmailValue: Subject<any> = new Subject();
  vehicleTypeValue: Subject<any> = new Subject();
  nomineeData: Subject<any> = new Subject();
  quotesEnableForMobile: Subject<any> = new Subject();
  vehicleOwnerForm: Subject<any> = new Subject();
  partnerCodeFromApiRes: Subject<any> = new Subject();
  regNumberDataRenewal = new BehaviorSubject<any>(null);
  previousPolicyDetailsSubject = new BehaviorSubject<any>(null);
  renewalInsurer = new BehaviorSubject<any>(null);
  renewalQuotes = new BehaviorSubject<any>(null);
  checkRenewalQuotes = new BehaviorSubject<any>(null);
  updateVehicleType = new BehaviorSubject<any>(null);
  renewalVehicleData = new BehaviorSubject<any>(null);
  getRenewalMmv = new BehaviorSubject<any>(null);
  getOwnnerAddres = new BehaviorSubject<any>(null);
  getPlanType = new BehaviorSubject<any>(null);
  chooseIdvDataShow = new BehaviorSubject<any>(null);
  renewalPreviousPolicyData = new BehaviorSubject<any>(null);
  checkVehicleType = new BehaviorSubject<any>(null);
  changePolicyExpDate: Subject<any> = new Subject();
  traceIdVehicleType = new BehaviorSubject<any>(null);
  sendQuotesADDOnData = new BehaviorSubject<any>(null);
  sendRegDatePolicyExpiry = new BehaviorSubject<any>(null);
  getLoginPartner = new BehaviorSubject<any>(null);
  getIsNotCertifiedData: Subject<any> = new Subject();
  disableChangeInsurer: Subject<any> = new Subject();
  previousPolicyDetails$ = this.previousPolicyDetailsSubject.asObservable();
  regNumber: any;
  quotesConnectionData: any = [];
  vehicleType: any;
  transactionId: any;
  quotesId: any;
  proposerType: any;
  previousAddons: any;
  allQuotes: any;
  quotesValue: any;
  quoteData: any;
  createdProposalId: any;
  registrationAddressItem: any;
  idvData: any;
  quotesCount: any;
  financedAddressItem: any;
  proposalData: any;
  proposalDataItem: any;
  redirectProposalId: any;
  addOnsList: any = [];
  selected_addons: any;
  quoteItem: any;
  isNotShowVehicleDetails: boolean = false;
  setIsNotShowNomineeItem: any;
  addonsValue: any;
  ckycFormInfo: any;
  mmvData: any;
  editVehicleDetails = true;
  checkWheeler: any;
  isCheckWheeler = true;
  vaahanName: any;
  metaDataIdv: any;
  metaDataAddon: any;
  traceIdData: any;
  subdomain: any;
  initiate_QuotePayload: any;
  partnerCodeData: any;
  traceId: any;
  isRbRenewal: boolean = false;
  quotesListData: any;
  uniqueDataList: any;
  isRenewal:any;

  // isPageRefresh: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sseService: SseService,
    private loaderService: LoaderService,
    public longPollingService: LongPollingService,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    // Extract the base URL
    const currentBaseUrl = window.location.href;
    const url = new URL(currentBaseUrl);
    const hostParts = url.host.split('.');
    this.subdomain = hostParts[0];
  }

  sendVehicleEditData(data: any) {
    this.getVehicleDetails.next(data);
  }
  disabledChangeInsurerButton(data: any) {
    this.disableChangeInsurer.next(data);
  }
  /**
   *
   * @param data send vehicle type data for the vehicle search
   */
  selectedvehicle(data: any) {
    this.getSelectedvehicle.next(data);
  }
  setPreviousPolicyDetails(details: any) {
    this.previousPolicyDetailsSubject.next(details);
  }
  sendCarLoaderMessage(data: any) {
    this.getProgressValue.next(data);
  }
  handleEnterKey(event: Event, MatDatePickerName: any) {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLInputElement;
    const isDisabled = target.getAttribute('data-disabled') === 'true'; // Check the custom attribute
    // If the input field is disabled, return without executing further logic
    if (isDisabled) {
      return;
    }
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevent default Enter behavior
      MatDatePickerName.open(); // Open the MatDatepicker
    }
  }
  /**
   *
   * @param data send vehicle type data for the vehicle search
   */
  selectedVehicleType(data: any) {
    this.getSelectedVehicleType.next(data);
  }
  /**
   *
   * @param data send registration date data
   */
  registrationYearData(data: any) {
    this.registrationMonthSelection.next(data);
  }
  /**
   *
   * @param data disable field insurere and expiry policy date
   */
  insurerData(data: any) {
    this.disableInsurer?.next(data);
  }

  crossSellRecomendation(proposal_number: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.crosssell_recommendation}${proposal_number}`
      )
      .subscribe((res: any) => {});
  }
  /**
   * registration number base api
   */
  renewalType: any;
  vehicleDetails(data: any) {
    this.regNumber = sessionStorage.getItem('registrationNumber');
    this.renewalType = sessionStorage.getItem('renewalType');
    if (
      this.regNumber != null &&
      this.renewalType != 'renewal' &&
      this.renewalType != 'rollover'
    ) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.registration_number}?regn_no=${this.regNumber}`
        )
        .subscribe((res: any) => {
          if (res?.detail != 'Vehicle details not found.') {
            let checkWheeler = {
              is_two_wheeler: res['is_two_wheeler'],
              is_four_wheeler: res['is_four_wheeler'],
            };
            sessionStorage.setItem(
              'checkWheeler',
              JSON.stringify(checkWheeler)
            );
            if (res['is_four_wheeler'] && data == 'reg_no') {
              sessionStorage.setItem('vehicleType', `private_car`);
            } else if (data == 'reg_no') {
              sessionStorage.setItem('vehicleType', `two_wheeler`);
            }
            this.checkWheelerType(this.editVehicleDetails);
            this.regNumberData.next(res);

            let registrationDate = `${res?.registration_month}/${res?.registration_year}`;
            let dateObj = moment(registrationDate, 'MM/YYYY');
            // this.getRegistrationData.next(dateObj);
          } else {
            this.detailNotFound.next(res?.detail);
          }
        });
    }
  }

  checkWheelerType(editVehicleDetails: boolean) {
    this.checkWheeler = JSON.parse(
      sessionStorage.getItem('checkWheeler') || '{}'
    );
    if (editVehicleDetails && Object.keys(this.checkWheeler).length > 0) {
      if (
        (sessionStorage.getItem('vehicleType') == 'private_car' &&
          this.checkWheeler['is_four_wheeler']) ||
        (sessionStorage.getItem('vehicleType') == 'two_wheeler' &&
          this.checkWheeler['is_two_wheeler'])
      ) {
        this.isCheckWheeler = true;
        this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
        let traceValue = JSON.parse(this.traceIdData);
        this.router.navigate([`quotes/${traceValue.trace_id}`]);
        // this.router.navigate(['quotes']);
      } else {
        if (this.checkWheeler['is_two_wheeler']) {
          this.vaahanName = 'bike';
        }
        if (this.checkWheeler['is_four_wheeler']) {
          this.vaahanName = 'car';
        }
        this.isCheckWheeler = false;
        let vehicledata = {
          isCheckWheeler: this.isCheckWheeler,
          vaahanName: this.vaahanName,
        };
        this.checkVehicleType.next(vehicledata);
      }
    }
  }

  vehicleDetailsRenewal(data: any) {
    this.regNumberDataRenewal.next(data);
    this.partnerCodeData = sessionStorage.getItem('partnerCodeTraceId');
    const parsedValue = JSON.parse(this.partnerCodeData);
    this.traceId = parsedValue?.trace_id;
    // this.router.navigate(['quotes']);
  }

  getQuotationListing(
    data?: any,
    productType?: any,
    value?: any,
    notTransactionId?: any
  ) {
    this.proposerType = sessionStorage.getItem('proposerType');

    let setectedAddons;
    this.addonsValue = sessionStorage.getItem('selectedAddons');
    let addOnsList;
    if (this.addonsValue == 'undefined') {
      addOnsList = '';
    } else {
      addOnsList = JSON.parse(this.addonsValue);
    }

    if (data?.selected_addons) {
      setectedAddons = data?.selected_addons;
    } else if (addOnsList != null) {
      this.selected_addons = {};
      for (let key of addOnsList) {
        const keys = Object.keys(key);
        let variableValue = keys[0];
        this.selected_addons[variableValue] = key[variableValue];
      }
      setectedAddons = this.selected_addons;
    } else {
      setectedAddons = {};
    }

    let registrationValue;
    let registrationMonth;
    let registrationYear;
    let registrationDay;
    this.vehicleType = sessionStorage.getItem('vehicleType');
    if (data?.registration_month) {
      registrationMonth = data?.registration_month;
      registrationYear = data?.registration_year;
    } else {
      registrationValue = new Date(data?.registration_date);
      registrationMonth = registrationValue?.getMonth() + 1;
      registrationYear = registrationValue?.getFullYear();
      registrationDay = registrationValue.getDate();
    }
    let mmvId;
    let rtoCode;
    let previousExpiryDate;
    let previousInsurerCode;
    let previousPolicyType;
    if (data?.rb_mmv_id?.rb_mmv_id) {
      mmvId = data?.rb_mmv_id?.rb_mmv_id;
    } else {
      mmvId = data?.rb_mmv_id;
    }
    if (data?.rb_rto_code) {
      rtoCode = data?.rb_rto_code;
    } else {
      rtoCode = data?.rto_code;
    }
    if (data?.previous_policy_exp_date) {
      previousExpiryDate = data?.previous_policy_exp_date;
    } else {
      previousExpiryDate = data?.policy_expire_date;
    }

    if (data?.previous_insurer_code) {
      previousInsurerCode = data?.previous_insurer_code;
    } else if (data?.previous_insurer?.rb_insurer_code) {
      previousInsurerCode = data?.previous_insurer?.rb_insurer_code;
    } else {
      previousInsurerCode = null;
    }
    let transactionId = sessionStorage.getItem('transaction_id');
    let transactionIdData;
    if (transactionId) {
      transactionIdData = transactionId;
    } else {
      transactionIdData = '';
    }
    let ncbValue = 0;
    if (data?.ncb_discount) {
      ncbValue = data?.ncb_discount;
    }
    if (data?.policy_expiry_id_data) {
      previousPolicyType = data?.policy_expiry_id_data;
    } else {
      previousPolicyType = null;
    }
    let idvValue = null;
    if (data?.vehicle_idv) {
      if (/,/.test(data?.vehicle_idv)) {
        idvValue = data?.vehicle_idv.replace(/,/g, '');
      } else {
        idvValue = data?.vehicle_idv;
      }
    }
    let regNumberValue = sessionStorage.getItem('registrationNumber');
    if (regNumberValue) {
      regNumberValue = regNumberValue;
    }
    let quotesData;
    let traceIdData = sessionStorage.getItem('partnerCodeTraceId');
    let traceIdValue;
    let traceId;
    if (traceIdData) {
      traceIdValue = JSON.parse(traceIdData);
      traceId = traceIdValue.trace_id;
    }
    if (notTransactionId == 'notSendTransactionId') {
      quotesData = {
        registration_no: regNumberValue,
        customer_type: this.proposerType,
        vehicle_type: this.vehicleType,
        rb_mmv_id: mmvId,
        rb_rto_code: rtoCode,
        registration_day: registrationDay,
        registration_month: registrationMonth,
        registration_year: registrationYear,
        previous_insurer_code: previousInsurerCode,
        previous_policy_exp_date:
          previousExpiryDate != '' ? previousExpiryDate : null,
        previous_year_ncb: ncbValue,
        is_ownership_transfer: data?.user_car,
        is_claimed: data?.previous_claimed,
        business_type: sessionStorage.getItem('newVehicleType'),
        selected_addons: setectedAddons,
        product_type: productType,
        manufacture_month: data.manufacture_month,
        manufacture_year: data.manufacture_year,
        vehicle_idv: idvValue,
        previous_policy_type: previousPolicyType,
        meta_data: data?.meta_data,
        partner_code: localStorage.getItem('partner_code')
          ? localStorage.getItem('partner_code')
          : null,
        offered_ncb_value:
          data?.meta_data?.mmv_form_data?.addNcbBoth?.new_ncb_value,
        is_cse: localStorage.getItem('is_cse')
          ? localStorage.getItem('is_cse')
          : false,
        employee_code: localStorage.getItem('employee_code'),
        trace_id: traceId,
        is_d2c: false,
        is_rb_renewal: false,
      };
      if (!data?.user_car) {
        if (data?.previous_claimed) {
          quotesData.offered_ncb_value = 0;
        } else {
          quotesData.offered_ncb_value =
            data?.meta_data?.mmv_form_data?.addNcbBoth?.new_ncb_value;
        }
      } else {
        quotesData.offered_ncb_value = 0;
      }
    } else {
      quotesData = {
        transaction_id: transactionIdData,
        registration_no: regNumberValue,
        customer_type: this.proposerType,
        vehicle_type: this.vehicleType,
        rb_mmv_id: mmvId,
        rb_rto_code: rtoCode,
        registration_day: registrationDay,
        registration_month: registrationMonth,
        registration_year: registrationYear,
        previous_insurer_code: previousInsurerCode,
        previous_policy_exp_date:
          previousExpiryDate != '' ? previousExpiryDate : null,
        previous_year_ncb: ncbValue,
        is_ownership_transfer: data?.user_car,
        is_claimed: data?.previous_claimed,
        business_type: sessionStorage.getItem('newVehicleType'),
        selected_addons: setectedAddons,
        product_type: productType,
        manufacture_month: data.manufacture_month,
        manufacture_year: data.manufacture_year,
        vehicle_idv: idvValue,
        previous_policy_type: previousPolicyType,
        meta_data: data?.meta_data,
        partner_code: localStorage.getItem('partner_code')
          ? localStorage.getItem('partner_code')
          : null,
        offered_ncb_value:
          data?.meta_data?.mmv_form_data?.addNcbBoth?.new_ncb_value,
        is_cse: localStorage.getItem('is_cse')
          ? localStorage.getItem('is_cse')
          : false,
        employee_code: localStorage.getItem('employee_code'),
        trace_id: traceId,
        is_d2c: false,
        is_rb_renewal: false,
      };
      if (!data?.user_car) {
        if (data?.previous_claimed) {
          quotesData.offered_ncb_value = 0;
        } else {
          quotesData.offered_ncb_value =
            data?.meta_data?.mmv_form_data?.addNcbBoth?.new_ncb_value;
        }
      } else {
        quotesData.offered_ncb_value = 0;
      }
    }

    this.chooseIdvDataShow.next(productType);
    if (this.subdomain == 'd2c') {
      quotesData.is_d2c = true;
    }
    this.initiate_QuotePayload = quotesData;
    const renewal = sessionStorage.getItem('renewalType');
    if (renewal != null) {
      quotesData.is_rb_renewal = true;
      let mmvId = sessionStorage.getItem('mmvId');
      quotesData.rb_mmv_id = Number(mmvId);
    }

    this.apiService
      .postRequestedResponse(`${ApiConstants.initiate_quotes}`, quotesData)
      .subscribe((res) => {
        if (res?.status) {
          if (renewal != null) {
            // sessionStorage.setItem('renewalType', 'renewal');
          }
          this.sendCarLoaderMessage(0);
          this.transactionId = res.transaction_id;
          this.sendTransactionId(res.transaction_id);
          sessionStorage.setItem('transaction_id', res.transaction_id);
          sessionStorage.setItem('quote_request_id', res.quote_request_id);

          this.quotesId = res.quote_request_id;
          this.quotesConnectionData = [];
          this.enableCarLoader.next(this.quotesCount);
          this.enableChooseIDV.next(this.quotesCount);
          // this.longPollingInformation(this.transactionId, this.quotesId);
          this.quotesThroughSSE(this.transactionId, this.quotesId);
        } else {
          const dialogRef = this.dialog.open(FailureDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {
              errorData: res?.message,
              statusdata: status,
            },
            panelClass: 'failure-dialog-class',
          });
          dialogRef.afterClosed().subscribe((result: any) => {});
        }
      });
  }

  /**
   *  vehicle popup data send to the quotes api
   */
  vehicleMMVDetails(
    producttype?: any,
    mmvFromData?: any,
    data?: any,
    selectedAddOns?: any,
    notSendTransactionId?: any
  ) {
    if (mmvFromData) {
      let mmvData;

      mmvData = JSON.parse(mmvFromData);
      let policyExpiryDate;

      let manufactureValue;
      let manufactureMonth;
      let manufactureYear;

      if (
        mmvData?.policy_expiry_date != '' &&
        mmvData?.policy_expiry_date != null
      ) {
        policyExpiryDate = moment(mmvData.policy_expiry_date).format(
          'DD/MM/YYYY'
        );
      } else {
        policyExpiryDate = '';
      }
      manufactureValue = new Date(mmvData?.manufacture_date);
      manufactureMonth = manufactureValue?.getMonth() + 1;
      manufactureYear = manufactureValue?.getFullYear();
      this.idvData = sessionStorage.getItem('idvData');
      let selectedIdv;
      let idvObject;
      if (this.idvData == 'undefined') {
        idvObject = '';
      } else {
        idvObject = JSON?.parse(this.idvData);
      }

      if (idvObject?.chooseIdv) {
        selectedIdv = idvObject.chooseIdv;
      } else if (idvObject?.minIdv) {
        selectedIdv = idvObject.minIdv;
      } else if (idvObject?.maxIdv) {
        selectedIdv = idvObject.maxIdv;
      } else {
        selectedIdv = 0;
      }
      // this.metaDataIdv = sessionStorage.getItem('idvData');
      // let metaDataIdvValue = JSON.parse(this.metaDataIdv);
      // this.metaDataAddon = sessionStorage.getItem('selectedAddons');
      // let metaDataAddonValue;
      // if (typeof this.metaDataAddon == 'string') {
      //   metaDataAddonValue = JSON.parse(this.metaDataAddon);
      // } else {
      // metaDataAddonValue = this.metaDataAddon;
      // }

      let popupHideShowData = {
        NoExpiryPolicy: mmvData?.NoExpiryPolicy,
        hidePreviousClaimed: mmvData?.hidePreviousClaimed,
        policy_expiry_id_data: mmvData?.policy_expiry_id_data,
        policy_expiry_type: mmvData?.policy_expiry,
        idvData: sessionStorage.getItem('idvData'),
        selectedAddons: sessionStorage.getItem('selectedAddons'),
        mmv_form_data: mmvData,
        selectedTabIndex: sessionStorage.getItem('lastSelectedTabIndex'),
      };
      let offeredValue;
      if (mmvData?.offeredNCBValue != '' && mmvData?.offeredNCBValue) {
        offeredValue = JSON.parse(mmvData.offeredNCBValue);
      } else {
        offeredValue = null;
      }
      let mmvValues = {
        rb_mmv_id: mmvData?.vehicle_variant,
        rto_code: mmvData?.registration_city?.rb_rto_code,
        registration_date: mmvData.registration_date,
        previous_insurer: mmvData.previous_insurer,
        policy_expire_date: policyExpiryDate,
        manufacture_month: manufactureMonth,
        manufacture_year: manufactureYear,
        ncb_discount: mmvData.ncb_discount,
        user_car: mmvData.user_car,
        previous_claimed: mmvData.previous_claimed,
        selected_addons: selectedAddOns,
        vehicle_idv: selectedIdv,
        policy_expiry_id_data: mmvData?.policy_expiry_id_data,
        meta_data: popupHideShowData,
        offered_ncb_value: offeredValue,
      };
      this.getValueWithoutRegistration.next(mmvValues);
      this.getQuotationListing(
        mmvValues,
        producttype,
        data,
        notSendTransactionId
      );
    }
  }

  vehicleCardData(fromData: any) {
    this.vehicleCardValue.next(fromData);
  }
  openSnackBar(message: string, success: any, duration: any) {
    const snackBarRef = this.snackbar.openFromComponent(SnackbarComponent, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: 'my-custom-snackbar',
      data: { message: message, success: success },
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }
  /**
   *
   * @param data change add ons on the base of proposal type
   */
  addOnsChange(data: any) {
    this.addOnsBaseProposalType.next(data);
  }
  sendProposalReviewEditId(data: any) {
    this.getProposalReviewDetails.next(data);
  }
  getRegistrationDate(data: any) {
    this.getRegistrationData.next(data);
  }

  /**
   * Creates a new proposal based on the given form data.
   *
   * @param flag - The form field flag indicating which form data to use.
   * @param formData - The form data containing the customer, vehicle, and other details.
   */
  createProposalId(flag?: any, formData?: any, fetchCkyc?: any) {
    this.proposerType = sessionStorage.getItem('proposerType');
    this.vehicleType = sessionStorage.getItem('vehicleType');
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    let transactionId = sessionStorage.getItem('transaction_id');
    const proposalId = sessionStorage.getItem('proposal_Id');
    this.proposalDataItem = {
      transaction_id: transactionId || '',
      insurer_quote_id: this.quoteData?.quote_id || '',
      insurer_code: this.quoteData?.insurer_code || '',
      insurer_name: this.quoteData?.insurer_name || '',
      proposal_id:
        proposalId !== undefined && proposalId !== null
          ? typeof proposalId === 'string'
            ? proposalId.replace(/['"]+/g, '')
            : proposalId
          : '',
      is_breakin: this.quoteData?.is_breakin,
      insured_idv: this.quoteData?.premium_details?.idv,
      is_rb_renewal: false,
    };
    if (flag === 'ckyc') {
      this.proposalDataItem['ckyc_details'] = {
        full_name: formData?.get('ckyc_full_name')?.value || '',
        dob:
          this.datePipe.transform(
            formData?.get('dob')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
        gender: formData?.get('ckyc_gender')?.value || '',
        is_verification: fetchCkyc?.verification_status,
        document_type: formData?.get('document_type_based_field')?.value || '',
        document_number:
          formData?.get('document_number_based_field')?.value.toUpperCase() ||
          '',
      };
    }
    if (flag === 'vehicle_owner_detail') {
      this.proposalDataItem['customer_details'] = {
        full_name: formData?.get('owner_full_Name')?.value || '',
        mobile_number: formData?.get('contact_number')?.value || '',
        email_id: formData?.get('owner_email')?.value || '',
        dob: '18/07/1999',
        occupation_type_id:
          formData?.get('ownner_occupation_type')?.value || null,
        gst_no: formData?.get('owner_gstin')?.value || '',
        additional_mobile_number:
          formData?.get('additional_contact')?.value || '',
        gender: formData?.get('owner_gender')?.value || '',
        marital_status: formData?.get('marital_status')?.value || null,
        salutation: formData?.get('ownner_salutation_type')?.value || '',
        nationality: 'INDIAN',
        communication_address: {
          pincode: formData?.get('owner_pincode')?.value?.rb_pincode || '',
          rb_city_id: formData?.get('owner_pincode')?.value?.rb_city_code || '',
          rb_state_id: formData?.get('owner_pincode')?.value?.rb_state_id || '',
          address_line:
            formData?.get('owner_communication_addres')?.value || '',
        },
        customer_type: this.proposerType || '',
        pan_number: formData?.get('document_number_based_field')?.value || null,
      };
    }
    if (flag === 'nominne_details') {
      this.proposalDataItem['nominee_details'] = {
        name: formData?.get('nominne_full_Name')?.value,
        age: formData?.get('age')?.value,
        relation_id: formData?.get('nominne_relation')?.value,
      };
    }
    if (flag === 'vehilce_details') {
      this.proposalDataItem['vehicle_details'] = {};
      this.proposalDataItem['vehicle_details'].registration_address = {};
      this.proposalDataItem['vehicle_details'] = {
        registration_no:
          formData?.get('registration_number_last_digit') !== null
            ? formData?.get('registration_number')?.value.toUpperCase() || ''
            : null,
        engine_no: formData?.get('engine_number')?.value.toUpperCase() || '',
        chassis_no: formData?.get('chassis_number')?.value.toUpperCase() || '',
        vehicle_type: this.vehicleType,
        registration_date:
          this.datePipe.transform(
            formData?.get('registration_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
        manufacture_date:
          this.datePipe.transform(
            formData?.get('manufacture_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
        vehicle_color: formData?.get('vehicle_colour')?.value || '',
        is_vehicle_financed:
          formData?.get('is_financed')?.value || ''
            ? formData?.get('is_financed')?.value || ''
            : 'false',
        is_same_location:
          formData?.get('is_vehicle_address')?.value || ''
            ? formData?.get('is_vehicle_address')?.value || ''
            : 'false',
        mmv_id: this.mmvData?.vehicle_variant?.rb_mmv_id,
      };
      if (this.registrationAddressItem) {
        this.proposalDataItem['vehicle_details'].registration_address = {
          pincode:
            this.createdProposalId.customer_details?.communication_address
              ?.pincode || '',
          rb_city_id:
            this.createdProposalId.customer_details?.communication_address
              ?.rb_city_id || '',
          rb_state_id:
            this.createdProposalId.customer_details?.communication_address
              ?.rb_state_id || '',
          address_line:
            this.createdProposalId.customer_details?.communication_address
              ?.address_line || '',
        };
      } else {
        this.proposalDataItem['vehicle_details'].registration_address = {
          pincode: formData?.get('vehicle_pincode')?.value?.rb_pincode || '',
          rb_city_id:
            formData?.get('vehicle_pincode')?.value?.rb_city_code || '' || '', // Set to appropriate default value
          rb_state_id:
            formData?.get('vehicle_pincode')?.value?.rb_state_id || '' || '', // Set to appropriate default value
          address_line:
            formData?.get('vehicle_registration_address')?.value || '',
        };
      }
      if (this.financedAddressItem) {
        this.proposalDataItem['vehicle_details'].financer_details = {
          financer_id: formData?.get('financer')?.value?.rb_financier_id || '',
          agreement_type: formData?.get('agreement_type')?.value || '',
          financer_branch: formData?.get('financer_city')?.value || '',
        };
      } else {
        this.proposalDataItem['vehicle_details'];
      }
    }
    let previousPolicyType = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );
    if (
      flag === 'previous_policy_details' &&
      (previousPolicyType?.policy_expiry === 'saod' ||
        previousPolicyType?.policy_expiry === 'bundle')
    ) {
      this.proposalDataItem['previous_policy_details'] = {};
      this.proposalDataItem['previous_policy_details'].tp_policy_details = {};
      this.proposalDataItem['previous_policy_details'] = {
        insurer_code: formData?.get('previous_insurer')?.value?.rb_insurer_code,
        policy_no: formData?.get('prev_policy_number')?.value,
        policy_expiry_date:
          this.datePipe.transform(
            formData?.get('policy_expiry_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
      };

      let productTypeValue = sessionStorage.getItem('productType');
      let previousPolicyType = JSON.parse(
        sessionStorage.getItem('mmv_data') || '{}'
      );
      if (
        previousPolicyType?.policy_expiry === 'saod' ||
        previousPolicyType?.policy_expiry === 'bundle'
      ) {
        this.proposalDataItem['previous_policy_details'].tp_policy_details = {
          tp_insurer_code: formData?.get('tp_insurance_company')?.value
            ?.rb_insurer_code,
          tp_policy_no: formData?.get('tp_policy_number')?.value,
          tp_policy_expiry_date:
            this.datePipe.transform(
              formData?.get('tp_policy_end_date')?.value,
              'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
            ) || '',
          tp_policy_start_date:
            this.datePipe.transform(
              formData?.get('tp_policy_start_date')?.value,
              'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
            ) || '',
        };
      } else {
        this.proposalDataItem['previous_policy_details'].tp_policy_details = {};
      }
    } else if (
      flag === 'previous_policy_details' &&
      (previousPolicyType?.policy_expiry === 'satp' ||
        previousPolicyType?.policy_expiry === 'bundled_tp')
    ) {
      this.proposalDataItem['previous_policy_details'] = {};
      this.proposalDataItem['previous_policy_details'].tp_policy_details = {};
      this.proposalDataItem['previous_policy_details'].tp_policy_details = {
        tp_insurer_code: formData?.get('tp_insurance_company')?.value
          ?.rb_insurer_code,
        tp_policy_no: formData?.get('tp_policy_number')?.value,
        tp_policy_expiry_date:
          this.datePipe.transform(
            formData?.get('tp_policy_end_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
        tp_policy_start_date:
          this.datePipe.transform(
            formData?.get('tp_policy_start_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
      };
    } else if (
      flag === 'previous_policy_details' &&
      previousPolicyType?.policy_expiry === 'comprehensive'
    ) {
      this.proposalDataItem['previous_policy_details'] = {};
      this.proposalDataItem['previous_policy_details'].tp_policy_details = {};
      this.proposalDataItem['previous_policy_details'] = {
        insurer_code: formData?.get('tp_insurance_company')?.value
          ?.rb_insurer_code,
        policy_no: formData?.get('tp_policy_number')?.value,
        policy_expiry_date:
          this.datePipe.transform(
            formData?.get('tp_policy_end_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
      };

      let productTypeValue = sessionStorage.getItem('productType');
      let previousPolicyType = JSON.parse(
        sessionStorage.getItem('mmv_data') || '{}'
      );
      if (previousPolicyType?.policy_expiry === 'comprehensive') {
        this.proposalDataItem['previous_policy_details'].tp_policy_details = {
          tp_insurer_code: formData?.get('tp_insurance_company')?.value
            ?.rb_insurer_code,
          tp_policy_no: formData?.get('tp_policy_number')?.value,
          tp_policy_expiry_date:
            this.datePipe.transform(
              formData?.get('tp_policy_end_date')?.value,
              'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
            ) || '',
          tp_policy_start_date:
            this.datePipe.transform(
              formData?.get('tp_policy_start_date')?.value,
              'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
            ) || '',
        };
      } else {
        this.proposalDataItem['previous_policy_details'].tp_policy_details = {};
      }
    }
    if (flag === 'proposal_review') {
      this.proposalDataItem['previous_policy_details'] = {
        ...formData,
      };
    }
    let renewalType = sessionStorage.getItem('renewalType');
    if (renewalType == 'renewal' || renewalType == 'rollover') {
      const isRenewal = sessionStorage.getItem('isprevoiusInsurer');
      if(isRenewal == 'true'){
        this.proposalDataItem.is_rb_renewal = true;
      }else{
        this.proposalDataItem.is_rb_renewal = false;
      }
    }
    this.apiService
      .postRequestedResponseCreateProposal(
        ApiConstants.create_proposal,
        this.proposalDataItem
      )
      .subscribe(
        (res) => {
          if (res) {
            this.createdProposalId = res;
            sessionStorage.setItem('proposal_Id', res?.proposal_id);
            this.sendProposalData(res);
            if (flag === 'ckyc') {
              if (this.createdProposalId?.ckyc_details !== null) {
                this.openSnackBar('Ckyc Details Saved', true, 3000);
              }
            }
            if (flag === 'vehicle_owner_detail') {
              if (this.createdProposalId?.customer_details !== null) {
                this.openSnackBar('Customer Details Saved', true, 3000);
              }
            }
            if (flag === 'nominne_details') {
              if (this.createdProposalId?.nominee_details !== null) {
                this.openSnackBar('Nominee Details Saved', true, 3000);
              }
            }
            if (flag === 'vehilce_details') {
              if (this.createdProposalId?.vehicle_details !== null) {
                this.openSnackBar('Vehicle Details Saved', true, 3000);
              }
            }
            if (flag === 'previous_policy_details') {
              if (this.createdProposalId?.previous_policy_details !== null) {
                this.openSnackBar('Previous Policy Details Saved', true, 3000);
              }
            }
            if (
              this.createdProposalId?.nominee_details === null &&
              this.createdProposalId?.vehicle_details !== null
            ) {
              if (
                this.quoteData?.premium_details?.addon_premium_details?.length >
                0
              ) {
                for (let isCpa of this.quoteData?.premium_details
                  ?.addon_premium_details) {
                  if (
                    (isCpa?.add_on_code === 'CPA' ||
                      isCpa?.add_on_code === 'CPA3' ||
                      isCpa?.add_on_code === 'CPA5') &&
                    this.proposerType !== 'corporate'
                  ) {
                    this.isNotShowVehicleDetails = true;
                  }
                }
              } else if (this.proposerType === 'corporate') {
                this.isNotShowVehicleDetails = false;
              } else {
                this.isNotShowVehicleDetails = false;
              }
            } else {
              this.isNotShowVehicleDetails = false;
            }
            this.setIsNotShowNomineeDetails(this.isNotShowVehicleDetails);
          }
        },
        (error: any) => {
          // this.sendErrorProposalData(error?.error);
        }
      );
  }
  shareQuotes(
    quotes_data: any,
    share_type: any,
    partner_name: any,
    url: any,
    mail_id: any,
    mobile_name: any,
    quote_id: any
  ) {
    const baseURL = `${window.location.protocol}//${window.location.hostname}/`;
    let data = {
      transaction_id: quotes_data['transaction_id'],
      share_type: share_type,
      partner_name:
        localStorage.getItem('first_name') != null
          ? localStorage.getItem('first_name') +
            ' ' +
            localStorage.getItem('last_name')
          : '',
      URL: `${baseURL}${url}`,
      mail_id: mail_id ? mail_id : '',
      mobile_no: mobile_name ? mobile_name : null,
      quote_id: quote_id,
      quote_request_id: quotes_data['quote_request_id'],
    };
    return this.apiService.postRequestedResponse(
      `${ApiConstants.send_communication}`,
      data
    );
  }
  sendProposalData(data: any) {
    this.getProposalDetails.next(data);
  }
  sendErrorProposalData(data: any) {
    this.getErrorProposalDetails.next(data);
  }
  kycFetched(data: any) {
    this.fetchKycData.next(data);
  }
  ckycFormData(data: any) {
    this.fetchCKycFormData.next(data);
  }
  registrationAddress(data: any) {
    this.registrationAddressData.next(data);
    this.registrationAddressItem = data;
  }
  isFinancedAddress(data: any) {
    this.financedAddressData.next(data);
    this.financedAddressItem = data;
  }
  getFetchedCkycData(data: any) {
    this.fetchedCkycData.next(data);
    if (data) {
      this.createProposalId('ckyc', this.ckycFormInfo, data);
    }
  }
  /**
   * To handel the Autocomplte Dropdown css issue
   */
  onOpenedAutoComplete() {
    document.body.style.overflowY = 'hidden';
  }

  onClosedAutoComplete() {
    document.body.style.overflowY = 'auto';
  }
  /**
   * Parses a date string into a Date object using the given format.
   *
   * @param dateString - The date string to parse.
   * @param format - The date format string.
   * @returns The parsed Date object or null if the input is not a valid date.
   */
  parseDate(dateString: string, format: string): Date | null {
    const parsedDate = moment(dateString, format);

    if (parsedDate.isValid()) {
      return parsedDate.toDate();
    } else {
      return null;
    }
  }
  /**
   *
   * @param minIdv send min idv to choose-idv component
   * @param maxIdv send max idv to choose-idv component
   */
  chooseIdvData(minIdv: any, maxIdv: any, averageIdv: any) {
    let idvData = {
      min_idv: minIdv,
      max_idv: maxIdv,
      averageIdv: averageIdv,
    };
    this.idvValue.next(idvData);
  }
  /**
   * in case of third party tab idv should be hide service call
   */
  chooseIdvHide(data: any) {
    this.idvSliderHide.next(data);
  }
  /**
   * selected addons service call
   */
  selectedADDOns(data: any) {
    this.selectedADDOnsList.next(data);
  }
  sendTransactionId(data: any) {
    this.getTransactionId.next(data);
  }
  /**
   * Fires an event to notify other components that the tab has changed.
   *
   * @param data - The data associated with the tab change.
   */

  tabChangeModified(data: any) {
    this.tabChanges.next(data);
  }

  inspectionCaseData(data: any) {
    this.inspectionCard.next(data);
  }
  /**
   * when user is redirect from review page to review page on click of share
   *
   */
  getInsurerDetail(data: any) {
    this.insurerDetails.next(data);
    this.renewalPreviousPolicyData.next(data);
    this.proposalData = data;
  }
  /**
   * when user is redirect from review page to review page on click of share the data send into the Insurer detail
   */
  setRedirectDataForInsurer(data: any) {
    this.redirectInsurerDetails.next(data);
  }

  /**
   * Disables the Initiates Quotes base functionality.
   *
   * @param data - The data to be passed to the next component.
   */

  disableInitiatesQuotesBase(data: any) {
    this.disableInitiatesQuotes.next(data);
  }
  /**
   * Downloads the policy premium breakup as a PDF file.
   *
   * @param url - The URL of the policy document.
   */
  getDownloadTemplate(url: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/pdf',
    });

    return this.http.get(`${ApiConstants?.downloadPremiumBreakup}${url}`, {
      headers,
      responseType: 'arraybuffer',
    });
  }
  downloadPolicy(url: any) {
    this.getDownloadTemplate(url).subscribe((response: any) => {
      /**
       * Create a Blob from the response data
       */
      const blob = new Blob([response], { type: 'application/pdf' });
      this.downloadBreakupResponse.next(response);
      /**
       * Create a download link
       */
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      /**
       * Set the download attribute to the desired filename
       */
      link.download = 'Premium_breakup.pdf';

      /**
       * Append the link to the body
       */
      document.body.appendChild(link);

      /**
       * Trigger the download
       */
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }
  /**

   * @param url - use when user come through the email
   */
  vehicleCardDataEmail(data: any) {
    this.throughEmailVehicle.next(data);
  }
  /**

   * @param url - use for get Quotes when transaction id already genrated
   */
  getQuotesOnTransactionId(data: any) {
    this.transactionId = data.transaction_id;
    this.sendTransactionId(data.transaction_id);

    this.quotesId = data.quote_request_id;
    this.quotesConnectionData = [];
    // this.longPollingInformation(this.transactionId, this.quotesId);
    this.quotesThroughSSE(this.transactionId, this.quotesId);
  }

  vehicleCardEmailData(fromData: any) {
    this.vehicleCardEmailValue.next(fromData);
  }
  getVehicleType(data: any) {
    this.vehicleTypeValue.next(data);
  }
  sendQuoteData(quoteData: any) {
    this.quoteItem = quoteData;
  }
  getQuoteItem() {
    return this.quoteItem;
  }
  setIsNotShowNomineeDetails(data: any) {
    this.nomineeData.next(data);
  }
  /**
   *
   * @param data use for the mobile idv updation
   */
  enableQuotesData(data: any) {
    this.quotesEnableForMobile.next(data);
  }
  isDisabledVehicleButton(data: any) {
    this.setIsNotShowNomineeItem = data;
  }
  sendCkycFormData(data: any) {
    this.ckycFormInfo = data;
  }
  patchInsurer(data: any) {
    this.renewalInsurer.next(data);
  }

  quotesDataOnRenewal(data: any) {
    this.renewalQuotes.next(data);
  }

  changeVehicleType(data: any) {
    this.updateVehicleType.next(data);
  }
  formCheck(data: any) {
    this.vehicleOwnerForm.next(data);
  }

  partnerCode(data: any) {
    this.partnerCodeFromApiRes.next(data);
  }

  policyExpiryDate(date: any) {
    this.changePolicyExpDate.next(date);
  }
  sendPrevAddon(data: any) {
    this.previousAddons = data;
  }

  renewalData(data: any) {
    this.renewalVehicleData.next(data);
  }
  sendRenewalMmv(data: any) {
    this.getRenewalMmv.next(data);
  }
  sendPlanType(data: any) {
    this.getPlanType.next(data);
  }

  vehicleCardTypeData(data: any) {
    this.traceIdVehicleType.next(data);
  }
  getAddressValidation(insurerCode: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.address_validation}?insurer_code=${insurerCode}`
      )
      .subscribe((res) => {
        // this.expiryListData = res;
        this.sendErrorProposalData(res);
      });
  }
  sendOwnnerAddres(data: any) {
    this.getOwnnerAddres.next(data);
  }

  longPollingInformation(transactionId: any, quotesId: any) {
    this.longPollingInfo = this.longPollingService.getAllQuotes(
      transactionId,
      quotesId
    );

    // Define an empty array to store emitted values
    let dataArray: any[] = [];

    // Subscribe to the Observable
    this.longPollingInfo.subscribe({
      next: (value: any) => {
        // Push each emitted value into the array
        dataArray = [];
        dataArray.push(value);

        const quotesArray = dataArray[0].quotes;

        // Parse each string element into a JavaScript object
        const parsedQuotesArray = quotesArray.map((quote: string) =>
          JSON.parse(quote)
        );
        console.log(parsedQuotesArray);
        this.quotesCount = '';
        this.quotesCount = parsedQuotesArray;
        this.quotationListing.next(parsedQuotesArray);
        // setTimeout(() => {
        //   this.enableQuotesAction.next(true);
        // }, 25000);
      },
      complete: () => {
        // When the Observable completes, dataArray contains all emitted values

        this.enableQuotesAction.next(this.quotesCount);
      },
      error: (error: any) => {
        // Handle errors if any
        console.error('Error occurred:', error);
      },
    });
  }

  /**
   * service call for the server side event handling
   */
  quotesThroughSSE(transactionId: any, quotesId: any) {
    let d2c = false;
    if (this.subdomain == 'd2c') {
      d2c = true;
    }
    this.sseService
      .getServerSentEvent(
        `/api/v1/fetch_quotes/${transactionId}/${quotesId}/?is_d2c=${d2c}`
      )
      .subscribe(
        (eventSource) => {
          if (eventSource.data != 'null') {
            let quotesEvent = JSON.parse(eventSource.data);

            this.quotesConnectionData.push(quotesEvent);

            this.allQuotes = this.quotesConnectionData;

            this.quotesValue = this.quotesConnectionData;
            // console.log(this.allQuotes, '-----');
            this.quotesListData = {};
            this.quotesValue.forEach((item: any) => {
              if (item.status) {
                const uniqueKey = `${item.insurer_code}_${item.payd?.status}`;
                this.quotesListData[uniqueKey] = item;
              } else {
                const uniqueKey = item.payd?.status?`${item.insurer_code}_true`:`${item.insurer_code}_false`;
                this.quotesListData[uniqueKey] = item;
              }
            });
            // console.log(this.quotesListData, 'ttttt');
            this.uniqueDataList = Object.values(this.quotesListData);
            // console.log(this.uniqueDataList, 'fchggcg');
            // this.allQuotes = Object.values(
            //   this.quotesValue.reduce(
            //     (
            //       data: any,
            //       obj: {
            //         insurer_name: any;
            //       }
            //     ) => ({ ...data, [obj.insurer_name]: obj }),
            //     {}
            //   )
            // );
            this.allQuotes = this.uniqueDataList;
            this.quotesCount = '';
            this.quotesCount = this.allQuotes;
            console.log(this.allQuotes);
            setTimeout(() => {
              this.enableQuotesAction.next(this.quotesCount);
            }, 10000);
            // console.log(this.allQuotes);
            this.quotationListing.next(this.allQuotes);
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('==> complete');
        }
      );
  }
  initiateInsurerQuotePremium(selectedkms: any, insurerCode: any) {
    this.initiate_QuotePayload.isPay = selectedkms;
    this.apiService
      .postRequestedResponse(
        ApiConstants.initiate_insurer_quote + `?insurer=${insurerCode}`,
        this.initiate_QuotePayload
      )
      .subscribe((res) => {
        if (res?.status) {
          console.log(res);
        } else {
          const dialogRef = this.dialog.open(FailureDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {
              errorData: res?.message,
              statusdata: status,
            },
            panelClass: 'failure-dialog-class',
          });
          dialogRef.afterClosed().subscribe((result: any) => {});
        }
      });
  }

  quotesADDOnData(data: any) {
    this.sendQuotesADDOnData.next(data);
  }

  regDateForPolicyExpiry(data: any) {
    this.sendRegDatePolicyExpiry.next(data);
  }
  sendLoginPartner(data: any) {
    this.getLoginPartner.next(data);
  }
  sendNotCertifiedData(data: any) {
    this.getIsNotCertifiedData.next(data);
  }
}
