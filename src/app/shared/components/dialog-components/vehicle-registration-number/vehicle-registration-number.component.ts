import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-vehicle-registration-number',
  templateUrl: './vehicle-registration-number.component.html',
  styleUrls: ['./vehicle-registration-number.component.scss']
})
export class VehicleRegistrationNumberComponent implements OnInit {
  vehicleRegistrationNumberForm!: FormGroup;
  mmvItem: any;
  quotes_data:any;
  isIdvGreaterThan50Lac: boolean=false;
  showErrorMessage: boolean=false;
loader: boolean=false;
  constructor(public dialogRef: MatDialogRef<VehicleRegistrationNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bottomSheetRef: MatBottomSheetRef<VehicleRegistrationNumberComponent>,

    private formBuild: FormBuilder,
    private apiservice:ApiService,
    private router:Router,
    private sharedDataService:SharedDataService

  ) {
      this.vehcileRegistrationForm()
     }

  ngOnInit(): void {
    this.quotes_data=this.data
    this.mmvItem = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    this.vehicleRegistrationNumberForm.patchValue({
      registration_number_first: this.divideString(
        this.mmvItem?.registration_city?.rb_rto_code
      )[0],
      registration_number_second: this.divideString(
        this.mmvItem?.registration_city?.rb_rto_code
      )[1],
    });
    this.vehicleRegistrationNumberForm.get('registration_number_first')?.disable();
    this.vehicleRegistrationNumberForm.get('registration_number_second')?.disable();
  }

  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }


/**
   * Initializes the form group with the appropriate controls and validators.
   */
vehcileRegistrationForm() {
  this.vehicleRegistrationNumberForm = this.formBuild.group({
    registration_number_first: [''],
    registration_number_second: [''],
    registration_number_last_digit: ['',Validators.required],
    engine_number: ['',],
    chassis_number: [
      '',
      [
        Validators.minLength(6),
        Validators.maxLength(25),
      ],
    ],
  });
}
divideString(input: string): [string, string] {
  const firstPartLength = Math.ceil(input?.length / 2);

  const firstPart = input?.slice(0, firstPartLength);
  const secondPart = input?.slice(firstPartLength);

  return [firstPart, secondPart];
}
getVahaanDetails(isValid:any){
  this.loader=true
  const regestrationNumber=this.vehicleRegistrationNumberForm.get('registration_number_first')?.value.toUpperCase()+`-`+this.vehicleRegistrationNumberForm.get('registration_number_second')?.value.toUpperCase()+`-`+this.vehicleRegistrationNumberForm.get('registration_number_last_digit')?.value.toUpperCase()
  this.vehicleRegistrationNumberForm.get('registration_number_last_digit')?.value.toUpperCase()
  this.apiservice
      .getRequestedResponse(
        `${ApiConstants.registration_number()}?regn_no=${regestrationNumber}`
      )
      .subscribe((res: any) => {
        this.loader=false
        if (res?.detail!='Vehicle details not found.') {
          this.sharedDataService.vahaanDetails(res)
          sessionStorage.setItem('registrationNumber',regestrationNumber)
          sessionStorage.setItem('alreadyCalled', 'true');
        if (this.quotes_data?.is_rb_renewal) {
          sessionStorage.setItem('renewalType', 'renewal');
        }
        sessionStorage.setItem('isprevoiusInsurer', 'true');
        sessionStorage.setItem('quotes_data', JSON.stringify(this.quotes_data?.data));
        const transactionId = sessionStorage.getItem('transaction_id');
        if (this.quotes_data?.premium_details?.idv > 5000000) {
          this.isIdvGreaterThan50Lac = true;
        }
        if (this.isIdvGreaterThan50Lac) {
          // this.openNonPOSPopup(null);
        } else {
          this.router.navigate([`quotes/proposal/${transactionId}`]);
        }
        if (window.innerWidth <= 999) {
          this.bottomSheetRef.dismiss();
        } else {
          this.dialogRef.close();
        }
        }else{
          this.showErrorMessage=true
        }
      },(error)=>{
        this.loader=false
      });
  }
  // * @param event - The input event that triggered this function.
  // */
 addHyphen(event: any) {
  this.showErrorMessage=false
   let value = event.target.value;
   console.log(value)
   value = value.replace(/-/g, '');
   value = value.replace(/\s/g, '');
   value = value.replace(/([A-Za-z])(?=\d)|(\d)(?=[A-Za-z])/g, '$1$2-');
   this.vehicleRegistrationNumberForm.patchValue({
     registration_number_last_digit: value.toUpperCase(),
   });
   event.target.setSelectionRange(value.length, value.length);
   if (
     this.vehicleRegistrationNumberForm.controls['registration_number_last_digit']
       .valid
   ) {
     this.vehicleRegistrationNumberForm.patchValue({
       registration_number:
         this.vehicleRegistrationNumberForm.get('registration_number_last_digit')
           ?.value != ''
           ? this.vehicleRegistrationNumberForm.get('registration_number_first')
               ?.value +
             '-' +
             this.vehicleRegistrationNumberForm.get('registration_number_second')
               ?.value +
             '-' +
             this.vehicleRegistrationNumberForm.get(
               'registration_number_last_digit'
             )?.value
           : '',
     });
   }
 }
 onPaste(event: ClipboardEvent) {
   setTimeout(() => {
     this.addHyphen(event);
   }, 0);
 }
  
}
