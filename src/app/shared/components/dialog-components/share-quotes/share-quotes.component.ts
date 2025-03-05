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
declare const webengage: any;
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
  quoteData: any;
  whatsappShareLoader: boolean = false;
  emailShareLoader: boolean = false;
  mobileShareLoader: boolean = false;
  traceIdData: any;
  sharePopupData: any;
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
      whatsApp_number: [
        { value: '', disabled: true },
        [Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      contact_number: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
    });
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    this.endPath = lastSegment;
  }

  ngOnInit(): void {
    this.partner_name = sessionStorage.getItem('ta_user_name');
    if (Object.keys(this.bottomSheetdata).length > 0) {
      this.quotesData = this.bottomSheetdata;
      this.sharePopupData = this.bottomSheetdata;
    } else {
      this.quotesData = this.data?.data;
      this.sharePopupData = this.data?.data;
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
  shareQuotes(shareType: any) {
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');

    this.quoteData = sessionStorage.getItem('quotes_data');
    webengage.track('Quote_shared_successfully', {
      Option_Selected: shareType,
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: vehicleTypeValue,
      Insurer_Name: this.sharePopupData[0]?.insurer_name,
      Total_IDV: this.sharePopupData[0]?.premium_details?.idv,
      Total_Premium: this.sharePopupData[0]?.premium_details?.gross_premium,
      Insurer_Logo: this.sharePopupData[0]?.insurer_logo,
    });
    let message: any;
    if (this.shareQuotationForm.get('email')?.value != '') {
      if (shareType == 'whatsapp') {
        this.whatsappShareLoader = true;
      } else if (shareType == 'email') {
        this.emailShareLoader = true;
      } else if (shareType == 'mobile') {
        this.mobileShareLoader = true;
      }
      message =
        'Sent to Email ' +
        this.shareQuotationForm.get('email')?.value +
        ' successfully';
      if (this.endPath == 'review') {
        this.sharedDataService
          .shareQuotes(
            JSON.parse(this.quoteData),
            'proposal',
            this.partner_name,
            `motor/quotes/proposal/${
              JSON.parse(this.quoteData)['transaction_id']
            }/review`,
            this.shareQuotationForm.get('email')?.value,
            this.shareQuotationForm.get('contact_number')?.value,
            [JSON.parse(this.quoteData)['quote_id']]
          )
          .subscribe(
            (res) => {
              if (res?.message == 'Success') {
                this.sharedDataService.openSnackBar(message, true, 3000);
                if (shareType == 'whatsapp') {
                  this.whatsappShareLoader = false;
                } else if (shareType == 'email') {
                  this.emailShareLoader = false;
                } else if (shareType == 'mobile') {
                  this.mobileShareLoader = false;
                }
                this.shareQuotationForm.reset();
              }
            },
            (error) => {
              this.shareQuotationForm.reset();
              if (shareType == 'whatsapp') {
                this.whatsappShareLoader = false;
              } else if (shareType == 'email') {
                this.emailShareLoader = false;
              } else if (shareType == 'mobile') {
                this.mobileShareLoader = false;
              }
            }
          );
      } else {
        this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
        let traceValue = JSON.parse(this.traceIdData);
        this.sharedDataService
          .shareQuotes(
            this.quotesData[0],
            'quote',
            this.partner_name,
            `motor/quotes/${traceValue.trace_id}/?transaction_id_share=${this.quotesData[0]['transaction_id']}&insurer_quote_id=${this.quotes_id[0]}`,
            this.shareQuotationForm.get('email')?.value,
            this.shareQuotationForm.get('contact_number')?.value,
            this.quotes_id
          )
          .subscribe(
            (res) => {
              if (res?.message == 'Success') {
                this.sharedDataService.openSnackBar(message, true, 3000);
                this.shareQuotationForm.reset();
                if (shareType == 'whatsapp') {
                  this.whatsappShareLoader = false;
                } else if (shareType == 'email') {
                  this.emailShareLoader = false;
                } else if (shareType == 'mobile') {
                  this.mobileShareLoader = false;
                }
              }
            },
            (error) => {
              this.shareQuotationForm.reset();
              if (shareType == 'whatsapp') {
                this.whatsappShareLoader = false;
              } else if (shareType == 'email') {
                this.emailShareLoader = false;
              } else if (shareType == 'mobile') {
                this.mobileShareLoader = false;
              }
            }
          );
      }
    } else if (this.shareQuotationForm.get('contact_number')?.value != '') {
      if (shareType == 'whatsapp') {
        this.whatsappShareLoader = true;
      } else if (shareType == 'email') {
        this.emailShareLoader = true;
      } else if (shareType == 'mobile') {
        this.mobileShareLoader = true;
      }
      message =
        'Sent to Mobile Number +91-' +
        this.shareQuotationForm.get('contact_number')?.value +
        ' successfully';
      if (this.endPath == 'review') {
        this.sharedDataService
          .shareQuotes(
            JSON.parse(this.quoteData),
            'proposal',
            this.partner_name,
            `motor/quotes/proposal/${
              JSON.parse(this.quoteData)['transaction_id']
            }/review`,
            this.shareQuotationForm.get('email')?.value,
            this.shareQuotationForm.get('contact_number')?.value,
            [JSON.parse(this.quoteData)['quote_id']]
          )
          .subscribe(
            (res) => {
              if (res?.message == 'Success') {
                this.sharedDataService.openSnackBar(message, true, 3000);
                if (shareType == 'whatsapp') {
                  this.whatsappShareLoader = false;
                } else if (shareType == 'email') {
                  this.emailShareLoader = false;
                } else if (shareType == 'mobile') {
                  this.mobileShareLoader = false;
                }
                this.shareQuotationForm.reset();
              }
            },
            (error) => {
              this.shareQuotationForm.reset();
              if (shareType == 'whatsapp') {
                this.whatsappShareLoader = false;
              } else if (shareType == 'email') {
                this.emailShareLoader = false;
              } else if (shareType == 'mobile') {
                this.mobileShareLoader = false;
              }
            }
          );
      } else {
        this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
        let traceValue = JSON.parse(this.traceIdData);
        this.sharedDataService
          .shareQuotes(
            this.quotesData[0],
            'quote',
            this.partner_name,
            `motor/quotes/${traceValue.trace_id}/?transaction_id_share=${this.quotesData[0]['transaction_id']}&insurer_quote_id=${this.quotes_id[0]}`,
            this.shareQuotationForm.get('email')?.value,
            this.shareQuotationForm.get('contact_number')?.value,
            this.quotes_id
          )
          .subscribe(
            (res) => {
              if (res?.message == 'Success') {
                this.sharedDataService.openSnackBar(message, true, 3000);
                this.shareQuotationForm.reset();
                if (shareType == 'whatsapp') {
                  this.whatsappShareLoader = false;
                } else if (shareType == 'email') {
                  this.emailShareLoader = false;
                } else if (shareType == 'mobile') {
                  this.mobileShareLoader = false;
                }
              }
            },
            (error) => {
              this.shareQuotationForm.reset();
              if (shareType == 'whatsapp') {
                this.whatsappShareLoader = false;
              } else if (shareType == 'email') {
                this.emailShareLoader = false;
              } else if (shareType == 'mobile') {
                this.mobileShareLoader = false;
              }
            }
          );
      }
    }
  }
  getRemainingInsurerNames(): any {
    return this.quotesData
      .slice(2)
      .map((value: { insurer_name: any }) => value.insurer_name)
      .join(', ');
  }
}
