import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import initiate_quotes_payload from './initiate_quotes_payload.json';
import { ApiConstants } from '../../api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { PremiumBreakupComponent } from '../../shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';

import { ChooseIDVComponent } from '../choose-idv/choose-idv.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOnsComponent } from '../add-ons/add-ons.component';
import { QuotesDropdownComponent } from '../quotes-dropdown/quotes-dropdown.component';
import {ShareQuotesComponent} from '../../shared/components/dialog-components/share-quotes/share-quotes.component'
import { SharedDataService } from 'src/app/core/services/shared-data.service';
@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  initiateQuotes: any;
  showComprehensiveDiv = true;
  individualSelected: any;
  lowHighSelected = 'low';
  proposalList: any;
  quotationData:any ;
  initiateQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: PremiumBreakupComponent,
    widthObtained: '500px',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: false,
    classObtained: 'initiate-quotes-class',
  };
  shareQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ShareQuotesComponent,
    widthObtained: '100%',
    heightObtained: '77%',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  knowMoreText: string='Know More';
  constructor(
    private router: Router,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService,
  ) {
    this.postListInitiateQuotes(initiate_quotes_payload);
  }

  quotesListing: FormGroup = new FormGroup({
    proposalType: new FormControl('', Validators.required),
  });
  noQuotesInformation: any;

  ngOnInit(): void {
    this.getProposalType();
    this.sharedDataService.quotationListing.subscribe((quotes) => {
     
      this.quotationData = quotes;
   
    });
  }

  getProposalType() {
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type}`)
      .subscribe((res: any) => {
        if (res) {
          this.proposalList = res;
          this.quotesListing.patchValue({
            proposalType: 1,
          });
        }
      });
  }
  getProposalDetails() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
  /**
   * this function is used for the no quotes information details
   */
  noQuotes(text:any) {
    if(text=='View Less'){
      this.knowMoreText='Know More'
    }else{
      this.knowMoreText='View Less'
    }
    this.noQuotesInformation = !this.noQuotesInformation;
  }
  openChangeIDV(): void {
    this.bottomSheet.open(ChooseIDVComponent);
  }
  openAddons(): void {
    this.bottomSheet.open(AddOnsComponent);
  }
  openSort(dropdownType: any): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: dropdownType, // Pass your data here
    };
    this.bottomSheet.open(QuotesDropdownComponent, bottomSheetConfig);
  }
  /**
   * get initiate quotes list
   */

  postListInitiateQuotes(data: any) {
    // this.apiService.postRequestedResponse(ApiConstants.initiate_quotes,data).subscribe((res:any)=>{
    //   this.initiateQuotes=res;
    //   console.log(res,'res')
    // })
  }

  onComprehensiveTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      this.showComprehensiveDiv = false;
    } else {
      this.showComprehensiveDiv = true;
    }
  }

  /**
   * Open premium breakup modal
   */
  openPremiumBreakupModal(initiateQuotes: any, event: MouseEvent): void {
    // this.openPremiumBreakup(initiateQuotes);
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: initiateQuotes, // Pass your data here
    };
    if (window.innerWidth <= 768) {
      this.bottomSheet.open(PremiumBreakupComponent);
    } else {
      this.openModal(initiateQuotes,this.initiateQuotesJSON);
    }
  }

  shareQuotesOpen(shareData:any,jsonData:any){
    this.openModal(shareData,jsonData)
  }


  /**
   * this fucntion use open pop up modal
   */
   openModal(ObjData: any,jsonData:any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '100%';
      resTop = '0';
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
  /**
   * get proposer type in proposal list
   */ 
  getProposarType(event:any){
    localStorage.setItem('proposerType',this.proposalList.filter((res:any)=>res.proposer_id==event)[0]['proposer_name'])
  }
}
