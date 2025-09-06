import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-promotion-base-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzInputNumberModule, NzDatePickerModule],
  templateUrl: './promotion-base-form.html',
})
export class PromotionBaseForm {
  @Input({ required: true }) form!: FormGroup;
}

