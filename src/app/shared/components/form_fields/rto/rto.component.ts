import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-rto',
  templateUrl: './rto.component.html',
  styleUrls: ['./rto.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RTOComponent implements OnInit {
  @Input() cities: any[] = [];
  @Input('required') isRequired = false;

  form!: FormGroup;

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    /**
     *add form control for the RTO city
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'rto_city',
        new FormControl(null, Validators.required),
      );
    } else {
      this.form.addControl('rto_city', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the RTO city
     */
    this.form.removeControl('rto_city');
  }
}
