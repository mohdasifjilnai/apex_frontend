import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSuccess: boolean = true;
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
      if (params[4]['path'] == 'payment-success') {
        this.paymentSuccess = true;
      } else {
        this.paymentSuccess = false;
      }

      this.transactionId = params[2]['path'];
    });
    this.route.queryParamMap.subscribe((params) => {
      const policyNo = params?.get('policy_no');
      const proposalNo = params?.get('proposal_no');
      if (policyNo) {
        this.policyNumber = policyNo;
        this.downloadPolicy();
      }
      if (proposalNo) {
        this.proposalNumber = proposalNo;
      }
      if (this.paymentSuccess && proposalNo) {
        this.paymentPendingCase = true;
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

      let withoutVehicleNumber = localStorage.getItem('withoutVehicleNumber');
      if (withoutVehicleNumber) {
        localStorage.removeItem('withoutVehicleNumber');
      }
      if (sessionStorage.getItem('isPayment')) {
        this.router.navigate(['/motor']);
      } else {
        sessionStorage.clear();
      }
    });
  }

  /**
   * redirection form payment page to home page
   */
  goTohome() {
    this.router.navigate(['/motor']);
    sessionStorage.setItem('isPayment', 'true');
  }

  /**
   * redirection form payment failure page  to review page
   */
  retryPayment() {
    this.router.navigate([
      `/motor/quotes/proposal/${this.transactionId}/review`,
    ]);
  }

  downloadPolicy() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.downloadPolicy}?transaction_id=${this.transactionId}`
      )
      .subscribe((res: any) => {
        if (res?.err_code != 1) {
          if (res?.status && res?.document_url) {
            window.open(res?.document_url);
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
      resWidth = '95%';
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
}
