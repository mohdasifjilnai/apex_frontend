import { Component, OnInit } from '@angular/core';
import add_ons_list from './add-ons-list.json'
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiConstants } from 'src/app/api.constant';
@Component({
  selector: 'app-add-ons',
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.scss'],
})
export class AddOnsComponent implements OnInit {
  add_ons_list:any=add_ons_list;
  addonList:any;
  constructor(private apiService :ApiService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    let vehicleTypeValue = localStorage.getItem('vehicleType')
    if(vehicleTypeValue){
      this.getAddonList(vehicleTypeValue)
    }
  }

  /**
   * this fucntion use for clear all check box to uncheck
   */ 
  clearAllChecked(): void {
    this.add_ons_list.forEach((item:any) => (item.checked = false));
  }
  /**
   * 
   * This (getAddonList) hit the get api and show the addons list in Quotes page
   */
  getAddonList(vehicleTypeValue:string){
      this.apiService.getRequestedResponse(`${ApiConstants?.addons}?vehicle_type=${vehicleTypeValue}&business_type=saod&proposer_type=individual`)
        .subscribe((res: any) => {
          this.addonList = res
        });

    }
}
