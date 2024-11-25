import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface TableData {
  [key: string]: string;
}

@Component({
  selector: 'app-tabelavariavel',
  templateUrl: './tabelavariavel.component.html',
  styleUrls: ['./tabelavariavel.component.scss']
})
export class TabelaVariavelComponent implements OnInit {
  @Input() data: { rows: any[] } = { rows: [['']] };
  dataSource: MatTableDataSource<TableData> = new MatTableDataSource<TableData>([]);
  displayedColumns: string[] = ['guidingQuestions', 'guidingActivities', 'guidingResources', 'resultados'];
  columnNames: { [key: string]: string } = {
    guidingQuestions: 'Guiding Questions',
    guidingActivities: 'Guiding Activities',
    guidingResources: 'Guiding Resources',
    resultados: 'Resultados'
  };

  ngOnInit() {
    this.dataSource.data = [
      { guidingQuestions: '', guidingActivities: '', guidingResources: '', resultados: '' }
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

  removerLinha(index: number) {
    const confirmacao = confirm("Tem certeza que deseja deletar esta linha? Todos os dados dela serão perdidos.");
    if (confirmacao) {
      if (index > -1 && index < this.dataSource.data.length) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
        this.verificarTabelaVazia();
      }
    }
  }

  adicionarColuna() {
    const newColumnKey = `column${this.displayedColumns.length + 1}`;
    this.displayedColumns.push(newColumnKey);
    this.columnNames[newColumnKey] = `Column ${this.displayedColumns.length}`;

    if (this.dataSource.data.length === 0) {
      this.dataSource.data.push({ [newColumnKey]: '' });
    } else {
      for (const row of this.dataSource.data) {
        row[newColumnKey] = '';
      }
    }
    this.dataSource._updateChangeSubscription();
  }

  adicionarColunaApos(index: number) {
    const newColumnKey = `column${this.displayedColumns.length + 1}`;
    this.displayedColumns.splice(index + 1, 0, newColumnKey);
    this.columnNames[newColumnKey] = `Column ${index + 2}`;

    for (const row of this.dataSource.data) {
      row[newColumnKey] = '';
    }
    this.dataSource._updateChangeSubscription();
  }

  removerColuna() {
    const confirmacao = confirm("Tem certeza que deseja deletar esta coluna? Todos os dados dela serão perdidos.");
    if (confirmacao) {
      if (this.displayedColumns.length > 0) {
        const removedColumn = this.displayedColumns.pop();
        if (removedColumn) {
          delete this.columnNames[removedColumn];

          for (const row of this.dataSource.data) {
            delete row[removedColumn];
          }
          this.dataSource._updateChangeSubscription();
          this.verificarTabelaVazia();
        }
      }
    }
  }

  removerColunaPorIndex(index: number) {
    const confirmacao = confirm("Tem certeza que deseja deletar esta coluna? Todos os dados dela serão perdidos.");
    if (confirmacao) {
      if (index > -1 && index < this.displayedColumns.length) {
        const removedColumn = this.displayedColumns.splice(index, 1)[0];
        delete this.columnNames[removedColumn];

        for (const row of this.dataSource.data) {
          delete row[removedColumn];
        }
        this.dataSource._updateChangeSubscription();
        this.verificarTabelaVazia();
      }
    }
  }

  verificarTabelaVazia() {
    if (this.dataSource.data.length === 0 || this.displayedColumns.length === 0) {
      this.dataSource.data = [];
      this.displayedColumns = [];
      this.showFilter = false;  // Esconde o filtro quando a tabela está vazia
    }
  }

  autoResize(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight) + 'px';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: TableData, filter: string) => {
      const columnsToFilter = Object.keys(data);
      return columnsToFilter.some(column => {
        const value = data[column];
        return value && value.toString().toLowerCase().includes(filter);
      });
    };

    this.dataSource.filter = filterValue;
  }

  removeCanvas() {
    const confirmacao = confirm("Tem certeza que deseja deletar esta tabela? Todos os dados dela serão perdidos.");
    if (confirmacao) {
      this.isVisible = false;
   }
  }
}
