import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule, StickyPanelModule, DatatableModule } from '@spidersmart/ng';

import { HasPermissionDirective } from './directives/has-permission.directive';
import { InContextDirective } from './directives/in-context.directive';
import { IsModeDirective} from './directives/is-mode.directive';

// import { ContactInputModule } from './components/contact-input/contact-input.module';
// import { EnrollmentInputModule } from './components/enrollment-input/enrollment-input.module';
// import { AddressInputModule } from './components/address-input/address-input.module';

@NgModule({
  imports: [],
  providers: [],
  declarations: [
    HasPermissionDirective,
    InContextDirective,
    IsModeDirective
  ],
  exports: [
    HasPermissionDirective,
    InContextDirective,
    IsModeDirective,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PipesModule,
    StickyPanelModule,
    DatatableModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
  constructor() {
  }
}
