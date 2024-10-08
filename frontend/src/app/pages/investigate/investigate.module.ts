// investigate.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestigateRoutingModule } from './investigate-routing.module';
import { InvestigateComponent } from './investigate.component';
import { TabelaModule } from '../../components/tabela/tabela.module';
import { TabelaVariavelModule } from '../../components/tabelavariavel/tabelavariavel.module';
import { TogglemenuComponent } from '../../components/jornada/togglemenu/togglemenu.component';
import { MenuComponent } from '../../components/jornada/menu/menu.component'; // Importe o MenuComponent
import { CblCanvasModule } from '@app/components/cbl-canvas/cbl-canvas.module'; // Importe o CblCanvasModule
import { TabelaComponent } from '@app/components/tabela/tabela.component';
import { AppModule } from '@app/app.module';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ModalInvestigateModule } from '@app/components/modals/modal-investigate/modal-investigate.module';

@NgModule({
  declarations: [
    InvestigateComponent
  ],
  imports: [
    CommonModule,
    InvestigateRoutingModule,
    MatTableModule,
    MatInputModule,
    TabelaModule,
    TabelaVariavelModule,
    TogglemenuComponent,
    ModalInvestigateModule,
    MenuComponent,
    CblCanvasModule
  ]
})
export class InvestigateModule { }
