import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { NonPosPopupComponent } from 'src/app/motor-insurance/non-pos-popup/non-pos-popup.component';

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
  nonPOSJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NonPosPopupComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };
  twoWheelerJourney: boolean=false;
  commercialVehicleMessage: boolean=false;
  constructor(public dialogRef: MatDialogRef<VehicleRegistrationNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bottomSheetRef: MatBottomSheetRef<VehicleRegistrationNumberComponent>,

    private formBuild: FormBuilder,
    private apiservice:ApiService,
    private router:Router,
    private sharedDataService:SharedDataService,
    public matDialog: WindowRef,


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
        `${ApiConstants.registration_number()}?regn_no=${regestrationNumber}&quote_request_id=${this.quotes_data?.data?.quote_request_id}`
      )
      .subscribe((res: any) => {
        this.loader=false
        if (res?.detail!='Vehicle details not found.') {
          if(!res?.is_commercial){
            if((this.quotes_data?.data?.vehicle_type=='private_car' && res?.is_four_wheeler) || (this.quotes_data?.data?.vehicle_type=='two_wheeler' && res?.is_two_wheeler)){
              this.sharedDataService.vahaanDetails(res)
              sessionStorage.setItem('registrationNumber',regestrationNumber)
              sessionStorage.setItem('alreadyCalled', 'true');
            sessionStorage.setItem('isprevoiusInsurer', 'true');
            sessionStorage.setItem('quotes_data', JSON.stringify(this.quotes_data?.data));
            const transactionId = sessionStorage.getItem('transaction_id');
            if (this.quotes_data?.data?.premium_details?.idv > 5000000) {
              this.openNonPOSPopup(null);
            } else {
              this.router.navigate([`quotes/proposal/${transactionId}`]);
            }
            if (window.innerWidth <= 999) {
              this.bottomSheetRef.dismiss();
            } else {
              this.dialogRef.close();
            }
            }else{
              this.twoWheelerJourney=true
            }
            
          }else{
            this.commercialVehicleMessage=true
            this.vehicleRegistrationNumberForm.get('registration_number_last_digit')?.reset();
          }
        }else{
          this.showErrorMessage=true
        }
      },(error)=>{
        this.loader=false
      });
  }
  goBack(){
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    this.router.navigate([``]);
  }
  // * @param event - The input event that triggered this function.
  // */
 addHyphen(event: any) {
  this.showErrorMessage=false
  this.twoWheelerJourney=false
  this.commercialVehicleMessage=false
   let value = event.target.value;
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
  
 openNonPOSPopup(objData: any) {
  let resWidth;
  let resTop;
  if (window.screen.width <= 767) {
    resWidth = 'auto';
    resTop = '5%';
  } else {
    resWidth = 'auto';
    resTop = '5%';
  }
  const obj: any = {
    modalName: this.nonPOSJSON['modalName'],
    width: this.nonPOSJSON['widthObtained'],
    height: this.nonPOSJSON['heightObtained'],
    classNameObtained: this.nonPOSJSON['classObtained'],
    isOutSideClose: this.nonPOSJSON['isOutSideClose'],
    minWidth: resWidth,
    dataInfo: {
      data: objData,
      top: resTop,
    },
  };

  this.matDialog.openDialog(obj);
}
}
