import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationNumberComponent } from './components/form_fields/registration-number/registration-number.component';
import { VehicleTypeComponent } from './components/form_fields/vehicle-type/vehicle-type.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleComponent } from './components/form_fields/vehicle/vehicle.component';
import { RTOComponent } from './components/form_fields/rto/rto.component';
import { RegistrationYearComponent } from './components/form_fields/registration-year/registration-year.component';
import { PreviousInsurerComponent } from './components/form_fields/previous-insurer/previous-insurer.component';
import { PolicyExpiredDateComponent } from './components/form_fields/policy-expired-date/policy-expired-date.component';
import { SuccessDialogComponent } from './components/dialog-components/success-dialog/success-dialog.component';
import { FailureDialogComponent } from './components/dialog-components/failure-dialog/failure-dialog.component';
import { MultiSelectDropDownComponent } from './components/form_fields/multi-select-drop-down/multi-select-drop-down.component';
import { MaterialModule } from './material/material.module';
import { AmountFormatPipe } from './pipe/amount-format.pipe';
import { RegistrationDateComponent } from './components/form_fields/registration-date/registration-date.component';
import { ManufactureDateComponent } from './components/form_fields/manufacture-date/manufacture-date.component';
import { ErrorDialogComponent } from './components/dialog-components/error-dialog/error-dialog.component';
import { PremiumBreakupComponent } from './components/dialog-components/premium-breakup/premium-breakup.component';
import { WaitCkycVerificationDialogComponent } from './components/dialog-components/wait-ckyc-verification-dialog/wait-ckyc-verification-dialog.component';
import { OtpComponent } from './components/dialog-components/otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { OwnerFullNameComponent } from './components/form_fields/owner-full-name/owner-full-name.component';
import { OwnerContactComponent } from './components/form_fields/owner-contact/owner-contact.component';
import { OwnerEmailComponent } from './components/form_fields/owner-email/owner-email.component';
import { OwnerGenderComponent } from './components/form_fields/owner-gender/owner-gender.component';
import { OwnerCommunicationAddressComponent } from './components/form_fields/owner-communication-address/owner-communication-address.component';
import { OwnerCityComponent } from './components/form_fields/owner-city/owner-city.component';
import { OwnerStateComponent } from './components/form_fields/owner-state/owner-state.component';
import { UploadDocumentComponent } from './components/form_fields/upload-document/upload-document.component';
import { EngineNumberComponent } from './components/form_fields/engine-number/engine-number.component';
import { ChasisNumberComponent } from './chasis-number/chasis-number.component';
import { ShareQuotesComponent } from './components/dialog-components/share-quotes/share-quotes.component';
import { VehicleRegistrationAddressComponent } from './components/form_fields/vehicle-registration-address/vehicle-registration-address.component';
import { NoSpecialCharacterWithSpaceDirective } from './directives/no-special-character-with-space.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { AlphabetOnlyDirective } from './directives/alphabet-only.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { NumberWithDecimalDirective } from './directives/number-with-decimal.directive';
import { ProposalShareComponent } from './components/proposal-share/proposal-share.component';
import { CommaFormatterDirective } from './directives/comma-formatter.directive';
import { NotCertifiedComponent } from './components/dialog-components/not-certified/not-certified.component';
import { NumberFormatPipe } from './pipe/number-format.pipe';
import { SpecialCharcaterExceptAtDirective } from './directives/special-charcater-except-at.directive';
import { SpecialCharacterNotAllowedDirective } from './directives/special-character-not-allowed.directive';
import { DateFormatDirective } from './directives/date-format.directive';
import { NoSpaceDirective } from './directives/no-space.directive';
import { RegistrationNumberDirective } from './directives/registration-number.directive';
import { MmYyyyformatDirective } from './directives/mm-yyyyformat.directive';
import { TermsComponent } from './components/dialog-components/terms/terms.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SnackbarComponent } from './components/dialog-components/snackbar/snackbar.component';
import { RemoveZeroFromStartingDirective } from './directives/remove-zero-from-starting.directive';
import { NotAllowDotDirective } from './directives/not-allow-dot.directive';
import { HelplineNumberComponent } from './components/dialog-components/helpline-number/helpline-number.component';
import { ProposalExpiredComponent } from './components/dialog-components/proposal-expired/proposal-expired.component';
import { CkycDocumentsComponent } from './components/dialog-components/ckyc-documents/ckyc-documents.component';
import { CheckQuotesDialogComponent } from './components/dialog-components/check-quotes-dialog/check-quotes-dialog.component';

