import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { OtpComponent } from 'src/app/shared/components/dialog-components/otp/otp.component';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';
import { ProposalShareComponent } from 'src/app/shared/components/proposal-share/proposal-share.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-proposal-review',
  templateUrl: './proposal-review.component.html',
  styleUrls: ['./proposal-review.component.scss'],
})
export class ProposalReviewComponent implements OnInit {
  insuranceDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ProposalShareComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'insurance-details-class',
  };
  termsAndConditionJson: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: TermsComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'terms-class',
  };
  quoteData: any;
  generateProposalData: any;
  transactionId: any;
  vehicleType: any;
  isTpDetailsDisabled: boolean = false;
  isAcknowledged: boolean = false;
  proposalParam: any;
  proposalId: any;
  proposalData: any;

  constructor(
    private route: Router,
    private shareData: SharedDataService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    let productTypeValue = sessionStorage.getItem('productType');
    if (
      this.quoteData?.is_breakin ||
      productTypeValue === 'saod' ||
      (this.quoteData?.is_breakin && productTypeValue === 'comprehensive')
    ) {
      this.isTpDetailsDisabled = true;
    }
    this.router.queryParams.subscribe((params) => {
      this.proposalParam = params['proposal'] === 'true';
      sessionStorage.setItem(
        'proposal_param',
        JSON.stringify(this.proposalParam)
      );
      if (this.proposalParam) {
        this.router.url.subscribe((segments) => {
          const urlSegments = segments.map((segment) => segment.path);
          this.proposalId = urlSegments[urlSegments.length - 2];
          this.generateProposal(this.proposalId);
        });
      } else {
        this.generateProposal();
      }
    });
    this.getInsurerDetailsOnRedirection();
  }
  navigateToUrl(titleName: string) {
    if (this.proposalData) {
      this.route.navigate([
        `/motor/quotes/proposal/${this.proposalData?.quote_response?.transaction_id}`,
      ]);
    } else {
      this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
      this.shareData.sendProposalReviewEditId(titleName);
    }
  }
  back() {
    this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
  }
  submitReview() {
    this.openModal([this.quoteData], this.insuranceDetailsJSON);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '1%';
    }
    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };
    this.matDialog.openDialog(obj);
  }
  openDialog(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(TermsComponent);
    } else {
      this.openModal('', this.termsAndConditionJson);
    }
  }
  generateProposal(transactionId?: any) {
    if (transactionId) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.get_proposal}/?transaction_id=${transactionId}`
        )
        .subscribe((res) => {
          this.generateProposalData = res;
          sessionStorage.setItem(
            'proposal_Id',
            JSON.stringify(this.generateProposalData?.proposal_id)
          );
          const dataToSend = [
            res?.previous_policy_details, //Previous Policy Details
            res?.proposal_number, //Proposal Number
            res, //Proposal Details
            this.quoteData, //Quotes Details Data
          ];
          this.shareData.setPreviousPolicyDetails(dataToSend);
          this.shareData?.setRedirectDataForInsurer(res);
          if (res) {
            this.getInsurerCode(
              this.generateProposalData?.transaction_id,
              this.generateProposalData?.insurer_quote_id
            );
          }
        });
    } else {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.get_proposal}/?transaction_id=${this.quoteData?.transaction_id}`
        )
        .subscribe((res) => {
          this.generateProposalData = res;
          const dataToSend = [
            res?.previous_policy_details, //Previous Policy Details
            res?.proposal_number, //Proposal Number
            res, //Proposal Details
            this.quoteData, //Quotes Details Data
          ];
          this.shareData.setPreviousPolicyDetails(dataToSend);
        });
    }
  }
  updateCheckBoxState(checked: boolean) {
    this.isAcknowledged = checked;
  }
  getInsurerCode(transaction_id: any, insurer_quote_id: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${transaction_id}/${insurer_quote_id}`
      )
      .subscribe((response) => {
        if (response) {
          this.shareData.getInsurerDetail(response);
        }
      });
  }
  /**
   * Subscribes to the insurer details observable and stores the data in the component's state.
   * This function is used to retrieve the insurer details from the backend and store them in the component's state.
   * The insurer details are retrieved by subscribing to the insurer details observable and storing the data in the component's state.
   **/
  getInsurerDetailsOnRedirection() {
    this.shareData.insurerDetails?.subscribe((res) => {
      this.proposalData = res;

      const transactionId = this.proposalData?.quote_response?.transaction_id;
      if (transactionId) {
        sessionStorage.setItem('transaction_id', transactionId);
      }

      const quoteResponseToStore = this.proposalData?.quote_response;
      if (quoteResponseToStore) {
        sessionStorage.setItem(
          'quotes_data',
          JSON.stringify(quoteResponseToStore)
        );
      }

      const newVehicleType = this.proposalData?.quote_request?.business_type;
      if (newVehicleType) {
        sessionStorage.setItem('newVehicleType', newVehicleType);
      }

      const proposerType = this.proposalData?.quote_request?.customer_type;
      if (proposerType) {
        sessionStorage.setItem('proposerType', proposerType);
      }

      const productType = this.proposalData?.quote_request?.product_type;
      if (productType) {
        sessionStorage.setItem('productType', productType);
      }
    });
  }
}
