// tabela.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input'; // Importe o MatInputModule
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { TabelaVariavelComponent } from './tabelavariavel.component';

@NgModule({
  declarations: [TabelaVariavelComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule, // Adicione o MatInputModule
    FormsModule // Adicione o FormsModule
  ],
  exports: [TabelaVariavelComponent]
})
export class TabelaVariavelModule { }
