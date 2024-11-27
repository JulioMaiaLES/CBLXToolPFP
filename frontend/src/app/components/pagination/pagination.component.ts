import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  selectedPage: number = 1;  // Start with the first page selected
  maxPages: number = 5;  // Maximum number of pages
  @Input() backgroundColor: string = '#58BC68';
  @Input() isCollapsed: boolean = false;
  @Input() pages: any[] = [1];
  @Output() addPage = new EventEmitter<void>();
  @Output() pageSelected = new EventEmitter<number>();
  @Input() currentPage!: number;


  // Function to add a new page if below the maxPages limit
  // addNewPage(): void {
  //   if (this.pages.length < 10) {
  //     this.pages.push(this.pages.length + 1);
  //   }
  // }

  addNewPage(): void {
    this.addPage.emit();
    // if (this.pages.length < this.maxPages) {
    //   const newPageId = this.pages.length + 1;
    //   this.pages.push({ id: newPageId }); // Add a new page with a unique ID
    //   this.pageSelected.emit(newPageId); // Automatically select the new page
    // }
  }

  // Function to set the selected page when clicked
  pageSelect(page: number): void {
    this.selectedPage = page;
    this.pageSelected.emit(page); // Emit the selected page
  }

  selectPage(pageId: number) {
    this.selectedPage = pageId;
    this.pageSelected.emit(pageId);
  }

  // selectPage(pageId: number): void {
  //   this.currentPageId = pageId; // Set the current page
  // }

}
