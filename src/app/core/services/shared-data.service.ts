import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();
  getSelectedvehicle: Subject<any> = new Subject();
  getSelectedVehicleType :Subject<any> = new Subject();
  constructor() {}

  sendVehicleEditData(data: any) {
    this.getVehicleDetails.next(data);
  }
   /**
    * 
    * @param data send vehicle type data for the vehicle search 
    */
  selectedvehicle(data:any){
    this.getSelectedvehicle.next(data);
  }

     /**
    * 
    * @param data send vehicle type data for the vehicle search 
    */
     selectedVehicleType(data:any){
      this.getSelectedVehicleType.next(data);
    }
  /**
   *  this method use set data in local storage
   */ 
  setDataLocalStorage(type:string='',key:string='',value:string=''){
    let getItemValue
    switch(type) {
      case 'setItem':
        localStorage.setItem(key,value);
        break;
      case 'getItem':
        getItemValue=localStorage.getItem(key);
        break;
      case 'removeItem':
        localStorage.removeItem(key);
      break;
      default:
        localStorage.clear();
    }
    return getItemValue
  }
}