@NgModule({
  declarations: [
    RegistrationNumberComponent,
    VehicleTypeComponent,
    VehicleComponent,
    RTOComponent,
    RegistrationYearComponent,
    PreviousInsurerComponent,
    PolicyExpiredDateComponent,
    SuccessDialogComponent,
    FailureDialogComponent,
    MultiSelectDropDownComponent,
    AmountFormatPipe,
    RegistrationDateComponent,
    ManufactureDateComponent,
    ErrorDialogComponent,
    PremiumBreakupComponent,
    WaitCkycVerificationDialogComponent,
    OtpComponent,
    OwnerFullNameComponent,
    OwnerContactComponent,
    OwnerEmailComponent,
    OwnerGenderComponent,
    OwnerCommunicationAddressComponent,
    OwnerCityComponent,
    OwnerStateComponent,
    UploadDocumentComponent,
    EngineNumberComponent,
    ChasisNumberComponent,
    ShareQuotesComponent,
    VehicleRegistrationAddressComponent,
    NoSpecialCharacterWithSpaceDirective,
    NumbersOnlyDirective,
    AlphabetOnlyDirective,
    AlphaNumericDirective,
    NumberWithDecimalDirective,
    ProposalShareComponent,
    CommaFormatterDirective,
    NotCertifiedComponent,
    NumberFormatPipe,
    SpecialCharcaterExceptAtDirective,
    SpecialCharacterNotAllowedDirective,
    DateFormatDirective,
    NoSpaceDirective,
    RegistrationNumberDirective,
    MmYyyyformatDirective,
    TermsComponent,
    ClickOutsideDirective,
    SnackbarComponent,
    RemoveZeroFromStartingDirective,
    NotAllowDotDirective,
    HelplineNumberComponent,
    ProposalExpiredComponent,
    CkycDocumentsComponent,
    CheckQuotesDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgOtpInputModule,
  ],
  exports: [
    VehicleTypeComponent,
    RegistrationNumberComponent,
    VehicleComponent,
    RTOComponent,
    RegistrationYearComponent,
    PreviousInsurerComponent,
    PolicyExpiredDateComponent,
    SuccessDialogComponent,
    FailureDialogComponent,
    MultiSelectDropDownComponent,
    MaterialModule,
    AmountFormatPipe,
    RegistrationDateComponent,
    ManufactureDateComponent,
    OwnerFullNameComponent,
    OwnerContactComponent,
    OwnerEmailComponent,
    OwnerGenderComponent,
    OwnerCommunicationAddressComponent,
    OwnerCityComponent,
    OwnerStateComponent,
    UploadDocumentComponent,
    EngineNumberComponent,
    ChasisNumberComponent,
    VehicleRegistrationAddressComponent,
    NumberFormatPipe,
    NoSpecialCharacterWithSpaceDirective,
    NumbersOnlyDirective,
    AlphabetOnlyDirective,
    AlphaNumericDirective,
    NumberWithDecimalDirective,
    ProposalShareComponent,
    CommaFormatterDirective,
    NotCertifiedComponent,
    NumberFormatPipe,
    SpecialCharcaterExceptAtDirective,
    SpecialCharacterNotAllowedDirective,
    DateFormatDirective,
    MmYyyyformatDirective,
    RemoveZeroFromStartingDirective,
    NotAllowDotDirective,
  ],
})
export class SharedModule {}
