import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {environment} from 'src/environments/environment'
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.scss'],
})
export class ShareQuotesComponent implements OnInit {
  shareQuotationForm!: FormGroup;
  quotes_id: any[]=[];
  successMessage: boolean=false;
  quotesData: any;
  partner_name: any;
  constructor(
    public dialogRef: MatDialogRef<ShareQuotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public bottomSheetRef: MatBottomSheetRef<ShareQuotesComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    public sharedDataService:SharedDataService
  ) {
    this.shareQuotationForm = this.formBuilder.group({
      whatsApp_number: ['',[Validators.pattern(/^[6-9]\d{9}$/)]],
      contact_number: ['',[Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['',[Validators.email]],
    });
    
  }

  ngOnInit(): void {
    this.partner_name=localStorage.getItem('ta_user_name')
    if(Object.keys(this.bottomSheetdata).length>0){
      this.quotesData=this.bottomSheetdata
    }
    else{
      this.quotesData=this.data?.data
    }
    for (let value of this.quotesData){
      this.quotes_id.push(value?.quote_id)
    }
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    } 
  }
  /**
     * Share Quotes Api Integration
     */
  shareQuotes() {
    this.sharedDataService
    .shareQuotes(this.quotesData,"quote",this.partner_name,'motor/quotes',this.shareQuotationForm.get('email')?.value,this.shareQuotationForm.get('contact_number')?.value,this.quotes_id)
    .subscribe((res) => {
      if(res?.message=='Success'){
        this.successMessage=true  
        setTimeout(() => {
          this.successMessage = false;
        }, 5000);
        this.shareQuotationForm.reset();
      }
    });
  }
}
