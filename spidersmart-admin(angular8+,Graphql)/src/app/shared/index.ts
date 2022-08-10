// guards
export { AuthGuard } from './guards/auth.guard';
export { AccessGuard } from './guards/access.guard';

// directives
export { HasPermissionDirective } from './directives/has-permission.directive';
export { InContextDirective } from './directives/in-context.directive';
export { IsModeDirective } from './directives/is-mode.directive';

// components
export { ContactInputComponent } from './components/contact-input/contact-input.component';
export { ContactInputModule } from './components/contact-input/contact-input.module';
export { EnrollmentInputComponent } from './components/enrollment-input/enrollment-input.component';
export { EnrollmentInputModule } from './components/enrollment-input/enrollment-input.module';
export { AddressInputComponent } from './components/address-input/address-input.component';
export { AddressInputModule } from './components/address-input/address-input.module';
export { DialogModule } from './components/dialog/dialog.module';
export { SelectStudentDialogComponent } from './components/dialog/select-student-dialog.component';
export { SelectAssignmentDialogComponent } from './components/dialog/select-assignment-dialog.component';

// common exports used in all lazy loaded sections
export { SharedModule } from './shared.module';
