import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngageRoutingModule } from './engage-routing.module';
import { EngageComponent } from './engage.component';
import { TogglemenuComponent } from '../../components/jornada/togglemenu/togglemenu.component';
import { MenuComponent } from '../../components/jornada/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '@app/components/tab/tab.component';
import { TabModule } from '@app/components/tab/tab.module';
import { ToggleiconModule } from '@app/components/toggleicon/toggleicon.module';

@NgModule({
  declarations: [
    EngageComponent
  ],
  imports: [
    CommonModule,
    EngageRoutingModule,
    TogglemenuComponent,
    MenuComponent,
    ReactiveFormsModule,
    TabModule,
    ToggleiconModule
  ]
})
export class EngageModule { }
