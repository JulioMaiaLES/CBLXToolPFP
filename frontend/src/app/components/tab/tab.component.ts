import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit, Output, EventEmitter, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TextComponent } from '../text/text.component';
import { ImageComponent } from '../image/image.component';
import { FileComponent } from '../file/file.component';
import { TabelaVariavelComponent } from '../tabelavariavel/tabelavariavel.component';
import { DynamicComponentData } from '@app/interfaces/dynamic-component-data';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit, DynamicComponentData {
  isCollapsed: boolean = false;
  @Output() toggleEvent = new EventEmitter<boolean>();

  searchControl = new FormControl();
  filteredItems!: Observable<any[]>;

  items = [
    { label: 'Texto', icon: 'textos', component: 'Text' },
    { label: 'Imagem', icon: 'imagens', component: 'Image' },
    { label: 'Tabela', icon: 'tabelas', component: 'Table' },
    { label: 'Arquivo', icon: 'arquivos', component: 'File' },
  ];

  @ViewChild('dropContainer', { read: ViewContainerRef, static: true })
  dropContainer!: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}
  data: any;

  ngOnInit(): void {
    this.filteredItems = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterItems(value || ''))
    );
  }

  toggleTab(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleEvent.emit(this.isCollapsed);
  }

  filterItems(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.items.filter((item) =>
      item.label.toLowerCase().includes(filterValue)
    );
  }

  // Handle item drop
  onDrop(event: CdkDragDrop<any>) {
    const droppedItem = event.item.data;
    console.log('Dropped Item:', droppedItem);

    // Dynamically add the component
    this.addDynamicComponent(droppedItem.component);
  }

  private addDynamicComponent(componentType: string) {
    let component: Type<any>;
    let data: any;
  
    // Select the appropriate component and prepare data
    switch (componentType.toLowerCase()) {
      case 'texto':
        component = TextComponent;
        data = { text: `Dropped content for ${componentType}` };
        break;
      case 'imagem':
        component = ImageComponent;
        data = { imageUrl: 'path/to/image.jpg', width: 300, height: 200 };
        break;
      case 'tabela':
        component = TabelaVariavelComponent;
        data = { tableData: [] }; // Replace with actual table data
        break;
      case 'arquivo':
        component = FileComponent;
        data = { fileName: 'example.pdf', filePath: 'path/to/file.pdf' };
        break;
      default:
        console.warn(`Unknown component type: ${componentType}`);
        return;
    }
  
    // Dynamically create the component
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = this.dropContainer.createComponent(factory);
  
    // Cast `componentRef.instance` to the proper interface
    const instance = componentRef.instance as DynamicComponentData;
  
    // Pass data to the created component
    if (instance.data !== undefined) {
      instance.data = data;
    }
  }
  
}
