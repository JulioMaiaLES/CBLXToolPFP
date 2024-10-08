import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['guidingQuestions', 'guidingActivities', 'guidingResources', 'resultados'];

  ngOnInit() {
    this.dataSource.data = [
      { guidingQuestions: ' ', guidingActivities: ' ', guidingResources: ' ', resultados: ' ' }
    ];
  }

  showFilter: boolean = false;
  isVisible: boolean = true;

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  adicionarLinha(linha?: any) {
    const index = linha ? this.dataSource.data.indexOf(linha) : this.dataSource.data.length - 1;
    const novaLinha = { guidingQuestions: '', guidingActivities: '', guidingResources: '', resultados: '' };
    this.dataSource.data.splice(index + 1, 0, novaLinha);
    this.dataSource._updateChangeSubscription();
  }

  removerLinha(linha: any) {
    const confirmacao = confirm("Tem certeza que deseja deletar esta linha?");
    if (confirmacao) {
      const index = this.dataSource.data.indexOf(linha);
      if (index >= 0) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
        this.verificarTabelaVazia();
      }
    }
  }

  verificarTabelaVazia() {
    if (this.dataSource.data.length === 0) {
      this.dataSource.data = [];
      this.showFilter = false;
    }
  }

  autoResize(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight) + 'px';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const columnsToFilter = Object.keys(data);
      return columnsToFilter.some(column => {
        const value = data[column];
        return value && value.toString().toLowerCase().includes(filter);
      });
    };

    this.dataSource.filter = filterValue;
  }

  removeCanvas() {
    const confirmacao = confirm("Tem certeza que deseja deletar esta tabela? Todos os dados serão perdidos");
    if (confirmacao) {
      this.isVisible = false; 
    }
  }
}
