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
    widthObtained: '100%',
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
    widthObtained: '100%',
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
    this.generateProposal();
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    let productTypeValue = sessionStorage.getItem('productType');
    if (productTypeValue === 'saod') {
      this.isTpDetailsDisabled = true;
    }
    this.router.queryParams.subscribe((params) => {
      this.proposalParam = params['proposal'] === 'true';
      if (this.proposalParam) {
        this.getInsurerCode();
      } else {
        console.log('Proposal is false or not provided');
      }
    });
  }
  navigateToUrl(titleName: string) {
    this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
    this.shareData.sendProposalReviewEditId(titleName);
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
      resWidth = '100%';
      resTop = '5%';
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
  generateProposal() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_proposal}/?insurer_code=${this.quoteData['insurer_code']}&transaction_id=${this.quoteData?.transaction_id}`
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
  updateCheckBoxState(checked: boolean) {
    this.isAcknowledged = checked;
  }
  getInsurerCode() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${sessionStorage.getItem(
          'transaction_id'
        )}/${this.quoteData?.quote_id}`
      )
      .subscribe((response) => {
        if (response) {
          // this.generateProposal(response?.insurer_code);
        }
        // this.agreementList = response;
      });
  }
}
