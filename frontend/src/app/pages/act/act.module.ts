import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActRoutingModule } from './act-routing.module';
import { ActComponent } from './act.component';
import { TogglemenuComponent } from '../../components/jornada/togglemenu/togglemenu.component';
import { MenuComponent } from '../../components/jornada/menu/menu.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '@app/components/tab/tab.component';
import { TabModule } from '@app/components/tab/tab.module';


@NgModule({
  declarations: [
    ActComponent
  ],
  imports: [
    MatTableModule,
    MatInputModule,
    FormsModule, 
    CommonModule,
    ActRoutingModule,
    TogglemenuComponent,
    MenuComponent,
    ReactiveFormsModule,
    TabModule
  ]
})
export class ActModule { }
