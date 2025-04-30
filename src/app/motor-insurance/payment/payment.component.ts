import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
declare const webengage: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSuccess: boolean = true;
  partner_code: any;
  is_cse: any;
  employee_code: any;
  premiumDetails: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private matDialog: WindowRef,
    private sharedService: SharedDataService
  ) {}
  policyNumber: any;
  proposalNumber: any;
  transactionId: any;
  paymentPendingCase: any;
  isExistCustomerId: any;
  failureJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: FailureDialogComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };
  ngOnInit(): void {
    this.route.url.subscribe((params) => {
      this.transactionId = params[2]['path'];
      if (params[4]['path'] == 'payment-success') {
        this.paymentSuccess = true;
        this.getTransactionPremiumDetails(
          this.transactionId,
          this.paymentSuccess,
          ''
        );
      } else {
        this.paymentSuccess = false;
        this.getTransactionPremiumDetails(
          this.transactionId,
          this.paymentSuccess,
          ''
        );
      }

      if (window.screen.width <= 999) {
        this.getPartnerCode(this.transactionId);
      }
    });
    this.downloadPolicy();
    this.route.queryParamMap.subscribe((params) => {
      const policyNo = params?.get('policy_no');
      const proposalNo = params?.get('proposal_no');
      if (policyNo) {
        this.policyNumber = policyNo;
      }
      if (proposalNo) {
        this.proposalNumber = proposalNo;
      }
      if (this.paymentSuccess && proposalNo) {
        this.paymentPendingCase = true;
        this.getTransactionPremiumDetails(
          this.transactionId,
          '',
          'Payment Deducted'
        );
      }
      // let regnNumberValue = sessionStorage.getItem('isRegistrationNumber');
      // if (regnNumberValue) {
      //   sessionStorage.removeItem('isRegistrationNumber');
      // }
      // let selectedAddons = sessionStorage.getItem('selectedAddons');
      // if (selectedAddons) {
      //   sessionStorage.removeItem('selectedAddons');
      // }
      // let vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
      // if (vehicleMMVData) {
      //   sessionStorage.removeItem('vehicleMMVData');
      // }
      // let vehiclePopup = sessionStorage.getItem('vehiclePopup');
      // if (vehiclePopup) {
      //   sessionStorage.removeItem('vehiclePopup');
      // }
      // let vehicleMMV = sessionStorage.getItem('mmv_data');
      // if (vehicleMMV) {
      //   sessionStorage.removeItem('mmv_data');
      // }

      // let newVehicleType = sessionStorage.getItem('newVehicleType');
      // if (newVehicleType) {
      //   sessionStorage.removeItem('newVehicleType');
      // }

      // let planType = sessionStorage.getItem('planType');
      // if (planType) {
      //   sessionStorage.removeItem('planType');
      // }

      // let transaction_id = sessionStorage.getItem('transaction_id');
      // if (transaction_id) {
      //   sessionStorage.removeItem('transaction_id');
      // }

      // let idvData = sessionStorage.getItem('idvData');
      // if (idvData) {
      //   sessionStorage.removeItem('idvData');
      // }

      // let productTypeValue = sessionStorage.getItem('productType');
      // if (productTypeValue) {
      //   sessionStorage.removeItem('productType');
      // }

      // let proposalTypeData = sessionStorage.getItem('proposerType');
      // if (proposalTypeData) {
      //   sessionStorage.removeItem('proposerType');
      // }
      // let proposalParam = sessionStorage.getItem('proposal_param');
      // if (proposalParam) {
      //   sessionStorage.removeItem('proposal_param');
      // }
      // let proposalId = sessionStorage.getItem('proposal_Id');
      // if (proposalId) {
      //   sessionStorage.removeItem('proposal_Id');
      // }
      // let breakIn = sessionStorage.getItem('breakIn');
      // if (breakIn) {
      //   sessionStorage.removeItem('breakIn');
      // }
      // let quote_data = sessionStorage.getItem('quotes_data');
      // if (quote_data) {
      //   sessionStorage.removeItem('quotes_data');
      // }
      // let insurerCode = sessionStorage.getItem('insurer_code');
      // if (insurerCode) {
      //   sessionStorage.removeItem('insurer_code');
      // }
      // let kycData = sessionStorage.getItem('kycData');
      // if (kycData) {
      //   sessionStorage.removeItem('kycData');
      // }

      let withoutVehicleNumber = sessionStorage.getItem('withoutVehicleNumber');
      if (withoutVehicleNumber) {
        sessionStorage.removeItem('withoutVehicleNumber');
      }
      if (sessionStorage.getItem('isPayment')) {
        this.router.navigate(['']);
      } else {
        this.clearSessionStorageExcept([
          'token',
          'partner_code',
          'first_name',
          'middle_name',
          'last_name',
          'partnerCodeTraceId',
          'is_cse',
          'pos_status',
          'employee_code',
        ]);
      }
    });
  }
  /**
   * redirection form payment page to home page
   */
  goTohome() {
    this.router.navigate(['']);
    sessionStorage.setItem('isPayment', 'true');
  }

  /**
   * redirection form payment failure page  to review page
   */
  retryPayment() {
    this.router.navigate([`quotes/proposal/${this.transactionId}/review`]);
  }

  downloadPolicy() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.downloadPolicy}?transaction_id=${this.transactionId}`
      )
      .subscribe((res: any) => {
        if (res?.err_code != 1) {
          this.policyNumber = res?.policy_no;
          if (res?.status && res?.document_url) {
            window.open(res?.document_url);
            this.policyNumber = res?.policy_no;
            if (this.policyNumber != null) {
              this.paymentPendingCase = false;
              this.router.navigate([
                `quotes/proposal/${this.transactionId}/review/payment-success`,
              ]);
            } else {
              this.paymentPendingCase = true;
            }
          } else {
            this.sharedService.openSnackBar(res?.error_message, true, 3000);
          }
        } else {
          this.sharedService.openSnackBar(res?.error_message, true, 3000);
          // this.openFailurePopup(res);
        }
      });
  }

  openFailurePopup(objData: any) {
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
      modalName: this.failureJSON['modalName'],
      width: this.failureJSON['widthObtained'],
      height: this.failureJSON['heightObtained'],
      classNameObtained: this.failureJSON['classObtained'],
      isOutSideClose: this.failureJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  clearSessionStorageExcept(keysToKeep: string[]): void {
    const preservedData: { [key: string]: string | null } = {};

    // Step 1: Store values of keys to keep
    keysToKeep.forEach((key) => {
      preservedData[key] = sessionStorage.getItem(key);
    });

    // Step 2: Clear the sessionStorage
    sessionStorage.clear();

    // Step 3: Restore preserved keys
    Object.entries(preservedData).forEach(([key, value]) => {
      if (value !== null) {
        sessionStorage.setItem(key, value);
      }
    });
  }
  getPartnerCode(transaction_id: any) {
    let apiUrl;
    apiUrl = `?transaction_id=${transaction_id}`;
    this.apiService
      .getRequestedResponse(`${ApiConstants.fetch_partner_code}${apiUrl}`)
      .subscribe((res: any) => {
        this.partner_code = res?.partner_code;
        this.employee_code = res?.employee_code;
        if (res?.partner_code != null) {
          sessionStorage.setItem('partner_code', res?.partner_code);
        }
        if (res?.employee_code != null) {
          sessionStorage.setItem('employee_code', res?.employee_code);
        }
      });
  }
  getTransactionPremiumDetails(
    transaction_id: any,
    paymentStatus: any,
    status?: any
  ) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.transaction_premium_details}${transaction_id}`
      )
      .subscribe((res: any) => {
        this.premiumDetails = res;
        const vehcileType = sessionStorage.getItem('vehicleType');
        this.isExistCustomerId = sessionStorage.getItem('webengageCustomerId');
        let CheckId = JSON.parse(this.isExistCustomerId);
        if (paymentStatus) {
          let paymentData = {
            Status: 'Payment Successful',
            Customer_id: CheckId.customer_id,
            Perform_by: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
            Partner_Name:
              sessionStorage.getItem('first_name') != null
                ? `${sessionStorage.getItem(
                    'first_name'
                  )} ${sessionStorage.getItem(
                    'middle_name'
                  )} ${sessionStorage.getItem('last_name')}`
                : '',
            Partner_id: sessionStorage.getItem('partner_code'),
            Total_IDV: this.premiumDetails.idv,
            Total_Premium: this.premiumDetails.gross_premium,
            'Total_Own_Damage_(A)':
              this.premiumDetails.od_premium_details.total_od_premium != 0
                ? this.premiumDetails.od_premium_details.total_od_premium
                : 0,
            NCB_Discount:
              this.premiumDetails.od_premium_details.ncb_discount < 0
                ? -this.premiumDetails.od_premium_details.ncb_discount
                : this.premiumDetails.od_premium_details.ncb_discount,
            'Third_Party_(B)':
              this.premiumDetails.tp_premium_details.total_tp_premium != 0
                ? this.premiumDetails.tp_premium_details.total_tp_premium
                : 0,
            // // Selected_Addons
            Total_Addons: this.premiumDetails?.is_addon_addition,
            'GST_(18%)_(C)':
              this.premiumDetails.total_gst != 0
                ? this.premiumDetails.total_gst
                : 0,
            'Total_Premium_(A+B+C)':
              this.premiumDetails.gross_premium != 0
                ? this.premiumDetails.gross_premium
                : 0,
            IDV: this.premiumDetails.gross_premium,
            Insurer_Name: this.premiumDetails.insurer_name,
            Insurer_Logo: this.premiumDetails.insurer_logo,
            Motor_Type: vehcileType,
            User_Type: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
          };
          webengage.track('Motor_Payment_Status', paymentData);
          webengage.track('Motor_Plan_Purchased_Successful', paymentData);
        } else if (!paymentStatus) {
          let paymentData = {
            Status: 'Payment Faliure',
            Customer_id: CheckId.customer_id,
            Perform_by: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
            Partner_Name:
              sessionStorage.getItem('first_name') != null
                ? `${sessionStorage.getItem(
                    'first_name'
                  )} ${sessionStorage.getItem(
                    'middle_name'
                  )} ${sessionStorage.getItem('last_name')}`
                : '',
            Partner_id: sessionStorage.getItem('partner_code'),
            Total_IDV: this.premiumDetails.idv,
            Total_Premium: this.premiumDetails.gross_premium,
            'Total_Own_Damage_(A)':
              this.premiumDetails.od_premium_details.total_od_premium != 0
                ? this.premiumDetails.od_premium_details.total_od_premium
                : 0,
            NCB_Discount:
              this.premiumDetails.od_premium_details.ncb_discount < 0
                ? -this.premiumDetails.od_premium_details.ncb_discount
                : this.premiumDetails.od_premium_details.ncb_discount,
            'Third_Party_(B)':
              this.premiumDetails.tp_premium_details.total_tp_premium != 0
                ? this.premiumDetails.tp_premium_details.total_tp_premium
                : 0,
            // // Selected_Addons
            Total_Addons: this.premiumDetails?.is_addon_addition,
            'GST_(18%)_(C)':
              this.premiumDetails.total_gst != 0
                ? this.premiumDetails.total_gst
                : 0,
            'Total_Premium_(A+B+C)':
              this.premiumDetails.gross_premium != 0
                ? this.premiumDetails.gross_premium
                : 0,
            IDV: this.premiumDetails.gross_premium,
            Insurer_Name: this.premiumDetails.insurer_name,
            Insurer_Logo: this.premiumDetails.insurer_logo,
            Motor_Type: vehcileType,
            User_Type: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
          };
          webengage.track('Motor_Payment_Status', paymentData);
          webengage.track('Motor_Plan_Purchased_Successful', paymentData);
        }
        if (status == 'Payment Deducted') {
          let paymentData = {
            Status: 'Payment Deducted',
            Customer_id: CheckId.customer_id,
            Perform_by: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
            Partner_Name:
              sessionStorage.getItem('first_name') != null
                ? `${sessionStorage.getItem(
                    'first_name'
                  )} ${sessionStorage.getItem(
                    'middle_name'
                  )} ${sessionStorage.getItem('last_name')}`
                : '',
            Partner_id: sessionStorage.getItem('partner_code'),
            Total_IDV: this.premiumDetails.idv,
            Total_Premium: this.premiumDetails.gross_premium,
            'Total_Own_Damage_(A)':
              this.premiumDetails.od_premium_details.total_od_premium != 0
                ? this.premiumDetails.od_premium_details.total_od_premium
                : 0,
            NCB_Discount:
              this.premiumDetails.od_premium_details.ncb_discount < 0
                ? -this.premiumDetails.od_premium_details.ncb_discount
                : this.premiumDetails.od_premium_details.ncb_discount,
            'Third_Party_(B)':
              this.premiumDetails.tp_premium_details.total_tp_premium != 0
                ? this.premiumDetails.tp_premium_details.total_tp_premium
                : 0,
            // // Selected_Addons
            Total_Addons: this.premiumDetails?.is_addon_addition,
            'GST_(18%)_(C)':
              this.premiumDetails.total_gst != 0
                ? this.premiumDetails.total_gst
                : 0,
            'Total_Premium_(A+B+C)':
              this.premiumDetails.gross_premium != 0
                ? this.premiumDetails.gross_premium
                : 0,
            IDV: this.premiumDetails.gross_premium,
            Insurer_Name: this.premiumDetails.insurer_name,
            Insurer_Logo: this.premiumDetails.insurer_logo,
            Motor_Type: vehcileType,
            User_Type: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
          };
          webengage.track('Motor_Payment_Status', paymentData);
          webengage.track('Motor_Plan_Purchased_Successful', paymentData);
        }
      });
  }
}
