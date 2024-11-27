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
import { TabComponent } from '@app/components/tab/tab.component';
import { TabModule } from '@app/components/tab/tab.module';
import { ToggleiconModule } from '@app/components/toggleicon/toggleicon.module';
import { PaginationModule } from '@app/components/pagination/pagination.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextComponent } from '@app/components/text/text.component';
import { ImageComponent } from '@app/components/image/image.component';
import { FileComponent } from '@app/components/file/file.component';
import { PageContentComponent } from '@app/components/page-content/page-content.component';


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
    CblCanvasModule,
    TabModule,
    ToggleiconModule,
    PaginationModule,
    DragDropModule,
    TextComponent,
    ImageComponent,
    FileComponent,
    PageContentComponent
  ]
})
export class InvestigateModule { }
