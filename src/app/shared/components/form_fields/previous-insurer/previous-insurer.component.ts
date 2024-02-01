import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-previous-insurer',
  templateUrl: './previous-insurer.component.html',
  styleUrls: ['./previous-insurer.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class PreviousInsurerComponent implements OnInit {
  insurerList: any;
  form!: FormGroup;
  @Input('required') isRequired = false;

  constructor(private ctrlContainer: FormGroupDirective) {
    this.insurerList = [
      {
        id: 1,
        insurer: 'HDFC',
      },
      {
        id: 2,
        insurer: 'ICICI',
      },
    ];
  }

  ngOnInit(): void {
    /**
     *add form control for the Previous Insurer
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'previous_insurer',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('previous_insurer', new FormControl());
    }
  }
  ngOnDestroy(): void {
    /**
     * remove form control for the Previous Insurer
     */
    this.form.removeControl('previous_insurer');
  }
}
