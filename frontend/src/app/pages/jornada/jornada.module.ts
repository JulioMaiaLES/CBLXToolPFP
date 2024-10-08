// jornada.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JornadaRoutingModule } from './jornada-routing.module';
import { JornadaComponent } from './jornada.component';
import { MenuComponent } from '../../components/jornada/menu/menu.component';
import { TogglemenuComponent } from '../../components/jornada/togglemenu/togglemenu.component';
import { TabelaModule } from '../../components/tabela/tabela.module'; // Importe o TabelaModule
import { TabelaVariavelModule } from '../../components/tabelavariavel/tabelavariavel.module';

@NgModule({
  declarations: [
    JornadaComponent
  ],
  imports: [
    CommonModule,
    JornadaRoutingModule,
    TabelaModule, // Adicione o TabelaModule aqui
    TabelaVariavelModule,
    TogglemenuComponent,
    MenuComponent
  ]
})
export class JornadaModule { }
