import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [LoadingSpinnerComponent, AlertComponent, DropdownDirective],
    imports: [CommonModule, FormsModule],
    exports: [
        LoadingSpinnerComponent,
        AlertComponent,
        DropdownDirective,
        CommonModule,
        FormsModule,
    ],
})
export class SharedModule {}
