import { Injectable, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ApiConstants } from 'src/app/api.constant';
import { Router } from '@angular/router';
import { SseService } from './sse.service';
import moment from 'moment';
import { LoaderService } from './loader.service';
import { LongPollingService } from './long-polling.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();
  getProposalReviewDetails: Subject<any> = new Subject();
  getRegistrationData: Subject<any> = new Subject();
  getSelectedvehicle: Subject<any> = new Subject();
  getSelectedVehicleType: Subject<any> = new Subject();
  getRegistrationValue: Subject<any> = new Subject();
  regNumberData: Subject<any> = new Subject();
  quotationListing: Subject<any> = new Subject();
  registrationMonthSelection: Subject<any> = new Subject();
  disableInsurer: Subject<any> = new Subject();
  detailNotFound: Subject<any> = new Subject();
  vehicleCardValue: Subject<any> = new Subject();
  longPollingInfo!: Observable<[]>;
  getProposalDetails: Subject<any> = new Subject();
  getValueWithoutRegistration: Subject<any> = new Subject();
  fetchKycData: Subject<any> = new Subject();
  quotesData: Subject<any> = new Subject();
  fetchCKycFormData: Subject<any> = new Subject();
  registrationAddressData: Subject<any> = new Subject();
  fetchedCkycData: Subject<any> = new Subject();

  regNumber: any;
  connectionData: any = [];
  vehicleType: any;
  transactionId: any;
  quotesId: any;
  proposerType: any;
  allQuotes: any;
  quotesValue: any;
  quoteData: any;
  createdProposalId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sseService: SseService,
    private loaderService: LoaderService,
    public longPollingService: LongPollingService,
    private datePipe: DatePipe
  ) {}

  sendVehicleEditData(data: any) {
    this.getVehicleDetails.next(data);
  }
  /**
   *
   * @param data send vehicle type data for the vehicle search
   */
  selectedvehicle(data: any) {
    this.getSelectedvehicle.next(data);
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
    this.disableInsurer.next(data);
  }

  /**
   * registration number base api
   */

  vehicleDetails(data: any) {
    this.regNumber = sessionStorage.getItem('registrationNumber');
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.registration_number}?regn_no=${this.regNumber}`
      )
      .subscribe((res: any) => {
        if (res?.detail != 'Vehicle details not found.') {
          this.regNumberData.next(res);
          // this.getQuotationListing(res, data);
          this.router.navigate(['/motor/quotes']);
          let registrationDate = `${res?.registration_month}/${res?.registration_year}`;
          let dateObj = moment(registrationDate, 'MM/YYYY');
          this.getRegistrationData.next(dateObj);
        } else {
          this.detailNotFound.next(res?.detail);
        }
      });
  }

  getQuotesTabs() {
    this.quotesData.next('tabs');
  }

  getQuotationListing(data?: any, productType?: any, value?: any) {
    let fetchQuotesData = sessionStorage.getItem('forQuotesFetchData');
    this.proposerType = sessionStorage.getItem('proposerType');
    if (!fetchQuotesData) {
      sessionStorage.setItem('forQuotesFetchData', JSON.stringify(data));
    }
    let setectedAddons;
    if (data?.selected_addons) {
      setectedAddons = data?.selected_addons;
    } else {
      setectedAddons = {};
    }
    let registrationValue;
    let registrationMonth;
    let registrationYear;
    this.vehicleType = localStorage.getItem('vehicleType');
    if (data?.registration_month) {
      registrationMonth = data?.registration_month;
      registrationYear = data?.registration_year;
    } else {
      registrationValue = new Date(data?.registration_date);
      registrationMonth = registrationValue?.getMonth() + 1;
      registrationYear = registrationValue?.getFullYear();
    }
    let mmvId;
    let rtoCode;
    let previousExpiryDate;
    let previousInsurerCode;
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
    } else {
      previousInsurerCode = '';
    }

    let ncbValue = 0;
    if (data?.ncb_discount) {
      ncbValue = data?.ncb_discount;
    }

    let quotesData = {
      customer_type: this.proposerType,
      vehicle_type: this.vehicleType,
      rb_mmv_id: mmvId,
      rb_rto_code: rtoCode,
      registration_month: registrationMonth,
      registration_year: registrationYear,
      previous_insurer_code: previousInsurerCode,
      previous_policy_exp_date: previousExpiryDate,
      previous_year_ncb: ncbValue,
      is_ownership_transfer: data?.user_car,
      is_claimed: data?.previous_claimed,
      business_type: sessionStorage.getItem('newVehicleType'),
      selected_addons: setectedAddons,
      product_type: productType,
      manufacture_month: data.manufacture_month,
      manufacture_year: data.manufacture_year,
    };
    this.apiService
      .postRequestedResponse(ApiConstants.initiate_quotes, quotesData)
      .subscribe((res) => {
        this.transactionId = res.transaction_id;
        sessionStorage.setItem('transaction_id', res.transaction_id);
        this.quotesId = res.quote_request_id;
        this.longPollingInfo = this.longPollingService.getAllQuotes(
          this.transactionId,
          this.quotesId
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

            if (parsedQuotesArray.length > 0) {
              this.quotationListing.next(parsedQuotesArray);
            }
            console.log(parsedQuotesArray);
          },
          complete: () => {
            // When the Observable completes, dataArray contains all emitted values
          },
          error: (error: any) => {
            // Handle errors if any
            console.error('Error occurred:', error);
          },
        });
        /**
         * service call for the server side event handling
         */
        // this.sseService
        //   .getServerSentEvent(
        //     `/api/v1/fetch_quotes/${this.transactionId}/${this.quotesId}`
        //   )
        //   .subscribe(
        //     (ev) => {
        //       if (ev.data != 'null') {
        //         let dataEvent = JSON.parse(ev.data);

        //         this.connectionData.push(dataEvent);

        //         this.allQuotes = this.connectionData;

        //         this.quotesValue = this.connectionData;
        //         this.allQuotes = Object.values(
        //           this.quotesValue.reduce(
        //             (
        //               data: any,
        //               obj: {
        //                 insurer_name: any;
        //               }
        //             ) => ({ ...data, [obj.insurer_name]: obj }),
        //             {}
        //           )
        //         );

        //         this.quotationListing.next(this.allQuotes);
        //       }
        //     },
        //     (error) => {
        //       console.log(error);
        //     },
        //     () => {
        //       console.log('==> complete');
        //     }
        //   );
      });
  }
  /**
   *  vehicle popup data send to the quotes api
   */
  vehicleMMVDetails(
    producttype?: any,
    mmvFromData?: any,
    data?: any,
    selectedAddOns?: any
  ) {
    let mmvData;

    mmvData = JSON.parse(mmvFromData);
    let policyExpiryDate;

    let manufactureValue;
    let manufactureMonth;
    let manufactureYear;

    if (
      mmvData.policy_expiry_date != '' &&
      mmvData.policy_expiry_date != null
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

    let mmvValues = {
      rb_mmv_id: mmvData.vehicle_model,
      rto_code: mmvData.registration_city.rb_rto_code,
      registration_date: mmvData.registration_date,
      previous_insurer: mmvData.previous_insurer,
      policy_expire_date: policyExpiryDate,
      manufacture_month: manufactureMonth,
      manufacture_year: manufactureYear,
      ncb_discount: mmvData.ncb_discount,
      user_car: mmvData.user_car,
      previous_claimed: mmvData.previous_claimed,
      selected_addons: selectedAddOns,
    };
    this.getValueWithoutRegistration.next(mmvValues);
    this.getQuotationListing(mmvValues, producttype, data);
  }

  vehicleCardData(fromData: any) {
    this.vehicleCardValue.next(fromData);
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
  createProposalId(flag?: any, formData?: any) {
    this.quoteData = sessionStorage.getItem('quotes_data');
    const proposalId = sessionStorage.getItem('proposal_Id');
    let proposalData: any = {
      transaction_id: sessionStorage.getItem('transaction_id') || '',
      insurer_quote_id: JSON.parse(this.quoteData)['quote_id'] || '',
      insurer_code: JSON.parse(this.quoteData)['insurer_code'] || '',
      proposal_id: proposalId !== undefined ? proposalId : '',
    };
    const ckycIdValue = formData?.get('ckyc_id')?.value;
    const isCkycVerified = ckycIdValue !== 2; // Set to true if ckyc_id is not 2, false if it is 2
    if (flag === 'ckyc') {
      proposalData['ckyc_details'] = {
        full_name: formData?.get('ckyc_full_name')?.value || '',
        dob:
          this.datePipe.transform(
            formData?.get('dob')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
        gender: formData?.get('ckyc_gender')?.value || '',
        document_type: formData?.get('document_type_based_field')?.value || '',
        document_number:
          formData?.get('document_number_based_field')?.value || '',
      };
    }
    if (flag === 'vehicle_owner_detail') {
      proposalData['customer_details'] = {
        full_name: formData?.get('owner_full_Name')?.value || '',
        mobile_number: formData?.get('contact_number')?.value || '',
        email_id: formData?.get('owner_email')?.value || '',
        dob: '18/07/1999',
        occupation_type_id:
          formData?.get('ownner_occupation_type')?.value || '',
        gst_no: formData?.get('owner_gstin')?.value || '',
        additional_mobile_number:
          formData?.get('additional_contact')?.value || '',
        gender: formData?.get('owner_gender')?.value || '',
        marital_status: formData?.get('marital_status')?.value || '',
        salutation: formData?.get('ownner_salutation_type')?.value || '',
        nationality: 'INDIAN',
        communication_address: {
          pincode: formData?.get('owner_pincode')?.value || '',
          rb_city_id: 8 || '',
          rb_state_id: 43 || '',
          address_line:
            formData?.get('owner_communication_addres')?.value || '',
        },
      };
    }
    if (flag === 'nominne_details') {
      proposalData['nominee_details'] = {
        name: formData?.get('nominne_full_Name')?.value,
        age: formData?.get('age')?.value,
        relation_id: formData?.get('nominne_relation')?.value,
      };
    }
    if (flag === 'vehilce_details') {
      proposalData['vehicle_details'] = {};
      proposalData['vehicle_details'].registration_address = {};
      proposalData['vehicle_details'] = {
        registration_no: formData?.get('registration_number')?.value || '',
        engine_no: formData?.get('engine_number')?.value || '',
        chassis_no: formData?.get('chassis_number')?.value || '',
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
        financer_details: {
          financer_name: '' || '',
          agreement_type: formData?.get('agreement_type')?.value || '',
          financer_branch: formData?.get('financer_city')?.value || '',
        },
        is_same_location:
          formData?.get('is_vehicle_address')?.value || ''
            ? formData?.get('is_vehicle_address')?.value || ''
            : 'false',
      };
      if (this.registrationAddressData) {
        proposalData['vehicle_details'].registration_address = {
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
        proposalData['vehicle_details'].registration_address = {
          pincode: formData?.get('vehicle_pincode')?.value || '',
          rb_city_id: 8 || '', // Set to appropriate default value
          rb_state_id: 43 || '', // Set to appropriate default value
          address_line:
            formData?.get('vehicle_registration_address')?.value || '',
        };
      }
    }
    if (flag === 'previous_policy_details') {
      proposalData['previous_policy_details'] = {
        insurer_code: formData?.get('previous_insurer')?.value?.rb_insurer_code,
        policy_no: formData?.get('prev_policy_number')?.value,
        policy_expiry_date:
          this.datePipe.transform(
            formData?.get('policy_expiry_date')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          ) || '',
      };
    }
    this.apiService
      .postRequestedResponse(ApiConstants.create_proposal, proposalData)
      .subscribe((res) => {
        if (res) {
          this.createdProposalId = res;
          sessionStorage.setItem('proposal_Id', res?.proposal_id);
          this.sendProposalData(res);
        }
      });
  }
  shareQuotes(data:any){
    return this.apiService.postRequestedResponse(`${ApiConstants.share_quotes}`, data);
  }
  sendProposalData(data: any) {
    this.getProposalDetails.next(data);
  }
  kycFetched(data: any) {
    this.fetchKycData.next(data);
  }
  ckycFormData(data: any) {
    this.fetchCKycFormData.next(data);
  }
  registrationAddress(data: any) {
    this.registrationAddressData.next(data);
    this.registrationAddressData = data;
  }
  getFetchedCkycData(data: any) {
    this.fetchedCkycData.next(data);
  }
}
