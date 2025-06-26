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
  sortObjectkey: any;
  lowHighSelected = 'low';
  gstValue: any;
  defaultGST = true;
  defaultOwnerSelectedValue: any;
  defaultSortSelectedValue:any;
  constructor(
    public bottomSheetRef: MatBottomSheetRef<QuotesDropdownComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.quotationData = this.sharedDataService.quoteItem;
    this.defaultGST = JSON.parse(sessionStorage.getItem('gstValue') || '{}');
    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      if (this.enableIdvCard) {
        this.enableIdvCard = false;
        this.sortObjectkey = sessionStorage.getItem('sortObjectkey');
        if (this.sortObjectkey) {
          this.lowHighSelected = this.sortObjectkey;
        }
        this.gstValue = sessionStorage.getItem('gstValue');
        this.defaultGST = JSON.parse(this.gstValue);
        this.sortingChange(this.sortObjectkey);
      }
    });
    this.getProposalType();
    this.defaultOwnerSelectedValue = sessionStorage.getItem('proposerType');
    this.defaultSortSelectedValue=sessionStorage.getItem('sortObjectkey')
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  getProposalType() {
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type()}`)
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
      this.proposalList.filter(
        (res: any) => res.proposer_name == event.value
      )[0]['proposer_name']
    );
    if (this.proposalTypeOninit) {
      sessionStorage.setItem(
        'proposerType',
        this.proposalList.filter(
          (res: any) => res.proposer_name == event.value
        )[0]['proposer_name']
      );
      let productTypeValue = sessionStorage.getItem('productType');
      let mmvFormData = sessionStorage.getItem('mmv_data');
      this.registrationNumber = sessionStorage.getItem('registrationNumber');
      this.quotationData = [];
      this.errorQuotationArray = [];
      this.chooseIdvArray = [];
      // if (this.registrationNumber) {
      //   // this.sharedDataService.vehicleMMVDetails(
      //   //   productTypeValue,
      //   //   mmvFormData,
      //   //   'registrationNumber'
      //   // );
        
      // } else {
      //   this.sharedDataService.vehicleMMVDetails(
      //     productTypeValue,
      //     mmvFormData,
      //     'mmvQuotes'
      //   );
      // }
      this.sharedDataService.initiate_Quotes_APi(
        JSON.parse(mmvFormData || '{}')
      );
      this.sharedDataService.addOnsChange(mmvFormData);
      this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
    } else {
      sessionStorage.setItem(
        'proposerType',
        this.proposalList.filter((res: any) => res.proposer_name == event)[0][
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
    if (this.quotationData.length > 0) {
      if (data?.value) {
        sessionStorage.setItem('sortObjectkey', data.value);
        this.bottomSheetRef.dismiss();
      }
      if (this.defaultGST) {
        if (data == 'low' || data?.value == 'low') {
          this.quotationData.sort(
            (a: any, b: any) =>
              a.premium_details.gross_premium - b.premium_details.gross_premium
          );
        } else {
          this.quotationData.sort(
            (a: any, b: any) =>
              b.premium_details.gross_premium - a.premium_details.gross_premium
          );
        }
      } else {
        if (data == 'low' || data?.value == 'low') {
          this.quotationData.sort(
            (a: any, b: any) =>
              a.premium_details.net_premium - b.premium_details.net_premium
          );
        } else {
          this.quotationData.sort(
            (a: any, b: any) =>
              b.premium_details.net_premium - a.premium_details.net_premium
          );
        }
      }
    }
  }
}
