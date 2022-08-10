import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountrySelectModule } from '@spidersmart/ng';
import { AddressInputComponent } from './address-input.component';

@NgModule({
  declarations: [AddressInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    CountrySelectModule
  ],
  exports: [AddressInputComponent]
})
export class AddressInputModule { }
