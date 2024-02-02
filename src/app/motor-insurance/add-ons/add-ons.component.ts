import { Component, OnInit } from '@angular/core';
import add_ons_list from './add-ons-list.json'
@Component({
  selector: 'app-add-ons',
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.scss'],
})
export class AddOnsComponent implements OnInit {
  add_ons_list:any=add_ons_list
  constructor() {}

  ngOnInit(): void {}

  /**
   * this fucntion use for clear all check box to uncheck
   */ 
  clearAllChecked(): void {
    this.add_ons_list.forEach((item:any) => (item.checked = false));
  }
}
