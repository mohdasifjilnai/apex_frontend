import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import initiate_quotes_payload from './initiate_quotes_payload.json';
import { ApiConstants } from '../../api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { PremiumBreakupComponent } from '../../shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  initiateQuotes:any;
  showComprehensiveDiv = true;
  individualSelected = 'Individual';
  lowHighSelected = 'low';
  initiateQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: PremiumBreakupComponent,
    widthObtained: '75%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: false,
    classObtained: 'initiate-quotes-class',
  };
  constructor(private router : Router,private apiService:ApiService,public matDialog: WindowRef ) {
    this.postListInitiateQuotes(initiate_quotes_payload)
  }

  noQuotesInformation: any;

  ngOnInit(): void {}

  getProposalDetails() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
  /**
   * this function is used for the no quotes information details
   */
  noQuotes() {
    this.noQuotesInformation = !this.noQuotesInformation;
  }
  /**
   * get initiate quotes list
   */

     postListInitiateQuotes(data:any) {
        this.apiService.postRequestedResponse(ApiConstants.initiate_quotes,data).subscribe((res:any)=>{
          this.initiateQuotes=res;
          console.log(res,'res')
        })
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
     openPremiumBreakupModal(initiateQuotes:any,event: MouseEvent){  
      this.openPremiumBreakup(initiateQuotes)    
     }
     /**
   * this fucntion use vehicle premium breakup modal
   */ 
     openPremiumBreakup(ObjData: any) {
      let resWidth;
      let resTop;
      if (window.screen.width <= 767) {
        resWidth = '95%';
        resTop = '5%';
      } else {
        resWidth = '75%';
        resTop = '5%';
      }
  
      const obj: any = {
        modalName: this.initiateQuotesJSON['modalName'],
        width: this.initiateQuotesJSON['widthObtained'],
        height: this.initiateQuotesJSON['heightObtained'],
        classNameObtained: this.initiateQuotesJSON['classObtained'],
        isOutSideClose: this.initiateQuotesJSON['isOutSideClose'],
        minWidth: resWidth,
        dataInfo: {
          data: ObjData,
          top: resTop,
        },
      };
  
      this.matDialog.openDialog(obj);
    }
  
}
