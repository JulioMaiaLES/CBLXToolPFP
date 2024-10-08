import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngageComponent } from './engage.component';

const routes: Routes = [
  {
    path: '',
    component: EngageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngageRoutingModule {}
