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
  quotesValue: any;

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
      customer_type: this.customerType,
      vehicle_type: this.vehicleType,
      rb_mmv_id: 1219,
      rb_rto_code: data.rto_code,
      registration_month: 1,
      registration_year: 2024,
      previous_insurer_code: '',
      previous_policy_exp_date: data.policy_expire_date,
      previous_year_ncb: 0,
      is_ownership_transfer: this.ownershipTransfer,
      is_claimed: this.claimedData,
      business_type: 'New',
      selected_addons: [],
    };

    this.apiService
      .postRequestedResponse(ApiConstants.initiate_quotes, quotesData)
      .subscribe((res) => {
        this.transactionId = res.transaction_id;
        this.quotesId = res.quote_request_id;
        /**
         * service call for the server side event handling
         */
        this.sseService
          .getServerSentEvent(
            `/api/v1/fetch_quotes/${this.transactionId}/${this.quotesId}`
          )
          .subscribe(
            (ev) => {
              let dataEvent = JSON.parse(ev.data);

              this.connectionData.push(dataEvent);

              this.allQuotes = this.connectionData;

              this.quotesValue = this.connectionData;
              this.allQuotes = Object.values(
                this.quotesValue.reduce(
                  (
                    data: any,
                    obj: {
                      insurer_name: any;
                    }
                  ) => ({ ...data, [obj.insurer_name]: obj }),
                  {}
                )
              );
           
              this.quotationListing.next(this.allQuotes);
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
