import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  
  // pages: number[] = [1];  // Start with one page
  // selectedPage: number = 1;  // Start with the first page selected
  // maxPages: number = 5;  // Maximum number of pages
  // @Input() backgroundColor: string = '#58BC68';
  // @Input() isCollapsed: boolean = false;
  // currentPage: number = 1;
  // @Input() pages: any[] = [1];
  // @Output() addPage = new EventEmitter<void>();
  // @Output() selectPage = new EventEmitter<number>();
  // @Output() pageSelected = new EventEmitter<number>();

  // // Function to add a new page if below the maxPages limit
  // addNewPage(): void {
  //   // if (this.pages.length < this.maxPages) {
  //   //   const newPageNumber = this.pages.length + 1;
  //   //   this.pages.push(newPageNumber);
  //   // }
  //   if (this.pages.length < 10) {
  //     this.pages.push(this.pages.length + 1);
  //   }
  // }

  // // Function to set the selected page when clicked
  // // pageSelect(pageNumber: number): void {
  // //   this.selectedPage = pageNumber;
  // // }

  // pageSelect(page: number): void {
  //   this.currentPage = page;
  //   this.pageSelected.emit(page);
  // }

  selectedPage: number = 1;  // Start with the first page selected
  maxPages: number = 5;  // Maximum number of pages
  @Input() backgroundColor: string = '#58BC68';
  @Input() isCollapsed: boolean = false;
  @Input() pages: any[] = [1];
  @Output() addPage = new EventEmitter<void>();
  @Output() selectPage = new EventEmitter<number>();
  @Output() pageSelected = new EventEmitter<number>();

  // Function to add a new page if below the maxPages limit
  addNewPage(): void {
    if (this.pages.length < 10) {
      this.pages.push(this.pages.length + 1);
    }
  }

  // Function to set the selected page when clicked
  pageSelect(page: number): void {
    this.selectedPage = page;
    this.pageSelected.emit(page); // Emit the selected page
  }

}
