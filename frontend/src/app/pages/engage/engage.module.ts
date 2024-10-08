import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngageRoutingModule } from './engage-routing.module';
import { EngageComponent } from './engage.component';
import { TogglemenuComponent } from '../../components/jornada/togglemenu/togglemenu.component';
import { MenuComponent } from '../../components/jornada/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EngageComponent
  ],
  imports: [
    CommonModule,
    EngageRoutingModule,
    TogglemenuComponent,
    MenuComponent,
    ReactiveFormsModule
  ]
})
export class EngageModule { }
