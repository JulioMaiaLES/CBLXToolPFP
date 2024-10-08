import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RescurePasswordComponent } from './rescure-password.component';

const routes: Routes = [
  {
    path: '',
    component: RescurePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescurePasswordRoutingModule {}
