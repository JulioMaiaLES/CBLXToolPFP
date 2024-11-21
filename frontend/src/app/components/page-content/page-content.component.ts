import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-content',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2><i class="material-icons">edit</i> {{ title || 'Título' }}</h2>
      </div>
      <div class="page-content">
        <p>Content for page {{ pageNumber }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./page-content.component.scss'],
  standalone: true,
})
export class PageContentComponent {
  @Input() pageNumber: number = 1; 
  @Input() title: string = '';
}
