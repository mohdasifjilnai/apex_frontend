import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getVehicleDetails: Subject<any> = new Subject();

  constructor() {}

  sendVehicleEditData(data: any) {
    this.getVehicleDetails.next(data);
  }
}
