import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigateComponent } from './investigate.component';


const routes: Routes = [
  {
    path: '',
    component: InvestigateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigateRoutingModule { }
