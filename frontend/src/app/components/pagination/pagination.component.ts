import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  
  pages: number[] = [1];  // Start with one page
  selectedPage: number = 1;  // Start with the first page selected
  maxPages: number = 5;  // Maximum number of pages
  @Input() backgroundColor: string = '#58BC68';
  @Input() isCollapsed: boolean = false;
  // Function to add a new page if below the maxPages limit
  addNewPage(): void {
    if (this.pages.length < this.maxPages) {
      const newPageNumber = this.pages.length + 1;
      this.pages.push(newPageNumber);
    }
  }

  // Function to set the selected page when clicked
  selectPage(pageNumber: number): void {
    this.selectedPage = pageNumber;
  }

}
