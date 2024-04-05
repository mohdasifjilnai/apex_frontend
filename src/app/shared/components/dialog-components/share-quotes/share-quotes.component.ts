import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.scss'],
})
export class ShareQuotesComponent implements OnInit {
  shareQuotationForm!: FormGroup;
  quotes_id: any[] = [];
  quotesData: any;
  partner_name: any;
  endPath: string;
  constructor(
    public dialogRef: MatDialogRef<ShareQuotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public bottomSheetRef: MatBottomSheetRef<ShareQuotesComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    public sharedDataService: SharedDataService
  ) {
    this.shareQuotationForm = this.formBuilder.group({
      whatsApp_number: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      contact_number: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
    });
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    this.endPath = lastSegment;
  }

  ngOnInit(): void {
    this.partner_name = localStorage.getItem('ta_user_name');
    if (Object.keys(this.bottomSheetdata).length > 0) {
      this.quotesData = this.bottomSheetdata;
    } else {
      this.quotesData = this.data?.data;
    }
    for (let value of this.quotesData) {
      this.quotes_id.push(value?.quote_id);
    }
    this.shareQuotationForm
      .get('whatsApp_number')
      ?.valueChanges.subscribe((whatsAppNumber) => {
        if (whatsAppNumber) {
          this.shareQuotationForm.patchValue({
            contact_number: '',
            email: '',
          });
        }
      });
    this.shareQuotationForm
      .get('contact_number')
      ?.valueChanges.subscribe((whatsAppNumber) => {
        if (whatsAppNumber) {
          this.shareQuotationForm.patchValue({
            whatsApp_number: '',
            email: '',
          });
        }
      });
    this.shareQuotationForm
      .get('email')
      ?.valueChanges.subscribe((whatsAppNumber) => {
        if (whatsAppNumber) {
          this.shareQuotationForm.patchValue({
            whatsApp_number: '',
            contact_number: '',
          });
        }
      });
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
    let message: any;
    if (this.shareQuotationForm.get('email')?.value != '') {
      message =
        'Sent to Email ' +
        this.shareQuotationForm.get('email')?.value +
        ' successfully';
    } else if (this.shareQuotationForm.get('contact_number')?.value != null) {
      message =
        'Sent to Mobile Number +91-' +
        this.shareQuotationForm.get('contact_number')?.value +
        ' successfully';
    }
    if (this.endPath == 'review') {
      this.sharedDataService
        .shareQuotes(
          this.quotesData,
          'proposal',
          this.partner_name,
          `motor/quotes/proposal/${this.quotesData[0]?.transaction_id}/review?proposal=true`,
          this.shareQuotationForm.get('email')?.value,
          this.shareQuotationForm.get('contact_number')?.value,
          this.quotes_id
        )
        .subscribe(
          (res) => {
            if (res?.message == 'Success') {
              this.sharedDataService.openSnackBar(message, true);
              this.shareQuotationForm.reset();
            }
          },
          (error) => {
            this.shareQuotationForm.reset();
          }
        );
    } else {
      let transactionId = sessionStorage.getItem('transaction_id');
      this.sharedDataService
        .shareQuotes(
          this.quotesData,
          'quote',
          this.partner_name,
          `motor/quotes/?transaction_id_share=${transactionId}&insurer_quote_id=${this.quotes_id}`,
          this.shareQuotationForm.get('email')?.value,
          this.shareQuotationForm.get('contact_number')?.value,
          this.quotes_id
        )
        .subscribe(
          (res) => {
            if (res?.message == 'Success') {
              this.sharedDataService.openSnackBar(message, true);
              this.shareQuotationForm.reset();
            }
          },
          (error) => {
            this.shareQuotationForm.reset();
          }
        );
    }
  }
}
