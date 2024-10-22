import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { TabelaComponent } from '../tabela/tabela.component'; // Import the table component

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: true,
})
export class TabComponent implements OnInit {
  draggedItem: string | null = null;

  // Reference to the drop container
  @ViewChild('dropContainer', { read: ViewContainerRef, static: true })
  dropContainer!: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

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
