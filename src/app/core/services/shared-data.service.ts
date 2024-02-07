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
}
