import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ApiConstants } from 'src/app/api.constant';
import { Router } from '@angular/router';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();
  getSelectedvehicle: Subject<any> = new Subject();
  getSelectedVehicleType: Subject<any> = new Subject();
  getRegistrationValue: Subject<any> = new Subject();
  regNumberData: Subject<any> = new Subject();
  quotationListing: Subject<any> = new Subject();
  regNumber: any;
  connectionData: any = [];
  vehicleType: any;
  transactionId: any;
  quotesId: any;
  customerType = 'individual';
  ownershipTransfer = false;
  claimedData = false;
  allQuotes: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sseService: SseService
  ) {
    this.vehicleType = localStorage.getItem('vehicleType');
  }

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
   * registration number base api
   */

  vehicleDetails() {
    this.regNumber = sessionStorage.getItem('registrationNumber');
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.registration_number}?regn_no=${this.regNumber}`
      )
      .subscribe((res: any) => {
        if (res) {
          this.regNumberData.next(res);
          this.getQuotationListing(res);
          this.router.navigate(['/motor/quotes']);
        }
      });
  }

  getQuotationListing(data: any) {
    let registrationValue = new Date(data.registration_date);
    let registrationMonth = registrationValue.getMonth() + 1;
    let registrationYear = registrationValue.getFullYear();

    let quotesData = {
      // customer_type: this.customerType,
      // vehicle_type: "four_wheeler",
      // rb_mmv_id: 1219,
      // rb_rto_code: data.rto_code,
      // registration_month: registrationMonth,
      // registration_year: registrationYear,
      // previous_insurer_code: '',
      // previous_policy_exp_date: data.policy_expire_date,
      // previous_year_ncb: 0,
      // is_ownership_transfer: this.ownershipTransfer,
      // is_claimed: this.claimedData,
      // business_type: 'New',
      // selected_addons: [],

      customer_type: 'INDIVIDUAL',
      vehicle_type: 'four_wheeler',
      rb_mmv_id: 1219,
      rb_rto_code: 'HR26',
      registration_month: 1,
      registration_year: 2024,
      previous_policy_exp_date: '2024-02-09',
      previous_year_ncb: 0,
      is_ownership_transfer: false,
      is_claimed: false,
      business_type: 'New',
      selected_addons: ['string'],
    };

    this.apiService
      .postRequestedResponse(ApiConstants.initiate_quotes, quotesData)
      .subscribe((res) => {
        this.transactionId = res.transaction_id;
        this.quotesId = res.quote_request_id;
        /**
         * service call for the server side event handling
         */
        // let data = {"premium_details": {"od_premium_details": {"basic_od_premium": 9310.0, "ncb_discount": 0.0}, "tp_premium_details": {"basic_tp_premium": 10640.0}, "total_gst": 3749.0, "gross_premium": 20825.0, "total_premium": 24574.0}, "error_message": null, "insurer_logo": "https://rbdev-apex.s3.ap-south-1.amazonaws.com/insurer/ICICI-logo.svg", "insurer_name": "ICICI Lombard General Insurance", "transaction_id": "21706c29-b30a-4936-b6a2-33cc4a3ddc50", "quote_request_id": "109088935"}

        this.sseService
          .getServerSentEvent(
            `/api/v1/fetch_quotes/${this.transactionId}/${this.quotesId}`
          )
          .subscribe(
            (ev) => {
              let dataEvent = JSON.parse(ev.data);
              this.allQuotes = dataEvent;
              this.connectionData = [];

              this.connectionData.push(dataEvent);
              this.quotationListing.next(this.connectionData);
            },
            (error) => {
              console.log(error);
            },
            () => {
              console.log('==> complete');
            }
          );
      });
  }
}
