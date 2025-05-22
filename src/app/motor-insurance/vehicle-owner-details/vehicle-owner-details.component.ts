import { HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { HttpService } from 'src/app/core/services/http.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
import { environment } from 'src/environments/environment';

declare const webengage: any;
@Component({
  selector: 'app-vehicle-owner-details',
  templateUrl: './vehicle-owner-details.component.html',
  styleUrls: ['./vehicle-owner-details.component.scss'],
})
export class VehicleOwnerDetailsComponent implements OnInit {
  @Output() afterFormSubmit = new EventEmitter<any>();
  occupationList: any;
  maritalStatusList: any;
  filteredPincodeList!: Observable<any[]>;
  @Output() afterVehicleOwnerData = new EventEmitter<any>();
  @Input() fetchCkycData: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  salutationList: any;
  ckycItem: any;
  vehicleOwnerName: boolean = false;
  vehicleOwneremail: boolean = false;
  vehicleOwneraddress: boolean = false;
  vehicleOwnerdob: boolean = false;
  vehicleOwnerNumber: boolean = false;
  vehicleOwnerOrganisation: boolean = false;
  vehicleOwnerPanNumber: boolean = false;
  vehicleOwnerPincode: boolean = false;
  vehicleOwnerCity: boolean = false;
  vehicleOwnerState: boolean = false;
  proposalData: any;
  quoteData: any;
  pincodeId: any;
  proposalType: any;
  proposalBaseOwner: any;
  proposerType: any;
  isProposerTrue: boolean = true;
  isPancard: boolean = false;
  isPancardDisabled: boolean = false;
  renewalType: any;
  renewalQuotesData: any;
  maxlength: any;
  addresLength: any;
  previousDetails: any;
  details: any;

  owenerVehicleDetailsForm: FormGroup = new FormGroup({
    owner_full_Name: new FormControl('', Validators.required),
    owner_email: new FormControl('', [
      Validators.required,
      this.sharedDataService.customFieldValidator('email'),
    ]),
    contact_number: new FormControl('', [
      Validators.required,
      this.sharedDataService.customFieldValidator('contact'),
    ]),
    document_number_based_field: new FormControl(''),
    owner_gstin: new FormControl('', [
      Validators.pattern(
        new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
      ),
    ]),
    additional_contact: new FormControl('', []),
    owner_pincode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      this.pincodeNumberValidator.bind(this),
    ]),
    owner_city: new FormControl('', Validators.required),
    owner_state: new FormControl('', Validators.required),
    ownner_occupation_type: new FormControl(''),
    owner_communication_addres: new FormControl('', [Validators.required]),
    marital_status: new FormControl('1'),
    owner_gender: new FormControl('', Validators.required),
    ownner_salutation_type: new FormControl('', Validators.required),
  });
  private vahaanDetailsUnsubscribe!: Subscription;
  private getCustomerIdDetails!: Subscription;
  webEngageCustomerDetails: any;

  constructor(
    private sharedDataService: SharedDataService,
    private apiService: ApiService,
    private httpService: HttpService,
    private dialog: MatDialog
  ) {
    this.maritalStatusList = [
      {
        id: 1,
        name: 'Single',
      },
      {
        id: 2,
        name: 'Married',
      },
    ];
  }

  ngOnInit(): void {
    this.quoteData = sessionStorage.getItem('quotes_data');
    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.quoteData) {
      if (
        JSON.parse(this.quoteData)['premium_details']['idv'] >= 5000000 ||
        JSON.parse(this.quoteData)['premium_details']['gross_premium'] >= 100000
      ) {
        this.isPancard = true;
        this.owenerVehicleDetailsForm
          .get('document_number_based_field')
          ?.setValidators([Validators.required]);
      } else {
        this.isPancard = false;
        this.owenerVehicleDetailsForm
          .get('document_number_based_field')
          ?.clearValidators();
      }
      this.getOccupationType();
      this.getPincodeList();
      this.getSalutationType();
    }
    this.vahaanDetailsUnsubscribe =
      this.sharedDataService.getVahaanDetails.subscribe((res: any) => {
        if (res?.customer_details != null) {
          this.owenerVehicleDetailsForm.patchValue({
            owner_full_Name: res?.customer_details?.full_name,
            contact_number: res?.customer_details?.mobile_number,
            owner_email: res?.customer_details?.email_id,
            owner_gstin: res?.customer_details?.gst_no,
            additional_contact: res?.customer_details?.additional_mobile_number,
            owner_gender: res?.customer_details?.gender,
            owner_communication_addres:
              res?.customer_details?.communication_address?.address_line,
          });
          sessionStorage.setItem(
            'mobileNumber',
            this.owenerVehicleDetailsForm.get('contact_number')?.value
          );
        }

        if (res?.customer_details?.communication_address?.pincode) {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${
                res?.customer_details?.communication_address?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
            )
            .subscribe((response) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: response[0],
                owner_city: response[0].rb_city_name,
                owner_state: response[0].rb_state_name,
              });
              this.sharedDataService?.sendOwnnerAddres(
                this.owenerVehicleDetailsForm.valid
              );
            });
        }

        if (res?.customer_details?.communication_address?.pincode) {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${
                res?.customer_details?.communication_address?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
            )
            .subscribe((response) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: response[0],
                owner_city: response[0].rb_city_name,
                owner_state: response[0].rb_state_name,
              });
              this.sharedDataService?.sendOwnnerAddres(
                this.owenerVehicleDetailsForm.valid
              );
            });
        }
      });
    this.owenerVehicleDetailsForm
      .get('document_number_based_field')
      ?.updateValueAndValidity();
    this.proposerType = sessionStorage.getItem('proposerType');
    this.proposerType == 'individual'
      ? (this.isProposerTrue = true)
      : (this.isProposerTrue = false);

    this.sharedDataService.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (proposal?.customer_details?.full_name) {
        this.vehicleOwnerName = true;
      }
      if (proposal?.customer_details !== null) {
        // this.owenerVehicleDetailsForm.patchValue({
        //   owner_full_Name: proposal?.customer_details?.full_name,
        //   owner_email: proposal?.customer_details?.email_id,
        //   contact_number: proposal?.customer_details?.mobile_number,
        //   owner_gstin: proposal?.customer_details?.gst_no,
        //   additional_contact:
        //     proposal?.customer_details?.additional_mobile_number,
        //   // ownner_occupation_type:
        //   //   proposal?.customer_details?.occupation_type_id,
        //   // owner_communication_addres:
        //   //   proposal?.customer_details?.communication_address?.address_line,
        //   marital_status: proposal?.customer_details?.marital_status,
        //   owner_gender: proposal?.customer_details?.gender,
        // });
        const customerDetails = proposal?.customer_details || {};
        Object.keys(customerDetails).forEach((key) => {
          if (
            customerDetails[key] !== null &&
            customerDetails[key] !== undefined
          ) {
            let patchValue: any = {};
            patchValue[key] = customerDetails[key];
            this.owenerVehicleDetailsForm.patchValue(patchValue);
          }
        });
        const fieldMapping: any = {
          owner_full_Name: 'full_name',
          owner_email: 'email_id',
          contact_number: 'mobile_number',
          owner_gstin: 'gst_no',
          additional_contact: 'additional_mobile_number',
          marital_status: 'marital_status',
          owner_gender: 'gender',
        };

        Object.keys(fieldMapping).forEach((formField) => {
          let dataField: any = fieldMapping[formField];
          if (
            customerDetails[dataField] !== null &&
            customerDetails[dataField] !== undefined
          ) {
            this.owenerVehicleDetailsForm.patchValue({
              [formField]: customerDetails[dataField],
            });
          }
        });
        if (customerDetails?.communication_address?.address_line != null) {
          this.owenerVehicleDetailsForm.patchValue({
            owner_communication_addres:
              customerDetails?.communication_address?.address_line,
          });
        }
        if (this.salutationList && this.proposalData) {
          for (let data of this.salutationList) {
            if (
              data?.rb_salutation ===
              this.proposalData?.customer_details?.salutation
            ) {
              this.owenerVehicleDetailsForm.patchValue({
                ownner_salutation_type:
                  this.proposalData?.customer_details?.salutation,
              });
            }
          }
        }

        if (this.occupationList && this.proposalData) {
          for (let data of this.occupationList) {
            if (
              data?.rb_id ===
              this.proposalData?.customer_details?.occupation_type_id
            ) {
              this.owenerVehicleDetailsForm.patchValue({
                ownner_occupation_type:
                  this.proposalData?.customer_details?.occupation_type_id,
              });
            }
          }
        }

        if (
          this.proposalData?.customer_details?.communication_address?.pincode
        ) {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${
                this.proposalData?.customer_details?.communication_address
                  ?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
            )
            .subscribe((res) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: res[0],
                owner_city: res[0].rb_city_name,
                owner_state: res[0].rb_state_name,
              });
              this.sharedDataService?.sendOwnnerAddres(
                this.owenerVehicleDetailsForm.valid
              );
            });
        }
        if (
          this.owenerVehicleDetailsForm.get('owner_pincode')?.value != null &&
          this.owenerVehicleDetailsForm.get('owner_pincode')?.value != '' &&
          this.owenerVehicleDetailsForm.get('owner_pincode')?.value != undefined
        ) {
          let pincodeValue;
          if (
            typeof this.owenerVehicleDetailsForm.get('owner_pincode')?.value ==
            'object'
          ) {
            pincodeValue =
              this.owenerVehicleDetailsForm.get('owner_pincode')?.value
                ?.rb_pincode;
          } else {
            pincodeValue =
              this.owenerVehicleDetailsForm.get('owner_pincode')?.value;
          }
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${pincodeValue}&insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }`
            )
            .subscribe((response) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: response[0],
                owner_city: response[0].rb_city_name,
                owner_state: response[0].rb_state_name,
              });
              this.sharedDataService?.sendOwnnerAddres(
                this.owenerVehicleDetailsForm.valid
              );
            });
        }
      }
      if (proposal?.ckyc_details !== null) {
        if (proposal?.ckyc_details?.document_type == 'pan_number') {
          if (proposal?.ckyc_details?.document_number) {
            this.isPancardDisabled = true;
            this.owenerVehicleDetailsForm.patchValue({
              document_number_based_field:
                proposal?.ckyc_details?.document_number,
            });
          } else {
            this.isPancardDisabled = false;
          }
        }
      }
      if (
        sessionStorage.getItem('proposerType') !== 'individual' &&
        (proposal?.insurer_code === 'united_india' ||
          proposal?.insurer_code === 'national_insurance' ||
          proposal?.insurer_code === 'kotak')
      ) {
        this.owenerVehicleDetailsForm
          .get('owner_gstin')
          ?.setValidators([Validators.required]);
        this.owenerVehicleDetailsForm
          .get('owner_gstin')
          ?.updateValueAndValidity();
      } else {
        this.owenerVehicleDetailsForm.get('owner_gstin')?.clearValidators();
        this.owenerVehicleDetailsForm
          .get('owner_gstin')
          ?.updateValueAndValidity();
      }
    });
    this.sharedDataService.fetchedCkycData.subscribe((ckycData) => {
      if (this.renewalType === 'renewal') {
        if (ckycData?.customer_details?.full_name) {
          this.vehicleOwnerName = true;
        }
        // if (ckycData?.customer_details?.email) {
        //   this.vehicleOwneremail = true;
        // }
        // if (ckycData?.customer_details?.address) {
        //   this.vehicleOwneraddress = true;
        // }
        // if (ckycData?.customer_details?.mobile_number) {
        //   this.vehicleOwnerNumber = true;
        // }
        if (ckycData?.customer_details?.pan_number) {
          this.isPancardDisabled = true;
        }
        // if (ckycData?.customer_details?.pincode) {
        //   this.vehicleOwnerPincode = true;
        // }
      } else {
        if (ckycData?.customer_details?.full_name) {
          this.vehicleOwnerName = true;
        }
      }
      // if (ckycData) {
      //   if (ckycData?.customer_details?.pincode) {
      //     this.apiService
      //       .getRequestedResponse(
      //         `${ApiConstants.pincode}?pincode=${
      //           ckycData?.customer_details?.pincode
      //         }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
      //       )
      //       .subscribe((res) => {
      //         this.owenerVehicleDetailsForm.patchValue({
      //           owner_pincode: res[0],
      //           owner_city: res[0].rb_city_name,
      //           owner_state: res[0].rb_state_name,
      //         });
      //       });
      //   }

      //   this.owenerVehicleDetailsForm.patchValue({
      //     owner_full_Name: ckycData?.customer_details?.full_name,
      //     owner_email: ckycData?.customer_details?.email,
      //     contact_number: ckycData?.customer_details?.mobile_number,
      //     // owner_communication_addres: ckycData?.customer_details?.address,
      //     owner_city: ckycData?.customer_details?.rb_city_name,
      //     owner_state: ckycData?.customer_details?.rb_state_name,
      //     owner_gender: ckycData?.customer_details?.gender,
      //     // owner_pincode : ckycData?.customer_details?.pincode
      //   });
      //   if(ckycData?.customer_details?.communication_address?.address_line!=null){
      //     this.owenerVehicleDetailsForm.patchValue({
      //       owner_communication_addres:
      //         ckycData?.customer_details?.communication_address?.address_line,
      //     });
      //   }
      // }
    });
    this.sharedDataService.getErrorProposalDetails.subscribe((errData) => {
      if (errData) {
        this.maxlength = errData?.max_length;
        this.updateMaxLengthValidator(this.maxlength,errData?.min_length);
        this.owenerVehicleDetailsForm
          ?.get('owner_communication_addres')
          ?.valueChanges.subscribe((addressLength) => {
            this.addresLength = addressLength;
          });
      }
    });
    this.owenerVehicleDetailsForm
      .get('owner_pincode')
      ?.valueChanges.subscribe((pincode) => {
        if (pincode.length === 0) {
          this.owenerVehicleDetailsForm.patchValue({
            owner_city: '',
            owner_state: '',
          });
        }
      });

    this.previousDetails = sessionStorage.getItem('RenewalPreviousDetails');
    this.details = JSON.parse(this.previousDetails);
    if (this.renewalType === 'renewal' || this.renewalType == 'rollover') {
      const customerDetails =
        this.details?.previous_policy_details?.customer_details;
      if (customerDetails) {
        this.owenerVehicleDetailsForm.patchValue({
          ownner_salutation_type: customerDetails?.salutation,
          owner_full_Name: customerDetails?.full_name,
          contact_number: customerDetails?.mobile_number,
          owner_email: customerDetails?.email_id,
          ownner_occupation_type: customerDetails?.occupation_type_id,
          owner_gstin: customerDetails?.gst_no,
          additional_contact: customerDetails?.additional_mobile_number,
          owner_gender: customerDetails?.gender,
          marital_satus: customerDetails?.marital_status,
          // owner_communication_addres:
          //   customerDetails?.communication_address?.address_line,
          owner_pincode: customerDetails?.communication_address?.pincode,
          owner_city: customerDetails?.communication_address?.rb_city_name,
          owner_state: customerDetails?.communication_address?.rb_state_name,
        });
        sessionStorage.setItem(
          'mobileNumber',
          this.owenerVehicleDetailsForm.get('contact_number')?.value
        );

        if (customerDetails?.communication_address?.address_line != null) {
          this.owenerVehicleDetailsForm.patchValue({
            owner_communication_addres:
              customerDetails?.communication_address?.address_line,
          });
        }
      }

      if (customerDetails?.communication_address?.pincode) {
        this.apiService
          .getRequestedResponse(
            `${ApiConstants.pincode}?pincode=${
              customerDetails?.communication_address?.pincode
            }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
          )
          .subscribe((res) => {
            this.owenerVehicleDetailsForm.patchValue({
              owner_pincode: res[0],
              owner_city: res[0].rb_city_name,
              owner_state: res[0].rb_state_name,
            });
            this.sharedDataService?.sendOwnnerAddres(
              this.owenerVehicleDetailsForm.valid
            );
          });
      }
    }

    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (kycData?.customer_details) {
      // this.owenerVehicleDetailsForm.patchValue({
      //   owner_full_Name: kycData?.customer_details?.full_name,
      //   owner_email: kycData?.customer_details?.email,
      //   contact_number: kycData?.customer_details?.mobile_number,
      //   // owner_communication_addres: kycData?.customer_details?.address,
      //   owner_city: kycData?.customer_details?.rb_city_name,
      //   owner_state: kycData?.customer_details?.rb_state_name,
      //   owner_gender: kycData?.customer_details?.gender,
      // });
      // if(kycData?.customer_details?.communication_address?.address_line!=null){
      //   this.owenerVehicleDetailsForm.patchValue({
      //     owner_communication_addres:
      //       kycData?.customer_details?.communication_address?.address_line,
      //   });
      // }
      // if (kycData?.customer_details?.pincode) {
      //   this.apiService
      //     .getRequestedResponse(
      //       `${ApiConstants.pincode}?pincode=${
      //         kycData?.customer_details?.pincode
      //       }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
      //     )
      //     .subscribe((res) => {
      //       this.owenerVehicleDetailsForm.patchValue({
      //         owner_pincode: res[0],
      //         owner_city: res[0].rb_city_name,
      //         owner_state: res[0].rb_state_name,
      //       });
      //       this.sharedDataService?.sendOwnnerAddres(
      //         this.owenerVehicleDetailsForm.valid
      //       );
      //     });
      // }
      if (this.renewalType === 'renewal') {
        if (kycData?.customer_details?.full_name) {
          this.vehicleOwnerName = true;
        }
        // if (kycData?.customer_details?.email) {
        //   this.vehicleOwneremail = true;
        // }
        // if (kycData?.customer_details?.address) {
        //   this.vehicleOwneraddress = true;
        // }
        // if (kycData?.customer_details?.mobile_number) {
        //   this.vehicleOwnerNumber = true;
        // }
        if (kycData?.customer_details?.pan_number) {
          this.isPancardDisabled = true;
        }
        // if (kycData?.customer_details?.pincode) {
        //   this.vehicleOwnerPincode = true;
        // }
      } else {
        if (kycData?.customer_details?.full_name) {
          this.vehicleOwnerName = true;
        }
      }
    }
    // if (this.quoteData) {
    //   this.getOccupationType();
    //   this.getPincodeList();
    //   this.getSalutationType();
    // }

    this.proposalType = sessionStorage.getItem('proposerType');
    if (this.proposalType == 'individual') {
      this.proposalBaseOwner = 'Owner Full Name';

      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.setValidators([Validators.required]);
      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.updateValueAndValidity();

      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.setValidators([Validators.required]);
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.updateValueAndValidity();

      this.owenerVehicleDetailsForm
        .get('marital_status')
        ?.setValidators([Validators.required]);
      this.owenerVehicleDetailsForm
        .get('marital_status')
        ?.updateValueAndValidity();
    } else {
      this.proposalBaseOwner = 'Company Name';
      this.owenerVehicleDetailsForm.get('owner_gender')?.setValidators([]);
      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.updateValueAndValidity();
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.setValidators([]);
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.updateValueAndValidity();

      this.owenerVehicleDetailsForm.get('marital_status')?.setValidators([]);
      this.owenerVehicleDetailsForm
        .get('marital_status')
        ?.updateValueAndValidity();
      this.owenerVehicleDetailsForm.patchValue({ marital_status: '' });
    }
    setTimeout(() => {
      this.sharedDataService.formCheck(this.owenerVehicleDetailsForm.valid);
    }, 2000);

    this.getCustomerIdDetails = this.sharedDataService.getCustomerId.subscribe(
      (idValue) => {
        const vehcileType = sessionStorage.getItem('vehicleType');
        const proposerType = sessionStorage.getItem('proposerType');
        let vehicleDetailsValue = JSON.parse(this.quoteData);
        const formValues = this.owenerVehicleDetailsForm.value;
        let vehicleOwnerWebengage = {
          User_Type: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Motor_Type: vehcileType,
          Salutation_type: formValues?.ownner_salutation_type,
          Owner_Full_Name: 'Yes',
          Contact_Number: 'Yes',
          Email: 'Yes',
          Occupation_type: formValues?.ownner_occupation_type,
          GSTIN: formValues?.owner_gstin,
          Additional_contact_number: `+91${formValues?.additional_contact}`,
          Gender: formValues?.owner_gender,
          Matrital_Status: formValues?.marital_status,
          Insurer_Name: vehicleDetailsValue?.insurer_name,
          Total_IDV: vehicleDetailsValue?.premium_details?.idv,
          Total_Premium: vehicleDetailsValue?.premium_details?.gross_premium,
          Insurer_Logo: vehicleDetailsValue?.insurer_logo,
          Product_id: vehicleDetailsValue?.quote_id,
          Customer_id: idValue.customer_id,
          Perform_by: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Partner_Name:
            sessionStorage.getItem('first_name') != null
              ? `${sessionStorage.getItem(
                  'first_name'
                )} ${sessionStorage.getItem(
                  'middle_name'
                )} ${sessionStorage.getItem('last_name')}`
              : '',
          Partner_id: sessionStorage.getItem('partner_code'),
        };
        const filteredData = Object.fromEntries(
          Object.entries(vehicleOwnerWebengage).filter(([key, value]) => {
            if (value == null || value === '') {
              return false;
            }
            return true;
          })
        );
        webengage.track('Motor_Owner_details_Submitted', filteredData);
      }
    );
  }
  getVehicleDetails(isValid: any) {
    const vehcileType = sessionStorage.getItem('vehicleType');
    const proposerType = sessionStorage.getItem('proposerType');
    let vehicleDetailsValue = JSON.parse(this.quoteData);
    const formValues = this.owenerVehicleDetailsForm.value;
    if (environment?.dev) {
      // this.createCustomerForWebengage(
      //   this.owenerVehicleDetailsForm.get('contact_number')?.value,
      //   formValues
      // );
      sessionStorage.setItem(
        'mobileNumber',
        this.owenerVehicleDetailsForm.get('contact_number')?.value
      );

      this.sharedDataService.getCustomerIdForwebengae(
        this.owenerVehicleDetailsForm.get('contact_number')?.value,
        formValues,
        'Vehicle Owner Details'
      );
    }
    if (isValid && proposerType == 'individual') {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.validate_customer_details}?email=` +
            this.owenerVehicleDetailsForm.get('owner_email')?.value +
            `&phone=` +
            this.owenerVehicleDetailsForm.get('contact_number')?.value
        )
        .subscribe((response) => {
          if (response?.valid) {
            const formValues = this.owenerVehicleDetailsForm.value;
            // if (environment?.dev) {
            //   this.createCustomerForWebengage(
            //     this.owenerVehicleDetailsForm.get('contact_number')?.value,
            //     formValues
            //   );
            // }

            this.afterVehicleOwnerData.emit(formValues);
            setTimeout(() => {
              this.sharedDataService.formCheck(
                this.owenerVehicleDetailsForm.valid
              );
            }, 2000);
            this.sharedDataService?.createProposalId(
              'vehicle_owner_detail',
              this.owenerVehicleDetailsForm
            );
            sessionStorage.setItem('isCKycDOne', 'true');
            // if (this.maxlength < this.addresLength?.length) {
            //   this.sharedDataService?.sendOwnnerAddres(this.addresLength);
            // }
            // this.sharedDataService?.getAddressValidation(
            //   JSON.parse(this.quoteData)['insurer_code']
            // );
          } else {
            const dialogRef = this.dialog.open(FailureDialogComponent, {
              width: 'auto',
              height: 'auto',
              data: {
                errorData: response.error,
                statusdata: status,
              },
              panelClass: 'failure-dialog-class',
            });
            dialogRef.afterClosed().subscribe((result: any) => {});
          }
        });
    } else {
      // const formValues = this.owenerVehicleDetailsForm.value;
      // let vehicleOwnerWebengage = {
      //   User_Type: sessionStorage.getItem('partner_code')
      //     ? 'Partner'
      //     : 'Customer',
      //   Motor_Type: vehcileType,
      //   Salutation_type: formValues?.ownner_salutation_type,
      //   Owner_Full_Name: 'Yes',
      //   Contact_Number: 'Yes',
      //   Email: 'Yes',
      //   Occupation_type: formValues?.ownner_occupation_type,
      //   GSTIN: formValues?.owner_gstin,
      //   Additional_contact_number: `+91${formValues?.additional_contact}`,
      //   Gender: formValues?.owner_gender,
      //   Matrital_Status: formValues?.marital_status,
      //   Insurer_Name: vehicleDetailsValue?.insurer_name,
      //   Total_IDV: vehicleDetailsValue?.premium_details?.idv,
      //   Total_Premium: vehicleDetailsValue?.premium_details?.gross_premium,
      //   Insurer_Logo: vehicleDetailsValue?.insurer_logo,
      //   Product_id: vehicleDetailsValue?.quote_id,
      // };
      // const filteredData = Object.fromEntries(
      //   Object.entries(vehicleOwnerWebengage).filter(([key, value]) => {
      //     if (value == null || value === '') {
      //       return false;
      //     }
      //     return true;
      //   })
      // );
      // webengage.track('Motor_Owner_details_Submitted', filteredData);
      this.afterVehicleOwnerData.emit(formValues);
      setTimeout(() => {
        this.sharedDataService.formCheck(this.owenerVehicleDetailsForm.valid);
      }, 2000);
      this.sharedDataService?.createProposalId(
        'vehicle_owner_detail',
        this.owenerVehicleDetailsForm
      );
      sessionStorage.setItem('isCKycDOne', 'true');
    }
  }
  ngOnDestroy(): void {
    this.vahaanDetailsUnsubscribe.unsubscribe();
    this.getCustomerIdDetails.unsubscribe();
  }
  /**
   * Emits an event indicating that the form group has been submitted.
   */
  submitFormGroup() {
    this.afterFormSubmit.emit('Vehicle-owner-details Form Submited');
  }

  /**
   * Fetches the list of occupation types from the backend API and stores it in the component's state.
   */
  getOccupationType() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.occupation_type}?insurer_code=${
          JSON.parse(this.quoteData)['insurer_code']
        }`
      )
      .subscribe((occupation) => {
        this.occupationList = occupation;
        if (occupation.length > 0) {
          this.owenerVehicleDetailsForm
            .get('ownner_occupation_type')
            ?.setValue(occupation[0].rb_id);
        }
        if (this.occupationList && this.proposalData) {
          for (let data of this.occupationList) {
            if (
              data?.rb_id ===
              this.proposalData?.customer_details?.occupation_type_id
            ) {
              this.owenerVehicleDetailsForm.patchValue({
                ownner_occupation_type:
                  this.proposalData?.customer_details?.occupation_type_id,
              });
            }
          }
        }
      });
  }
  /**
   * Updates the form with the pincode data
   * @param pincodeData the pincode data
   */
  getSepratedPincodeData(pincodeData: any) {
    if (pincodeData) {
      this.owenerVehicleDetailsForm.patchValue({
        owner_city: pincodeData.rb_city_name,
        owner_state: pincodeData.rb_state_name,
      });
    }
  }

  getPincodeList() {
    const ownerPincodeControl =
      this.owenerVehicleDetailsForm.get('owner_pincode');

    if (ownerPincodeControl) {
      /**
       * Check if ownerPincodeControl is not null
       */
      this.filteredPincodeList = ownerPincodeControl.valueChanges.pipe(
        debounceTime(300), // Debounce for 300 milliseconds
        distinctUntilChanged(),
        switchMap((value) => {
          /**
           * Check if at least 3 characters are entered
           */
          if (value && value.length >= 3) {
            /**
             * Make API call with the entered value
             */
            return this.apiService.getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${value}&insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }`
            );
          } else {
            /**
             * If less than 3 characters, return an empty array
             */
            return of([]);
          }
        })
      );
    }
  }
  getSalutationType() {
    this.proposerType = sessionStorage.getItem('proposerType');
    this.proposerType == 'individual'
      ? (this.isProposerTrue = true)
      : (this.isProposerTrue = false);
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.salutation}?insurer_code=${
          JSON.parse(this.quoteData)['insurer_code']
        }&is_individual=${this.isProposerTrue}&is_corporate=${!this
          .isProposerTrue}`
      )
      .subscribe((salutation) => {
        this.salutationList = salutation;
        if (salutation.length > 0) {
          this.owenerVehicleDetailsForm
            .get('ownner_salutation_type')
            ?.setValue(salutation[0].rb_salutation);
        }
        if (this.salutationList && this.proposalData) {
          for (let data of this.salutationList) {
            if (
              data?.rb_salutation ===
              this.proposalData?.customer_details?.salutation
            ) {
              this.owenerVehicleDetailsForm.patchValue({
                ownner_salutation_type:
                  this.proposalData?.customer_details?.salutation,
              });
            }
          }
        }
      });
  }
  onEnterKeyPressedForPincode() {
    const vehiclePincodeControl =
      this.owenerVehicleDetailsForm.get('owner_pincode');
    if (vehiclePincodeControl && vehiclePincodeControl.valid) {
      const enteredPincode = vehiclePincodeControl.value;
      this.getSepratedPincodeData(enteredPincode);
    }
  }
  displayPincode(data?: any) {
    if (data != null && data != 'No result found') {
      this.pincodeId = data.rb_pincode;

      return data ? data.rb_pincode : undefined;
    }
  }
  /**
   * Checks the length of a pincode and ensures it meets the minimum length requirement.
   *
   * @param control - The FormControl to be validated.
   * @returns An object containing any validation errors or null if the control is valid.
   */
  pincodeNumberValidator(control: FormControl) {
    if (typeof control.value != 'object' && control.value?.length >= 6) {
      return { validPincode: true };
    }
    return null;
  }
  /**
   * Checks the validity of the GSTIN entered by the user.
   *
   * @param event - The value of the GSTIN entered by the user.
   */
  checkValidGSTIN(event: any) {
    if (
      this.proposalData?.ckyc_details?.document_type == 'pan_number' &&
      event.length >= 15
    ) {
      let stringWithoutFirstTwo = event.substring(2);
      let stringWithoutLastThree = stringWithoutFirstTwo.slice(0, -3);
      if (
        stringWithoutLastThree.toUpperCase() ==
        this.proposalData?.ckyc_details?.document_number
      ) {
        this.owenerVehicleDetailsForm.get('owner_gstin')?.setErrors(null);
      } else {
        this.owenerVehicleDetailsForm
          .get('owner_gstin')
          ?.setErrors({ validGSTNumber: true });
      }
    }
  }
  updateMaxLengthValidator(maxLength: number,minLength:number) {
    const ownerCommunicationAddressControl = this.owenerVehicleDetailsForm.get(
      'owner_communication_addres'
    );

    if (ownerCommunicationAddressControl) {
      ownerCommunicationAddressControl.setValidators([
        Validators.required,
        Validators.minLength(minLength),
        Validators.maxLength(maxLength),
      ]);

      // Update the control validity status
      ownerCommunicationAddressControl.updateValueAndValidity();
    }
  }
  addAlternateNumberValidator() {
    const alternateControl =
      this.owenerVehicleDetailsForm.get('alternate_number');
    if (alternateControl) {
      alternateControl.setValidators([
        this.sharedDataService.customFieldValidator('additional_contact'),
      ]);
      alternateControl.updateValueAndValidity(); // Re-evaluate the validators
    }
  }

  // createCustomerForWebengage(mobile_number: any, formValues: any) {
  //   this.apiService
  //     .getRequestedResponse(
  //       `${ApiConstants.get_or_create_customer}?phone_number=${mobile_number}&source=Consumer&destination=webengage`
  //     )
  //     .subscribe((res) => {
  //       this.webEngageCustomerDetails = res;
  //       const vehcileType = sessionStorage.getItem('vehicleType');
  //       const proposerType = sessionStorage.getItem('proposerType');
  //       let vehicleDetailsValue = JSON.parse(this.quoteData);
  //       let vehicleOwnerWebengage = {
  //         User_Type: sessionStorage.getItem('partner_code')
  //           ? 'Partner'
  //           : 'Customer',
  //         Motor_Type: vehcileType,
  //         Salutation_type: formValues?.ownner_salutation_type,
  //         Owner_Full_Name: 'Yes',
  //         Contact_Number: 'Yes',
  //         Email: 'Yes',
  //         Occupation_type: formValues?.ownner_occupation_type,
  //         GSTIN: formValues?.owner_gstin,
  //         Additional_contact_number: `+91${formValues?.additional_contact}`,
  //         Gender: formValues?.owner_gender,
  //         Matrital_Status: formValues?.marital_status,
  //         Insurer_Name: vehicleDetailsValue?.insurer_name,
  //         Total_IDV: vehicleDetailsValue?.premium_details?.idv,
  //         Total_Premium: vehicleDetailsValue?.premium_details?.gross_premium,
  //         Insurer_Logo: vehicleDetailsValue?.insurer_logo,
  //         Product_id: vehicleDetailsValue?.quote_id,
  //         Customer_id: this.webEngageCustomerDetails.customer_id,
  //         Perform_by: sessionStorage.getItem('partner_code')
  //           ? 'Partner'
  //           : 'Customer',
  //         Partner_Name:
  //           sessionStorage.getItem('first_name') != null
  //             ? `${sessionStorage.getItem(
  //                 'first_name'
  //               )} ${sessionStorage.getItem(
  //                 'middle_name'
  //               )} ${sessionStorage.getItem('last_name')}`
  //             : '',
  //         Partner_id: sessionStorage.getItem('partner_code'),
  //       };
  //       const filteredData = Object.fromEntries(
  //         Object.entries(vehicleOwnerWebengage).filter(([key, value]) => {
  //           if (value == null || value === '') {
  //             return false;
  //           }
  //           return true;
  //         })
  //       );
  //       webengage.track('Motor_Owner_details_Submitted', filteredData);
  //     });
  // }
}
