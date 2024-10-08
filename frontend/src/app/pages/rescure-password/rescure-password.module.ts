import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@app/components/shared/shared.module';
import { RescurePasswordRoutingModule } from './rescure-password-routing.module';
import { RescurePasswordComponent } from './rescure-password.component';

@NgModule({
  declarations: [RescurePasswordComponent],
  imports: [
    CommonModule,
    RescurePasswordRoutingModule,
    SharedModule,
    MatTooltipModule,
  ],
})
export class RescurePasswordModule {}
