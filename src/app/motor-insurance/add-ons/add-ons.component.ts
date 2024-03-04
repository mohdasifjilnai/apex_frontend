import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import add_ons_list from './add-ons-list.json';
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
  add_ons_list: any = add_ons_list;
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
  forFetchQuotes: any;
  selected_addons: any;

  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<AddOnsComponent>
  ) {}

  ngOnInit(): void {
    let vehicleTypeValue = localStorage.getItem('vehicleType');
    if (vehicleTypeValue) {
      this.getAddonList(vehicleTypeValue);
    }
  }

  /**
   * this fucntion use for clear all check box to uncheck
   */
  clearAllChecked(): void {
    this.add_ons_list.forEach((item: any) => (item.checked = false));
  }
  @Output() checkBoxValue = new EventEmitter<any>();
  onCheckboxSelect(event: any, value: any, type: any, index: number) {
    this.addInputValidation(event.checked, type, index);
    if (event.checked) {
      this.checkBoxValueArray.push(value);
      this.dynamicObject = {};

      // Adding dynamic keys to the object
      var keyName = value;
      var keyValue = 0;
      this.dynamicObject[keyName] = keyValue;
      this.selectedCheckedArray.push(this.dynamicObject);
      if (this.checkBoxValueArray.length >= 1) {
        this.showButtons = true;
      }
      this.checkBoxValue.emit(this.checkBoxValueArray);
    } else {
      const valueToRemove = value;
      this.checkBoxValueArray = this.checkBoxValueArray.filter(
        (item) => item !== valueToRemove
      );
      this.checkBoxValue.emit(this.checkBoxValueArray);
      if (this.checkBoxValueArray.length == 0) {
        this.showButtons = false;
      }
    }
  }
  update() {
    this.forFetchQuotes = sessionStorage.getItem('forQuotesFetchData');
    let sendQuotesVlaue = JSON.parse(this.forFetchQuotes);
    this.selected_addons = {};
    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      let variableValue = keys[0];
      this.selected_addons[variableValue] = key[variableValue];
    }
    sendQuotesVlaue.selected_addons = this.selected_addons;

    this.sharedDataService.getQuotationListing(sendQuotesVlaue, '');
    this.bottomSheetRef.dismiss(this.checkBoxValueArray);
  }
  /**
   *
   * This (getAddonList) hit the get api and show the addons list in Quotes page
   */
  getAddonList(vehicleTypeValue: string) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.addons}?vehicle_type=${vehicleTypeValue}&business_type=new&proposer_type=individual&product_type=bundled`
      )
      .subscribe((res: any) => {
        this.addonList = res;

        this.addOnsArray = [];
        for (let value of this.addonList) {
          const checkIndex = this.addOnsArray.findIndex(
            (type: any) => type['rb_type'] === value['rb_type']
          );
          if (checkIndex === -1) {
            value['fe_template'].checked = false;
            const coversData = {
              rb_type: value['rb_type'],
              fe_template: [value['fe_template']],
            };
            this.addOnsArray.push(coversData);
          } else {
            this.addOnsArray[checkIndex]['fe_template'].push(
              value['fe_template']
            );
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

  selectedVoluntryAmounts: number[] = [];

  selectVoluntry(span: HTMLSpanElement): void {
    const amount = parseInt(span.innerText.substring(1).replace(',', ''), 10);

    if (this.isSelected(amount)) {
      this.selectedVoluntryAmounts = this.selectedVoluntryAmounts.filter(
        (selectedAmount) => selectedAmount !== amount
      );
    } else {
      this.selectedVoluntryAmounts.push(amount);
    }
  }

  isSelected(amount: number): boolean {
    return this.selectedVoluntryAmounts.includes(amount);
  }
  /**
   *  add ons list add/remove validation acording to chnage elements
   */
  onInputChange(event: any, type: any, index: number, name?: any) {
    if (event != '' && type == 'int_input') {
      delete this.inputTagIndex[index];
    } else if (event == '' && type == 'int_input') {
      this.inputTagIndex[index] = index;
    } else if (event?.checked && type == 'multi_chcekbox') {
      this.subCheckBox.push(event?.checked);
      delete this.multiCheckbox[index];
    } else if (!event?.checked && type == 'multi_chcekbox') {
      this.subCheckBox.pop();
      if (this.subCheckBox.length == 0) {
        this.multiCheckbox[index] = index;
      }
    } else if (event.value != '' && type == 'dropdown') {
      this.dropDownValue = event;
      delete this.dropDownIndex[index];
    }

    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      if (keys[0] == name) {
        key[keys[0]] = JSON.parse(event);
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
    } else if (isChecked && type == 'multi_chcekbox') {
      this.multiCheckbox[index] = index;
      this.multiCheckboxField[index] = index;
    } else if (!isChecked && type == 'multi_chcekbox') {
      delete this.multiCheckbox[index];
      delete this.multiCheckboxField[index];
    } else if (isChecked && type == 'dropdown') {
      if (this.dropDownValue == undefined) {
        this.dropDownIndex[index] = index;
        this.dropDownFieldIndex[index] = index;
      }
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
