import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-quotes-dropdown',
  templateUrl: './quotes-dropdown.component.html',
  styleUrls: ['./quotes-dropdown.component.scss'],
})
export class QuotesDropdownComponent implements OnInit {
  proposalList: any;
  quotationData: any;
  quotationArray = [];
  errorQuotationArray: any;
  registrationNumber: any;
  chooseIdvArray: any;
  proposalTypeOninit = true;
  enableIdvCard: boolean = true;
  constructor(
    public bottomSheetRef: MatBottomSheetRef<QuotesDropdownComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.getProposalType();
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  getProposalType() {
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type}`)
      .subscribe((res: any) => {
        if (res) {
          this.proposalList = res;
        }
      });
  }
  /**
   * get proposer type in proposal list
   */
  changeProposalType(event: any) {
    this.bottomSheetRef.dismiss(
      this.proposalList.filter((res: any) => res.proposer_id == event.value)[0][
        'proposer_name'
      ]
    );
    if (this.proposalTypeOninit) {
      sessionStorage.setItem(
        'proposerType',
        this.proposalList.filter(
          (res: any) => res.proposer_id == event.value
        )[0]['proposer_name']
      );
      let productTypeValue = sessionStorage.getItem('productType');
      let mmvFormData = sessionStorage.getItem('mmv_data');
      this.registrationNumber = sessionStorage.getItem('registrationNumber');
      this.quotationData = [];
      this.errorQuotationArray = [];
      this.chooseIdvArray = [];
      if (this.registrationNumber) {
        this.sharedDataService.vehicleMMVDetails(
          productTypeValue,
          mmvFormData,
          'registrationNumber'
        );
      } else {
        this.sharedDataService.vehicleMMVDetails(
          productTypeValue,
          mmvFormData,
          'mmvQuotes'
        );
      }
      this.sharedDataService.addOnsChange(mmvFormData);
      this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
    } else {
      sessionStorage.setItem(
        'proposerType',
        this.proposalList.filter((res: any) => res.proposer_id == event)[0][
          'proposer_name'
        ]
      );
      this.proposalTypeOninit = false;
    }
  }
  /**
   * Function used for Sorting in responsive
   *
   */
  sortingChange(data: any) {
    if (data?.value) {
      sessionStorage.setItem('sortObjectkey', data.value);
      this.bottomSheetRef.dismiss();
      data.preventDefault();
    }
  }
}
