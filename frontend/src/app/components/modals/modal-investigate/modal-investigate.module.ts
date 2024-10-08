// modal-investigate.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalInvestigateComponent } from './modal-investigate.component';
import { TabelaModule } from '@app/components/tabela/tabela.module';
import { TabelaVariavelModule } from '@app/components/tabelavariavel/tabelavariavel.module';
import { CblCanvasModule } from '@app/components/cbl-canvas/cbl-canvas.module';

@NgModule({
  declarations: [
    ModalInvestigateComponent
  ],
  imports: [
    CommonModule,
    TabelaModule,
    TabelaVariavelModule,
    CblCanvasModule
  ],
  exports: [
    ModalInvestigateComponent
  ]
})
export class ModalInvestigateModule { }
