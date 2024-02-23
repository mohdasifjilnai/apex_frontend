import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import add_ons_list from './add-ons-list.json';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export class Addon {
  value: any;
  checked: any;
  dataType: any;
}
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
  checkBoxValueArray: any[]=[];
  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<AddOnsComponent>,
  ) {}

  accessories: Addon[] = [
    { value: 'Electrical Accessories', checked: false, dataType: 'number' },
    { value: 'Non-Electrical Accessories', checked: false, dataType: 'number' },
    {
      value: 'External Bi-Fuel Kit CNG/LPG',
      checked: false,
      dataType: 'number',
    },
  ];
  additional: Addon[] = [
    {
      value: 'PA Cover for Additional Paid Driver',
      checked: false,
      dataType: 'dropdown',
    },
    {
      value: 'Unnamed Passenger PA Cover',
      checked: false,
      dataType: 'dropdown',
    },
    { value: 'LL Paid Driver', checked: false, dataType: 'dropdown' },
    { value: 'Geographical Extension', checked: false, dataType: 'checkbox' },
  ];
  discounts: Addon[] = [
    {
      value: 'Vehicle is fitted with ARAI approved Anti-Theft Device',
      checked: false,
      dataType: 'checkbox',
    },
    { value: 'Voluntary Deductible', checked: false, dataType: 'Voluntary' },
    { value: 'TPPD Cover', checked: false, dataType: 'checkbox' },
  ];
  geographical: Addon[] = [
    { value: 'Bangladesh', checked: false, dataType: 'dropdown' },
    { value: 'Bhutan', checked: false, dataType: 'dropdown' },
    { value: 'Maldives', checked: false, dataType: 'dropdown' },
    { value: 'Pakistan', checked: false, dataType: 'checkbox' },
    { value: 'Sri Lanka', checked: false, dataType: 'checkbox' },
  ];
  additionalDropdown: dropdown[] = [
    { value: '10000', viewValue: '10,000' },
    { value: '20000', viewValue: '20,000' },
    { value: '30000', viewValue: '30,000' },
    { value: '40000', viewValue: '40,000' },
    { value: '50000', viewValue: '50,000' },
    { value: '60000', viewValue: '60,000' },
    { value: '70000', viewValue: '70,000' },
    { value: '80000', viewValue: '80,000' },
    { value: '90000', viewValue: '90,000' },
    { value: '100000', viewValue: '1,00,000' },
    { value: '110000', viewValue: '1,10,000' },
    { value: '120000', viewValue: '1,20,000' },
    { value: '130000', viewValue: '1,30,000' },
    { value: '140000', viewValue: '1,40,000' },
    { value: '150000', viewValue: '1,50,000' },
    { value: '160000', viewValue: '1,60,000' },
    { value: '170000', viewValue: '1,70,000' },
    { value: '180000', viewValue: '1,80,000' },
    { value: '190000', viewValue: '1,90,000' },
    { value: '200000', viewValue: '2,00,000' },
  ];
  voluntryAmounts: number[] = [
    2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 22500, 25000,
  ];
  selectedValue: any = '100000';
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
  onCheckboxSelect(event: any,value:any) {
   
    if(event.checked){
      this.checkBoxValueArray.push(value)
      this.checkBoxValue.emit(this.checkBoxValueArray);
    }else{
      const valueToRemove = value;
      this.checkBoxValueArray = this.checkBoxValueArray.filter(item => item !== valueToRemove);
      this.checkBoxValue.emit(this.checkBoxValueArray);
    }
  }
  apply() {
    this.bottomSheetRef.dismiss(this.checkBoxValueArray);
  }
  /**
   *
   * This (getAddonList) hit the get api and show the addons list in Quotes page
   */
  getAddonList(vehicleTypeValue: string) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.addons}?vehicle_type=${vehicleTypeValue}&business_type=saod&proposer_type=individual`
      )
      .subscribe((res: any) => {
        this.addonList = res;
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
}
