import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export class dropdown {
  value: any;
  viewValue: any;
}
@Component({
  selector: 'app-add-ons',
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.scss'],
})
export class AddOnsComponent implements OnInit {
  add_ons_list: any;
  addonList: any;
  AccessoriesChecked: boolean = false;
  checkedValue: any;
  checkBoxValueArray: any[] = [];
  selectedCheckedArray: any = [];
  addOnsArray: any = [];
  filterAddOns: any;
  inputValues: any[] = []; // Initialize an array to store input values
  inputTagIndex: number[] = [];
  inputFieldIndex: number[] = [];
  multiCheckbox: any[] = [];
  multiCheckboxField: any[] = [];
  subCheckBox: any[] = [];
  dropDownIndex: any[] = [];
  dropDownFieldIndex: any[] = [];
  tabIndex: any[] = [];
  dropDownValue: any;
  dynamicObject: any;
  showButtons: boolean = false;
  showUpdateButton = false;
  clearAllButton = false;
  forFetchQuotes: any;
  selected_addons: any;
  vehicleData: any;
  parsedVehicleData: any;
  vehicleTypeValue: any;
  registrationNumber: any;
  modifiedMultiCheckArray: any;
  selectAddOnsOnly: any = [];
  dynamicShowObject: any = [];
  enableAddOns = true;
  updateAddOns = false;

  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<AddOnsComponent>
  ) {}

  ngOnInit(): void {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    // this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
    //   this.vehicleData = cardData;
    //   this.parsedVehicleData = JSON.parse(this.vehicleData);
    //   this.getAddonList(
    //     this.vehicleTypeValue,
    //     this.parsedVehicleData?.policy_expiry
    //   );
    // });

    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      this.enableAddOns = false;
    });

    this.sharedDataService.tabChanges.subscribe((data) => {
      this.subCheckBox = [];
      this.selectedCheckedArray = [];
      this.selectAddOnsOnly = [];
      this.checkBoxValueArray = [];
      this.inputValues = [];
      this.showButtons = false;
      this.showUpdateButton = false;
      this.clearAllButton = false;
      this.selected_addons = {};
    });

    this.sharedDataService.addOnsBaseProposalType.subscribe((cardData) => {
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.getAddonList(
        this.vehicleTypeValue,
        this.parsedVehicleData?.policy_expiry
      );
    });
    if (window.innerWidth <= 999) {
      this.getAddonList(
        this.vehicleTypeValue,
        this.parsedVehicleData?.policy_expiry
      );
    }
  }

  /**
   * this fucntion use for clear all check box to uncheck
   */
  clearAllChecked() {
    for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
      for (let j = 0; j <= this.addOnsArray[i].fe_template.length - 1; j++) {
        this.addOnsArray[i].fe_template[j].checked = false;
        this.addOnsArray[i].fe_template[j].addOnsValue = '';
        if (this.selectedVoluntryValue) {
          this.selectedVoluntryValue = '';
        }
        if (this.addOnsArray[i].fe_template[j].next_type == 'multi_checkbox') {
          for (
            let k = 0;
            k <=
            this.addOnsArray[i].fe_template[j]?.modifiedMultiCheckList.length -
              1;
            k++
          ) {
            this.addOnsArray[i].fe_template[j].modifiedMultiCheckList[
              k
            ].multiChecked = false;
          }
        }
      }
    }
    this.subCheckBox = [];
    this.selectedCheckedArray = [];
    this.selectAddOnsOnly = [];
    this.checkBoxValueArray = [];
    this.inputValues = [];
    this.showButtons = false;
    this.showUpdateButton = false;
    this.clearAllButton = false;
    this.selected_addons = {};

    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    if (this.updateAddOns) {
      if (this.registrationNumber) {
        this.sharedDataService.vehicleMMVDetails(
          productTypeValue,
          mmvFormData,
          'registrationNumber',
          this.selected_addons
        );
      } else {
        this.sharedDataService.vehicleMMVDetails(
          productTypeValue,
          mmvFormData,
          'mmvQuotes',
          this.selected_addons
        );
      }
      this.sharedDataService.selectedADDOns(this.selectAddOnsOnly);
      this.enableAddOns = true;
    }
  }
  @Output() checkBoxValue = new EventEmitter<any>();
  onCheckboxSelect(
    event: any,
    value: any,
    type: any,
    index: number,
    displayName: any,
    rb_code: any
  ) {
    this.addInputValidation(event.checked, type, index);
    if (event.checked) {
      this.checkBoxValueArray.push(value);
      this.dynamicObject = {};

      // Adding dynamic keys to the object
      var keyName = rb_code;
      var keyValue = 0;

      this.dynamicObject[keyName] = keyValue;
      this.dynamicObject['showAddOns'] = value;
      this.selectedCheckedArray.push(this.dynamicObject);
      if (this.checkBoxValueArray.length >= 1) {
        this.showButtons = true;
        this.showUpdateButton = true;
        this.clearAllButton = true;
      }
    } else {
      const valueToRemove = rb_code;
      this.checkBoxValueArray = this.checkBoxValueArray.filter(
        (item) => item !== value
      );

      /**
       * Find the index of the object that meets the condition
       */
      const indexToRemove = this.selectedCheckedArray.findIndex((item: any) => {
        return item.hasOwnProperty(valueToRemove);
      });
      /**
       * Check if the index is found
       */

      if (indexToRemove !== -1) {
        /**
         *  Remove the object at the specified index
         */

        this.selectedCheckedArray.splice(indexToRemove, 1);
      }

      for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
        for (let j = 0; j <= this.addOnsArray[i].fe_template.length - 1; j++) {
          if (this.addOnsArray[i].fe_template[j].rb_code == valueToRemove) {
            this.addOnsArray[i].fe_template[j].addOnsValue = '';
            if (this.selectedVoluntryValue) {
              this.selectedVoluntryValue = '';
            }
            if (
              this.addOnsArray[i].fe_template[j].next_type == 'multi_checkbox'
            ) {
              for (
                let k = 0;
                k <=
                this.addOnsArray[i].fe_template[j]?.modifiedMultiCheckList
                  .length -
                  1;
                k++
              ) {
                this.addOnsArray[i].fe_template[j].modifiedMultiCheckList[
                  k
                ].multiChecked = false;
              }
            }
          }
        }
      }

      if (this.checkBoxValueArray.length == 0) {
        if (this.updateAddOns) {
          this.showButtons = true;
          this.showUpdateButton = true;
          this.clearAllButton = false;
        } else {
          this.showButtons = false;
          this.showUpdateButton = false;
          this.clearAllButton = false;
        }
      } else {
        this.showButtons = true;
        this.showUpdateButton = true;
        this.clearAllButton = true;
      }
    }
  }
  update() {
    this.sharedDataService.sendCarLoaderMessage(0);
    this.forFetchQuotes = sessionStorage.getItem('forQuotesFetchData');
    let sendQuotesVlaue = JSON.parse(this.forFetchQuotes);
    this.selected_addons = {};

    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      let variableValue = keys[0];
      this.selected_addons[variableValue] = key[variableValue];
    }
    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    if (this.registrationNumber) {
      this.sharedDataService.vehicleMMVDetails(
        productTypeValue,
        mmvFormData,
        'registrationNumber',
        this.selected_addons
      );
    } else {
      this.sharedDataService.vehicleMMVDetails(
        productTypeValue,
        mmvFormData,
        'mmvQuotes',
        this.selected_addons
      );
    }
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss(this.checkBoxValueArray);
    }
    this.selectAddOnsOnly = [];
    for (let i = 0; i <= this.selectedCheckedArray.length - 1; i++) {
      this.selectAddOnsOnly.push(this.selectedCheckedArray[i].showAddOns);
    }

    this.sharedDataService.selectedADDOns(this.selectAddOnsOnly);
    this.showButtons = false;
    this.showUpdateButton = true;
    this.clearAllButton = true;
    this.enableAddOns = true;
    this.updateAddOns = true;
    if (this.checkBoxValueArray.length == 0) {
      this.showUpdateButton = false;
      this.clearAllButton = false;
    }
  }
  /**
   *
   * This (getAddonList) hit the get api and show the addons list in Quotes page
   */
  getAddonList(vehicleTypeValue: string, policy_expiry: any) {
    let bussinessType = sessionStorage.getItem('newVehicleType');
    let proposalType = sessionStorage.getItem('proposerType');
    let productType = sessionStorage.getItem('productType');
    let diesel;
    if (this.parsedVehicleData?.vehicle_fuel == 'DIESEL') {
      diesel = true;
    } else {
      diesel = false;
    }
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.addonsApi}?vehicle_type=${vehicleTypeValue}&business_type=${bussinessType}&proposer_type=${proposalType}&product_type=${productType}&in_diesel=${diesel}`
      )
      .subscribe((res: any) => {
        this.addonList = res;
        this.modifiedMultiCheckArray = [];

        this.addOnsArray = [];
        for (let value of this.addonList) {
          const checkIndex = this.addOnsArray.findIndex(
            (type: any) => type['rb_type'] === value['rb_type']
          );
          if (checkIndex === -1) {
            value['fe_template'].checked = false;
            value['fe_template'].addOnsValue = '';
            value['fe_template'].rb_code = value['rb_code'];
            const coversData = {
              rb_type: value['rb_type'],
              fe_template: [value['fe_template']],
              displayName: value['display_name'],
              rb_business_type: value['rb_business_type'],
              rb_id: value['rb_id'],
              rb_name: value['rb_name'],
              rb_product_type: value['rb_product_type'],
              rb_proposer_type: value['rb_proposer_type'],
              rb_vehicle_type: value['rb_vehicle_type'],
            };
            this.addOnsArray.push(coversData);
          } else {
            value['fe_template'].checked = false;
            value['fe_template'].addOnsValue = '';
            value['fe_template'].rb_code = value['rb_code'];
            this.addOnsArray[checkIndex]['fe_template'].push(
              value['fe_template']
            );
          }
        }

        for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
          for (
            let j = 0;
            j <= this.addOnsArray[i].fe_template.length - 1;
            j++
          ) {
            if (
              this.addOnsArray[i].fe_template[j].next_type == 'multi_checkbox'
            ) {
              for (
                let k = 0;
                k <= this.addOnsArray[i].fe_template[j].value.length - 1;
                k++
              ) {
                let modifiedData = {
                  name: this.addOnsArray[i].fe_template[j].value[k],
                  multiChecked: false,
                };
                this.modifiedMultiCheckArray.push(modifiedData);
              }
              this.addOnsArray[i].fe_template[j].modifiedMultiCheckList =
                this.modifiedMultiCheckArray;
            }
          }
        }
      });
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  selectedAccessories: string[] = [];
  onCheckboxChange(event: any, data: any) {
    const value = data.value;

    if (event.checked && !this.selectedAccessories.includes(value)) {
      this.selectedAccessories.push(value);
    } else if (!event.checked && this.selectedAccessories.includes(value)) {
      const index = this.selectedAccessories.indexOf(value);
      this.selectedAccessories.splice(index, 1);
    }
  }

  isChecked(value: string): boolean {
    return this.selectedAccessories.includes(value);
  }

  selectedVoluntryValue: any;
  selectVoluntry(amount: any, name: any): void {
    this.selectedVoluntryValue = amount;

    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      if (keys[0] == name) {
        key[keys[0]] = amount;
      }
    }
  }
  /**
   *  add ons list add/remove validation acording to chnage elements
   */
  onInputChange(
    event: any,
    type: any,
    index: number,
    name?: any,
    rb_code?: any
  ) {
    if (event != '' && type == 'int_input') {
      delete this.inputTagIndex[index];
    } else if (event == '' && type == 'int_input') {
      this.inputTagIndex[index] = index;
    } else if (event?.checked && type == 'multi_checkbox') {
      this.subCheckBox.push(event?.source?.id);
      delete this.multiCheckbox[index];
    } else if (!event?.checked && type == 'multi_checkbox') {
      /**
       * Find the index of the object that meets the condition
       */

      const indexMultiCheckoxRemove = this.subCheckBox.findIndex(
        (item: any) => {
          if (item === event?.source?.id) {
            return item;
          }
        }
      );
      if (indexMultiCheckoxRemove != -1) {
        this.subCheckBox.splice(indexMultiCheckoxRemove, 1);
      }
      if (this.subCheckBox.length == 0) {
        this.multiCheckbox[index] = index;
      }
    } else if (event.value != '' && type == 'dropdown') {
      this.dropDownValue = event;
      delete this.dropDownIndex[index];
    }

    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      if (keys[0] == rb_code) {
        if (typeof event != 'object') {
          key[keys[0]] = JSON.parse(event);
        }
        if (type == 'multi_checkbox') {
          key[keys[0]] = this.subCheckBox.join(',');
        }
      }
    }
  }
  /**
   *  add ons list add validation on based on tag
   */
  addInputValidation(isChecked: boolean, type: any, index: number) {
    if (isChecked && type == 'int_input') {
      this.inputTagIndex[index] = index;
      this.inputFieldIndex[index] = index;
    } else if (!isChecked && type == 'int_input') {
      delete this.inputTagIndex[index];
      delete this.inputFieldIndex[index];
    } else if (isChecked && type == 'multi_checkbox') {
      this.multiCheckbox[index] = index;
      this.multiCheckboxField[index] = index;
    } else if (!isChecked && type == 'multi_checkbox') {
      delete this.multiCheckbox[index];
      delete this.multiCheckboxField[index];
    } else if (isChecked && type == 'dropdown') {
      this.dropDownIndex[index] = index;
      this.dropDownFieldIndex[index] = index;
    } else if (!isChecked && type == 'dropdown') {
      delete this.dropDownIndex[index];
      delete this.dropDownFieldIndex[index];
    }
    if (isChecked && type == 'tab') {
      this.tabIndex[index] = index;
      this.tabIndex[index] = index;
    } else if (!isChecked && type == 'tab') {
      delete this.tabIndex[index];
      delete this.tabIndex[index];
    }
  }
}
