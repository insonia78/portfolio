import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactInputComponent } from './contact-input.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [ContactInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    TextMaskModule
  ],
  exports: [ContactInputComponent]
})
export class ContactInputModule { }
