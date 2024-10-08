// tabela.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input'; // Importe o MatInputModule
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { TabelaComponent } from './tabela.component';

@NgModule({
  declarations: [TabelaComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule, // Adicione o MatInputModule
    FormsModule // Adicione o FormsModule
  ],
  exports: [TabelaComponent]
})
export class TabelaModule { }
