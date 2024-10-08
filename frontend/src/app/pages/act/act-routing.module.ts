import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActComponent } from './act.component';

const routes: Routes = [
  {
    path: '',
    component: ActComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActRoutingModule { }
