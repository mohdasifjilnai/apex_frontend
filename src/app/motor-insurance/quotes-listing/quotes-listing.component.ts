import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import initiate_quotes_payload from './initiate_quotes_payload.json';
import {ApiConstants} from '../../api.constant'
import { ApiService } from 'src/app/core/services/api.service';
import {PremiumBreakupComponent} from '../../shared/components/dialog-components/premium-breakup/premium-breakup.component'
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  initiateQuotes:any;
  constructor(private router : Router,private apiService:ApiService,public matDialog: MatDialog ) {
    this.postListInitiateQuotes(initiate_quotes_payload)
  }


  noQuotesInformation:any;
  
  ngOnInit(): void {}

  getProposalDetails() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
  /**
   * this function is used for the no quotes information details
   */
  noQuotes(){
    this.noQuotesInformation = !this.noQuotesInformation
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

    /**
     * Open premium breakup modal
     */ 
     openPremiumBreakupModal(initiateQuotes:any,event: MouseEvent){
      console.log(initiateQuotes,'initiateQuotes');
      
      this.matDialog.open(PremiumBreakupComponent, {
        panelClass:'initiate-quotes-class',
        data: {
          initiateQuotes
        },
        position: {
          top: `${event.clientY}px`,
          left: `${event.clientX}px`
        }
      });
     }
  
}
