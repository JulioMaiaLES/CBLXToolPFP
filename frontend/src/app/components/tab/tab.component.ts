import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { TabelaComponent } from '../tabela/tabela.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  draggedItem: string | null = null;
  searchControl = new FormControl();
  // searchQuery: string = '';

  items = [
    { label: 'Texto', icon: 'textos', component: 'Texto' },
    { label: 'Imagem', icon: 'imagens', component: 'Imagem' },
    { label: 'Tabela', icon: 'tabelas', component: 'Tabela' },
    { label: 'Arquivo', icon: 'arquivos', component: 'Arquivo' },
    // { label: 'Tabela Investigate', icon: 'table-investigate-icon', component: 'Tabela Investigate' },
    // { label: 'Essential Questioning', icon: 'question-icon', component: 'Essential Questioning' },
    // { label: 'Template Act', icon: 'template-act-icon', component: 'Template Act' },
    // { label: 'Template Engage', icon: 'template-engage-icon', component: 'Template Engage' },
    // { label: 'CBL Canvas', icon: 'cbl-canvas-icon', component: 'CBL Canvas' }
  ]; // All available items to display

  // filteredItems = [...this.items]; // Initialize with all items
  filteredItems!: Observable<any[]>;
  itemsToShow = [...this.items]; // Initially show all items

  ngOnInit(): void {
    this.filteredItems = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItems(value || ''))
    );
  }

  filterItems(value: string): any[] {
    const filterValue = value.toLowerCase();
    const filtered = this.items.filter(item =>
      item.label.toLowerCase().includes(filterValue)
    );
    this.itemsToShow = filtered; // Update items in the grid
    return filtered;
  }

  // private _filterItems(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.items.filter(item =>
  //     item.label.toLowerCase().includes(filterValue)
  //   );
  // }

  onOptionSelected(option: string): void {
    console.log('Selected Option:', option);
    // Additional logic on selection, if needed
  }

  // Reference to the drop container
  @ViewChild('dropContainer', { read: ViewContainerRef, static: true })
  dropContainer!: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  // Start dragging and store the item type
  onDragStart(event: DragEvent, itemType: string) {
    this.draggedItem = itemType;
  }

  // Allow dropping by preventing default behavior
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Handle the drop event and dynamically add the TabelaComponent
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (this.draggedItem === 'table') {
      this.addTableComponent(); // Dynamically add the table
    }

    this.draggedItem = null; // Reset the dragged item
  }

  // Dynamically create the TabelaComponent
  private addTableComponent() {
    const factory = this.resolver.resolveComponentFactory(TabelaComponent);
    const componentRef = this.dropContainer.createComponent(factory);
    // You can pass any input data to the component here if needed
  }
}
