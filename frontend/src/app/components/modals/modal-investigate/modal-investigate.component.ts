import { Component, Input } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { TabelaComponent } from '@app/components/tabela/tabela.component';
import { TabelaVariavelComponent } from '@app/components/tabelavariavel/tabelavariavel.component';
import { CblCanvasComponent } from '@app/components/cbl-canvas/cbl-canvas.component';

@Component({
  selector: 'app-modal-investigate',
  templateUrl: './modal-investigate.component.html',
  styleUrls: ['./modal-investigate.component.scss']
})
export class ModalInvestigateComponent {
  @Input() isVisible = false;
  @Input() componenteContainer!: ViewContainerRef;

  closeModal() {
    this.isVisible = false;
  }

  addTabelaComponent() {
    this.componenteContainer.createComponent(TabelaComponent);
    this.closeModal();
  }

  addTabelaVariavelComponent() {
    this.componenteContainer.createComponent(TabelaVariavelComponent);
    this.closeModal();
  }

  addCBLCanvasComponent() {
    this.componenteContainer.createComponent(CblCanvasComponent);
    this.closeModal();
  }
}
