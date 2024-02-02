import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-vehicle-details-card',
  templateUrl: './vehicle-details-card.component.html',
  styleUrls: ['./vehicle-details-card.component.scss'],
})
export class VehicleDetailsCardComponent implements OnInit {
  constructor(
    private matDialog: WindowRef,
    private sharedData: SharedDataService
  ) {}

  ngOnInit(): void {}

  openDialog(edit: string): void {
    this.matDialog.openDialog();
    this.sharedData.sendVehicleEditData(edit);
  }
}
