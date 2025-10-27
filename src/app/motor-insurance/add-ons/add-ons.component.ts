import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiConstants } from 'src/app/api.constant';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { take } from 'rxjs';
declare const webengage: any;
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
  selectedItem: any;
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
  inputFlagIndex: any[] = [];
  inputFieldIndex: number[] = [];
  multiCheckbox: any[] = [];
  multiCheckboxField: any[] = [];
  multiCheckboxFlagIndex: any[] = [];
  subCheckBox: any[] = [];
  dropDownIndex: any[] = [];
  dropDownFieldIndex: any[] = [];
  tabIndex: any[] = [];
  tabFlagIndex: any[] = [];
  radioIndex: any[] = [];
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
  selectedVoluntryValue: any;
  selectedAddOnsValue: any;
  getAddonValueList: any = [];
  getAddonValueData: any = [];
  addonsValue: any;
  selectedAddOns: any;
  isInputBox: boolean = false;
  ischeckInput: boolean = false;
  isMultiCheckbox: boolean = false;
  isTab: boolean = false;
  isMobileView = false;
  multipCheckboxName: any = [];
  // isPageRefresh = true;
  addMultiCheckboxValue: any = [];
  loader: boolean = false;
  proposalOnInit: boolean = false;
  selectedVehicleType: any;
  traceIdResponse: any;
  userType: any;
  updateButtonIdv = true;
  idvAmount: any;
  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<AddOnsComponent>
  ) {}

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('partnerCodeTraceId')
      ? sessionStorage.getItem('partnerCodeTraceId')
      : null;

    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.sharedDataService.traceIdVehicleType.subscribe((cardData) => {
      if (cardData != null) {
        this.vehicleData = cardData;
        this.parsedVehicleData = JSON.parse(this.vehicleData);
        this.getAddonList(
          this.vehicleTypeValue,
          this.parsedVehicleData?.policy_expiry
        );
      }
    });

    this.addonsValue = sessionStorage.getItem('selectedAddons');
    if (this.addonsValue == 'undefined') {
      this.selectedAddOns = '';
    } else {
      this.selectedAddOns = JSON.parse(this.addonsValue);
    }

    if (this.selectedAddOns) {
      this.showUpdateButton = true;
      this.clearAllButton = true;
      this.showButtons = true;
    }

    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      if (this.enableAddOns) {
        this.enableAddOns = false;
        this.selectedAddOnsValue = idvData;

        this.addonsValue = sessionStorage.getItem('selectedAddons');
        if (this.addonsValue == 'undefined') {
          this.selectedAddOns = '';
        } else {
          this.selectedAddOns = JSON.parse(this.addonsValue);
          if (this.selectedAddOns?.length > 0) {
            this.clearAllButton = true;
          }
        }

        if (this.selectedAddOns) {
          this.selectedCheckedArray = this.selectedAddOns;

          for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
            for (
              let k = 0;
              k <= this.addOnsArray[i].fe_template.length - 1;
              k++
            ) {
              for (let key of this.selectedAddOns) {
                const keys = Object.keys(key);
                const value = Object.values(key);
                if (keys[0] == this.addOnsArray[i].fe_template[k].rb_code) {
                  this.addOnsArray[i].fe_template[k].checked = true;
                  this.checkBoxValueArray.push(
                    this.addOnsArray[i].fe_template[k].name
                  );
                  if (
                    this.addOnsArray[i].fe_template[k]?.addOnsValue == '' &&
                    value[0]
                  ) {
                    this.addOnsArray[i].fe_template[k].addOnsValue = value[0];
                  }
                  if (
                    this.addOnsArray[i].fe_template[k]?.next_type == 'int_input'
                  ) {
                    this.inputFieldIndex[k] = k;
                  }
                  if (this.addOnsArray[i].fe_template[k]?.next_type == 'tab') {
                    this.tabIndex[k] = k;
                    this.selectedVoluntryValue = value[0];
                  }
                  if (
                    this.addOnsArray[i].fe_template[k]?.next_type == 'dropdown'
                  ) {
                    this.dropDownFieldIndex[k] = k;
                  }
                  if (
                    this.addOnsArray[i].fe_template[k]?.next_type ==
                    'multi_checkbox'
                  ) {
                    this.multiCheckboxField[k] = k;
                    this.addMultiCheckboxValue = [];

                    this.addMultiCheckboxValue.push(...value);
                    let modifiedMultipleCheckbox =
                      this.addMultiCheckboxValue[0].split(',');
                    if (modifiedMultipleCheckbox?.length > 0) {
                      for (
                        let l = 0;
                        l <= modifiedMultipleCheckbox.length - 1;
                        l++
                      ) {
                        for (
                          let m = 0;
                          m <=
                          this.addOnsArray[i].fe_template[k]
                            ?.modifiedMultiCheckList.length -
                            1;
                          m++
                        ) {
                          if (
                            this.addOnsArray[i].fe_template[k]
                              ?.modifiedMultiCheckList[m].name ==
                            modifiedMultipleCheckbox[l]
                          ) {
                            this.addOnsArray[i].fe_template[
                              k
                            ].modifiedMultiCheckList[m].multiChecked = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    this.sharedDataService.disableInitiatesQuotes.subscribe((idvData) => {
      this.enableAddOns = true;
    });

    this.sharedDataService.getIdvValue.subscribe((idvData) => {
      if (idvData && !this.isMobileView) {
        this.idvAmount = idvData;
        let allIdvData = JSON.parse(this.idvAmount);
        this.updateButtonIdv = allIdvData.buttonData;
        let idvObject = {
          minIdv: '',
          maxIdv: '',
          chooseIdv: allIdvData.chooseIdv,
        };
        // if (!allIdvData.buttonData) {
        let chooseIdvValue = sessionStorage.setItem(
          'idvData',
          JSON.stringify(idvObject)
        );
        // }
      }
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
      this.selectedVoluntryValue = '';
      this.addonsValue = sessionStorage.getItem('selectedAddons');
      if (this.addonsValue == 'undefined') {
        this.selectedAddOns = '';
      } else {
        this.selectedAddOns = JSON.parse(this.addonsValue);
      }

      if (this.selectedAddOns) {
        sessionStorage.removeItem('selectedAddons');
      }
    });

    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.subCheckBox = [];
      this.selectedCheckedArray = [];
      this.selectAddOnsOnly = [];
      this.checkBoxValueArray = [];
      this.inputValues = [];
      this.showButtons = false;
      this.showUpdateButton = false;
      this.clearAllButton = false;
      this.selected_addons = {};
      this.addonsValue = sessionStorage.getItem('selectedAddons');
      if (this.addonsValue == 'undefined') {
        this.selectedAddOns = '';
      } else {
        this.selectedAddOns = JSON.parse(this.addonsValue);
      }

      if (this.selectedAddOns) {
        sessionStorage.removeItem('selectedAddons');
      }
    });
    this.proposalOnInit = true;

    this.sharedDataService.addOnsBaseProposalType.subscribe((cardData) => {
      if (!this.proposalOnInit) {
        this.subCheckBox = [];
        this.selectedCheckedArray = [];
        this.multipCheckboxName = [];
        this.selectAddOnsOnly = [];
        this.checkBoxValueArray = [];
        this.inputValues = [];
        this.showButtons = false;
        this.showUpdateButton = false;
        this.clearAllButton = false;
        this.selected_addons = {};
        this.selectedVoluntryValue = '';
        this.multiCheckboxField = [];
      }
      this.proposalOnInit = false;
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);
      if (this.vehicleData != null) {
        this.getAddonList(
          this.vehicleTypeValue,
          this.parsedVehicleData?.policy_expiry
        );
      }
    });
    if (window.innerWidth <= 999) {
      this.getAddonList(
        this.vehicleTypeValue,
        this.parsedVehicleData?.policy_expiry
      );
      this.isMobileView = true;
    }
    this.sharedDataService.getTraceIdApiResponse.subscribe((res: any) => {
      this.traceIdResponse = res;
    });
  }

  /**
   * this fucntion use for clear all check box to uncheck
   */
  clearAllChecked() {
    // this.sharedDataService.sendCarLoaderMessage(0);
    const token = sessionStorage.getItem('token');

    webengage.track('Motor_Filter_Cleared', {
      User_Type: token != null ? 'Partner' : 'Customer',
      Motor_Type: this.vehicleTypeValue,
    });
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
    this.multipCheckboxName = [];
    this.selectAddOnsOnly = [];
    this.checkBoxValueArray = [];
    this.inputValues = [];
    this.showButtons = false;
    this.showUpdateButton = false;
    this.clearAllButton = false;
    this.selected_addons = {};
    this.multiCheckboxField = [];
    this.selectedVoluntryValue = '';

    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    let addOnsValue = sessionStorage.getItem('selectedAddons');
    if (addOnsValue != null && addOnsValue != 'null') {
      if (addOnsValue) {
        sessionStorage.removeItem('selectedAddons');
        this.sharedDataService.disableInitiatesQuotesBase(this.enableAddOns);
      }
      if (this.updateAddOns) {
        if (this.registrationNumber) {
          // this.sharedDataService.vehicleMMVDetails(
          //   productTypeValue,
          //   mmvFormData,
          //   'registrationNumber',
          //   this.selected_addons
          // );
          this.sharedDataService.initiate_Quotes_APi(
            JSON.parse(mmvFormData || '{}')
          );
        } else {
          // this.sharedDataService.vehicleMMVDetails(
          //   productTypeValue,
          //   mmvFormData,
          //   'mmvQuotes',
          //   this.selected_addons
          // );
          this.sharedDataService.initiate_Quotes_APi(
            JSON.parse(mmvFormData || '{}')
          );
        }
        this.sharedDataService.selectedADDOns(this.selectAddOnsOnly);
        this.enableAddOns = true;
      } else {
        // this.sharedDataService.vehicleMMVDetails(
        //   productTypeValue,
        //   mmvFormData,
        //   'mmvQuotes',
        //   this.selected_addons
        // );
        this.sharedDataService.initiate_Quotes_APi(
          JSON.parse(mmvFormData || '{}')
        );
      }
    }
  }
  @Output() checkBoxValue = new EventEmitter<any>();
  onCheckboxSelect(
    event: any,
    value: any,
    type: any,
    index: number,
    displayName: any,
    rb_code: any,
    tagType: any = null,
    addons?: any
  ) {
    //
    let checkboxValue;
    checkboxValue = event.checked;
    this.addInputValidation(checkboxValue, type, index, tagType);
    if (event.checked) {
      if (tagType == 'radio') {
        let readionValue = addons?.fe_template.findIndex(
          (item: { checked: any }) => item.checked
        );
        if (readionValue != -1) {
          let selectedData = this.selectedCheckedArray.findIndex(
            (item: any) => item?.type === 'radio'
          );
          if (selectedData != -1) {
            this.selectedCheckedArray.splice(selectedData, 1);
            this.checkBoxValueArray.splice(selectedData, 1);
          }
        }
      }
      this.checkBoxValueArray.push(value);
      this.dynamicObject = {};
      var keyName = rb_code;
      var keyValue = 0;

      this.dynamicObject[keyName] = keyValue;
      this.dynamicObject['showAddOns'] = value;
      this.dynamicObject['type'] = tagType;

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
          this.multiCheckboxField = [];
          this.multipCheckboxName = [];
          this.subCheckBox = [];
        } else {
          this.addonsValue = sessionStorage.getItem('selectedAddons');
          if (this.addonsValue == 'undefined' || this.addonsValue == null) {
            this.selectedAddOns = '';
            this.multiCheckboxField = [];
            this.multipCheckboxName = [];
            this.subCheckBox = [];
          } else {
            this.selectedAddOns = JSON.parse(this.addonsValue);
          }
          if (this.selectedAddOns.length > 0) {
            this.showUpdateButton = true;
            this.clearAllButton = true;
            this.showButtons = true;
          } else {
            this.showUpdateButton = false;
            this.clearAllButton = false;
            this.showButtons = false;
          }
        }
      } else {
        this.showButtons = true;
        this.showUpdateButton = true;
        this.clearAllButton = true;
        let multiCheckValue = this.selectedCheckedArray.findIndex((i: any) => {
          if (i.showAddOns == 'Geographical Extension') {
            return i;
          }
        });

        if (multiCheckValue == -1) {
          this.multiCheckboxField = [];
          this.multipCheckboxName = [];
          this.subCheckBox = [];
        }
      }
    }

    let addOnValue = this.selectedCheckedArray;
    const token = sessionStorage.getItem('token');
    webengage.track('Motor_Add_Ons_Clicked', {
      Option_Selected: addOnValue,
      User_Type: token != null ? 'Partner' : 'Customer',
      Motor_Type: this.vehicleTypeValue,
      Partner_id: sessionStorage.getItem('partner_code'),
    });
  }
  update() {
    if (!this.enableAddOns) {
      const token = sessionStorage.getItem('token');
      // this.sharedDataService.sendCarLoaderMessage(0);

      this.selected_addons = {};

      for (let key of this.selectedCheckedArray) {
        const keys = Object.keys(key);
        let variableValue = keys[0];
        this.selected_addons[variableValue] = key[variableValue];
      }
      sessionStorage.setItem(
        'selectedAddons',
        JSON.stringify(this.selectedCheckedArray)
      );
      if (this.idvAmount) {
        let idvValue = JSON.parse(this.idvAmount);
        let userDetails = JSON.parse(this.userType);
        webengage.track('IDV_filter_Applied', {
          User_Type: userDetails?.partner_code ? 'Partner' : 'Customer',
          Motor_Type: this.vehicleTypeValue,
          IDV_Value: idvValue.chooseIdv,
          Partner_id: sessionStorage.getItem('partner_code'),
        });
      }

      let productTypeValue = sessionStorage.getItem('productType');
      let mmvFormData = sessionStorage.getItem('mmv_data');

      this.registrationNumber = sessionStorage.getItem('registrationNumber');
      const count = Object.keys(this.selected_addons).length;
      let sliderIdv = sessionStorage.getItem('sliderIdvValue');
      let getChangesThrough = sessionStorage.getItem('throughChange');
      if (sliderIdv && this.idvAmount == undefined) {
        let idvObject = {
          minIdv: '',
          maxIdv: '',
          chooseIdv: sliderIdv,
        };
        let chooseIdvValue = sessionStorage.setItem(
          'idvData',
          JSON.stringify(idvObject)
        );
      } else if (getChangesThrough == 'input') {
        let allIdvData = JSON.parse(this.idvAmount || '{}');
        let idvObject = {
          minIdv: '',
          maxIdv: '',
          chooseIdv: allIdvData.chooseIdv,
        };
        let chooseIdvValue = sessionStorage.setItem(
          'idvData',
          JSON.stringify(idvObject)
        );
      } else if (getChangesThrough == 'slider') {
        let idvObject = {
          minIdv: '',
          maxIdv: '',
          chooseIdv: sliderIdv,
        };
        let idvData = {
          chooseIdv: sliderIdv,
          buttonData: false,
        };
        this.idvAmount = JSON.stringify(idvData);
        let chooseIdvValue = sessionStorage.setItem(
          'idvData',
          JSON.stringify(idvObject)
        );
      }

      if (count != 0 || this.idvAmount || sliderIdv) {
        this.sharedDataService.initiate_Quotes_APi(
          JSON.parse(mmvFormData || '{}')
        );

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

        this.sharedDataService.disableInitiatesQuotesBase(this.enableAddOns);
      }
      webengage.track('Motor_Add_Ons_Applied', {
        User_Type: token != null ? 'Partner' : 'Customer',
        Motor_Type: this.vehicleTypeValue,
        Add_Ons: this.selectedCheckedArray,
        Partner_id: sessionStorage.getItem('partner_code'),
      });
    }
  }
  /**
   *
   * This (getAddonList) hit the get api and show the addons list in Quotes page
   */
  getAddonList(vehicleTypeValue: string, policy_expiry: any) {
    this.loader = true;
    let bussinessType = sessionStorage.getItem('newVehicleType');
    let proposalType = sessionStorage.getItem('proposerType');
    let productType = sessionStorage.getItem('productType');
    let diesel;
    if (this.parsedVehicleData?.vehicle_fuel == 'DIESEL') {
      diesel = true;
    } else {
      diesel = false;
    }
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    let vehicleTypeData;
    if (this.vehicleTypeValue == 'commercial_vehicle') {
      vehicleTypeData =
        this.traceIdResponse?.quote_data?.quotes_data?.cv_vehicle_type
          ?.vehicle_type;
    } else {
      vehicleTypeData = this.vehicleTypeValue;
    }
    if (bussinessType != null) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants?.addonsApi()}?vehicle_type=${vehicleTypeData}&business_type=${bussinessType}&proposer_type=${proposalType}&product_type=${productType}&in_diesel=${diesel}`
        )
        .subscribe((res: any) => {
          this.addonList = res;
          this.modifiedMultiCheckArray = [];
          this.loader = false;
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
          this.addValidation();
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

          if (window.innerWidth <= 999) {
            this.addonsValue = sessionStorage.getItem('selectedAddons');
            if (this.addonsValue == 'undefined') {
              this.selectedAddOns = '';
              this.selectedCheckedArray = [];
            } else {
              this.selectedAddOns = JSON.parse(this.addonsValue);
              if (this.selectedAddOns) {
                this.clearAllButton = true;
              }
            }

            if (this.selectedAddOns) {
              this.selectedCheckedArray = this.selectedAddOns;

              for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
                for (
                  let k = 0;
                  k <= this.addOnsArray[i].fe_template.length - 1;
                  k++
                ) {
                  for (let key of this.selectedAddOns) {
                    const keys = Object.keys(key);
                    const value = Object.values(key);
                    if (keys[0] == this.addOnsArray[i].fe_template[k].rb_code) {
                      this.addOnsArray[i].fe_template[k].checked = true;
                      this.checkBoxValueArray.push(
                        this.addOnsArray[i].fe_template[k].name
                      );
                      if (
                        this.addOnsArray[i].fe_template[k]?.addOnsValue == '' &&
                        value[0]
                      ) {
                        this.addOnsArray[i].fe_template[k].addOnsValue =
                          value[0];
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type ==
                        'int_input'
                      ) {
                        this.inputFieldIndex[k] = k;
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type == 'tab'
                      ) {
                        this.tabIndex[k] = k;
                        this.selectedVoluntryValue = value[0];
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type ==
                        'dropdown'
                      ) {
                        this.dropDownFieldIndex[k] = k;
                      }
                    }
                  }
                }
              }
            }

            // responsive selected addons data patching

            if (this.selectedAddOns) {
              this.selectedCheckedArray = this.selectedAddOns;

              for (let i = 0; i <= this.addOnsArray.length - 1; i++) {
                for (
                  let k = 0;
                  k <= this.addOnsArray[i].fe_template.length - 1;
                  k++
                ) {
                  for (let key of this.selectedAddOns) {
                    const keys = Object.keys(key);
                    const value = Object.values(key);
                    if (keys[0] == this.addOnsArray[i].fe_template[k].rb_code) {
                      this.addOnsArray[i].fe_template[k].checked = true;
                      this.checkBoxValueArray.push(
                        this.addOnsArray[i].fe_template[k].name
                      );
                      if (
                        this.addOnsArray[i].fe_template[k]?.addOnsValue == '' &&
                        value[0]
                      ) {
                        this.addOnsArray[i].fe_template[k].addOnsValue =
                          value[0];
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type ==
                        'int_input'
                      ) {
                        this.inputFieldIndex[k] = k;
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type == 'tab'
                      ) {
                        this.tabIndex[k] = k;
                        this.selectedVoluntryValue = value[0];
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type ==
                        'dropdown'
                      ) {
                        this.dropDownFieldIndex[k] = k;
                      }
                      if (
                        this.addOnsArray[i].fe_template[k]?.next_type ==
                        'multi_checkbox'
                      ) {
                        this.multiCheckboxField[k] = k;
                        this.addMultiCheckboxValue = [];

                        this.addMultiCheckboxValue.push(...value);
                        let modifiedMultipleCheckbox =
                          this.addMultiCheckboxValue[0].split(',');
                        if (modifiedMultipleCheckbox?.length > 0) {
                          for (
                            let l = 0;
                            l <= modifiedMultipleCheckbox.length - 1;
                            l++
                          ) {
                            for (
                              let m = 0;
                              m <=
                              this.addOnsArray[i].fe_template[k]
                                ?.modifiedMultiCheckList.length -
                                1;
                              m++
                            ) {
                              if (
                                this.addOnsArray[i].fe_template[k]
                                  ?.modifiedMultiCheckList[m].name ==
                                modifiedMultipleCheckbox[l]
                              ) {
                                this.addOnsArray[i].fe_template[
                                  k
                                ].modifiedMultiCheckList[m].multiChecked = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
    }
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
  /**
   * This function is used to set the selected value for the add-on.
   * @param amount - The selected value for the add-on.
   * @param name - The name of the add-on.
   * @param rb_code - The code of the add-on.
   */

  selectVoluntry(amount: any, name: any, rb_code: any, index: any): void {
    this.selectedVoluntryValue = amount;
    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      this.tabFlagIndex[index] = false;
      this.checkTab(this.tabFlagIndex);
      if (keys[0] == rb_code) {
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
    rb_code?: any,
    multiCheckbox_name?: any
  ) {
    this.showButtons = true;
    if (event != '' && type == 'int_input') {
      this.inputFlagIndex[index] = false;
      this.checkInputBox(this.inputFlagIndex);
      delete this.inputTagIndex[index];
    } else if (event == '' && type == 'int_input') {
      this.inputFlagIndex[index] = true;
      this.checkInputBox(this.inputFlagIndex);
      this.inputTagIndex[index] = index;
    } else if (event?.checked && type == 'multi_checkbox') {
      this.multiCheckboxFlagIndex[index] = false;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      this.subCheckBox.push(event?.source?.id);
      this.multipCheckboxName.push(multiCheckbox_name);
      delete this.multiCheckbox[index];
    } else if (!event?.checked && type == 'multi_checkbox') {
      /**
       * Find the index of the object that meets the condition
       */
      if (this.multipCheckboxName.length > 0) {
        const index = this.multipCheckboxName.indexOf(multiCheckbox_name);
        if (index !== -1) {
          this.multipCheckboxName.splice(index, 1);
        }
      }

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
        // if (index != -1) {
        this.multiCheckboxFlagIndex[index] = true;
        this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
        this.multiCheckbox[index] = index;
      }
    } else if (event != '' && type == 'dropdown') {
      this.dropDownValue = event;
      this.multiCheckboxFlagIndex[index] = false;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      delete this.dropDownIndex[index];
    } else if (event == 0 && type == 'dropdown') {
      this.dropDownIndex[index] = index;
    }

    for (let key of this.selectedCheckedArray) {
      const keys = Object.keys(key);
      if (keys[0] == rb_code) {
        if (typeof event != 'object') {
          key[keys[0]] = JSON.parse(event);
        }
        if (type == 'multi_checkbox') {
          key[keys[0]] = this.multipCheckboxName.join(',');
        }
      }
    }
    // console.log(this.selectedCheckedArray);
    // console.log(this.multipCheckboxName);
  }
  /**
   *  add ons list add validation on based on tag
   */
  addInputValidation(
    isChecked: boolean,
    type: any,
    index: number,
    tagType: any
  ) {
    if (isChecked && type == 'int_input') {
      this.inputFlagIndex[index] = true;
      this.checkInputBox(this.inputFlagIndex);
      this.inputFieldIndex[index] = index;
    } else if (!isChecked && type == 'int_input') {
      this.inputFlagIndex[index] = false;
      this.checkInputBox(this.inputFlagIndex);
      delete this.inputTagIndex[index];
      delete this.inputFieldIndex[index];
    } else if (isChecked && type == 'multi_checkbox') {
      this.multiCheckboxFlagIndex[index] = true;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      this.multiCheckboxField[index] = index;
    } else if (!isChecked && type == 'multi_checkbox') {
      this.multiCheckboxFlagIndex[index] = false;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      delete this.multiCheckbox[index];
      delete this.multiCheckboxField[index];
    } else if (isChecked && type == 'dropdown') {
      this.multiCheckboxFlagIndex[index] = true;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      this.dropDownFieldIndex[index] = index;
    } else if (!isChecked && type == 'dropdown') {
      this.multiCheckboxFlagIndex[index] = false;
      this.checkMultiCheckBox(this.multiCheckboxFlagIndex);
      delete this.dropDownIndex[index];
      delete this.dropDownFieldIndex[index];
    }
    if (isChecked && type == 'tab') {
      this.tabFlagIndex[index] = true;
      this.checkTab(this.tabFlagIndex);
      this.tabIndex[index] = index;
      this.tabIndex[index] = index;
    } else if (!isChecked && type == 'tab') {
      this.tabFlagIndex[index] = false;
      this.checkTab(this.tabFlagIndex);
      delete this.tabIndex[index];
      delete this.tabIndex[index];
    }
    if (isChecked && tagType == 'radio') {
      this.radioIndex[index] = index;
      for (const addons of this.addOnsArray) {
        if (addons['rb_type'] == 'cpa') {
          for (const key in addons?.fe_template) {
            if (addons?.fe_template.length > 1) {
              if (index == 0) {
                if (addons.fe_template.hasOwnProperty(key)) {
                  addons.fe_template[1].checked = false;
                }
              } else if (index == 1) {
                if (addons.fe_template.hasOwnProperty(0)) {
                  addons.fe_template[0].checked = false;
                }
              }
            } else {
              if (index == 0) {
                if (addons.fe_template.hasOwnProperty(key)) {
                  addons.fe_template[0].checked = isChecked;
                }
              }
            }
          }

          console.log(addons?.fe_template);
        }
      }
    }
  }
  /**
   *  add ons list add flag on based on tag
   */
  addValidation() {
    for (const addons of this.addOnsArray) {
      for (const key in addons?.fe_template) {
        if (addons?.fe_template[key]['next_type'] == 'int_input') {
          this.inputFlagIndex.push(false);
        }
        if (
          addons?.fe_template[key]['next_type'] == 'dropdown' ||
          addons?.fe_template[key]['next_type'] == 'multi_checkbox'
        ) {
          this.multiCheckboxFlagIndex.push(false);
        }
        if (addons?.fe_template[key]['next_type'] == 'tab') {
          this.tabFlagIndex.push(false);
        }
      }
    }
  }
  /**
   * This function is used to check if the input box is active or not.
   * @param flagArray - The array of boolean values to check.
   */
  checkInputBox(flagArray: any) {
    if (flagArray.indexOf(true) !== -1) {
      this.ischeckInput = true;
    } else {
      this.ischeckInput = false;
    }
  }
  /**
   * This function is used to check if the multi-checkbox is active or not.
   * @param flagArray - The array of boolean values to check.
   */
  checkMultiCheckBox(flagArray: any) {
    if (flagArray.indexOf(true) !== -1) {
      this.isMultiCheckbox = true;
    } else {
      this.isMultiCheckbox = false;
    }
  }
  /**
   * This function is used to check if the tab is active or not.
   * @param flagArray - The array of boolean values to check.
   */
  checkTab(flagArray: any) {
    if (flagArray.indexOf(true) !== -1) {
      this.isTab = true;
    } else {
      this.isTab = false;
    }
  }
}
