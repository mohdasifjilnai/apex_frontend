import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'multi-select-drop-down',
  templateUrl: './multi-select-drop-down.component.html',
  styleUrls: ['./multi-select-drop-down.component.scss'],
})
export class MultiSelectDropDownComponent implements OnInit {
  @Input() multi_select_cities: Array<any>[] = [];
  toppings = new FormControl();
  toppingList: Array<any>[] = [];
  @Input('required') isRequired = false;
  form!: FormGroup;
  constructor(private ctrlContainer: FormGroupDirective) {}
  ngOnInit(): void {
    for (const iterator in this.multi_select_cities) {
      this.toppingList = this.multi_select_cities[iterator];
    }
    /**
     *add form control for the multi select city
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'multi_select_city',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('multi_select_city', new FormControl());
    }
  }
  ngOnDestroy(): void {
    /**
     * remove form control for the multi select city
     */
    this.form.removeControl('multi_select_city');
  }
}
