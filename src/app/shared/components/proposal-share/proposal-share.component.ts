import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proposal-share',
  templateUrl: './proposal-share.component.html',
  styleUrls: ['./proposal-share.component.scss']
})
export class ProposalShareComponent implements OnInit {
  isCommunicationGroup: boolean = true;
  isCommunicationField: boolean = false;
  isActiveIcon: any;
  inputPlaceholder: any;
  shareQuotationForm!: FormGroup;
  quotes_id: any[]=[];
  successMessage: boolean=false;
  formControlName: any;
  partner_name: any;
  message: any;
  failureMessage: boolean=false;
  gstToggleData: any;
  currentDate: Date = new Date();
  startDate: any;
  previousPolicyDetails: any;
  proposalNumber: any;
  constructor(public dialogRef: MatDialogRef<ProposalShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedDataService:SharedDataService,
    private formBuilder: FormBuilder,
    private apiService: ApiService) {
      this.shareQuotationForm = this.formBuilder.group({
        whatsApp_number: ['',[Validators.pattern(/^[6-9]\d{9}$/)]],
        contact_number: ['',[Validators.pattern(/^[6-9]\d{9}$/)]],
        email: ['',[Validators.pattern(/^.+@.+[.].+$/)]],
      });
     }

    ngOnInit(): void {
      this.partner_name=localStorage.getItem('ta_user_name')
      for (let value of this.data?.data){
        this.quotes_id.push(value?.quote_id)
      }
      let gstValue = sessionStorage.getItem('gstValue');
      if (gstValue) {
        this.gstToggleData = JSON.parse(gstValue);
      }
      this.sharedDataService.previousPolicyDetails$.subscribe(details => {
        this.previousPolicyDetails = details[0];
        this.proposalNumber=details[1];
      });
      if(this.previousPolicyDetails==null){
        this.startDate=this.currentDate
      }
    }
    /**
     * this fucntion use for close pop up
     */
    onClose(): void {
      this.dialogRef.close();
    }
    /**
     * this fucntion use for share inspection
     */
    share() {
      this.isCommunicationGroup = false;
    }
    /**
     * this fucntion use for share inspection by social media
     */
    communication(event: any) {
      this.isActiveIcon=event
      this.isCommunicationField = true;    
    }
    /**
     * Share Quotes Api Integration
     */
    shareQuotes() {
      this.sharedDataService
    .shareQuotes(this.data?.data,"proposal",this.partner_name,`motor/quotes/proposal/${this.data?.data[0]?.transaction_id}`,this.shareQuotationForm.get('email')?.value,this.shareQuotationForm.get('contact_number')?.value,this.quotes_id)
        .subscribe((res) => {
          if(res?.message=='Success'){
            this.successMessage=true
            setTimeout(() => {
              this.successMessage = false;
            }, 5000);
            this.shareQuotationForm.reset();
          }else{
            this.failureMessage=true
            this.message=res?.message  
            setTimeout(() => {
              this.failureMessage = false;
            }, 5000);
            this.shareQuotationForm.reset();
          }
        });
    }

}
