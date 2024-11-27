import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PageContentComponent {
  @Input() title: string = 'Título';
  @Input() formGroup!: FormGroup;
  @Input() isExpandedPhase: boolean = false;
  @Input() isEditingTitle: boolean = false;
  @Input() pageNumber: number = 1;
  @Input() iconPath: string = '../../../../assets/images/edit-icon.png'; // Default icon path

  @Output() togglePhaseEvent = new EventEmitter<string>();
  @Output() stopEditingTitleEvent = new EventEmitter<KeyboardEvent>();
  @Output() startEditingTitleEvent = new EventEmitter<void>();
  @Output() formSubmitEvent = new EventEmitter<KeyboardEvent>();
  @Output() autoResizeEvent = new EventEmitter<Event>();

  isExpanded: boolean = false; // Track expansion state
  @Input() isTabCollapsed: boolean = false;
  @Input() isPaginationCollapsed: boolean = false;
  @Input() isFullWidth: boolean = false; // Determine full-width state

  get dynamicPageWidthClass(): string {
    if (this.isTabCollapsed && this.isPaginationCollapsed) {
      return 'full-width';
    } else if (this.isTabCollapsed) {
      return 'half-width';
    } else if (this.isPaginationCollapsed) {
      return 'pagination-collapsed';
    } else {
      return 'default-width';
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.updateFormWidth();
  }

  // Handle tab toggle
  handleTabToggle(isCollapsed: boolean): void {
    this.isTabCollapsed = isCollapsed;
    this.updateFormWidth();
  }

  // Handle pagination toggle
  togglePagination(): void {
    this.isPaginationCollapsed = !this.isPaginationCollapsed;
    this.updateFormWidth();
  }

  // Update the form width based on collapsed states
  private updateFormWidth(): void {
    this.isFullWidth = this.isTabCollapsed || (this.isTabCollapsed && this.isPaginationCollapsed);
  }


  startEditingTitle() {
    this.startEditingTitleEvent.emit();
  }

  stopEditingTitle(event: Event) {
    // Handle both FocusEvent and KeyboardEvent
    if (event instanceof KeyboardEvent) {
      if (event.key === 'Enter') {
        this.stopEditingTitleEvent.emit(event);
      }
    } else if (event instanceof FocusEvent) {
      this.stopEditingTitleEvent.emit(event as any); // Emit as generic Event
    }
  }
  
  onFormSubmit(event: Event) {
    if (event instanceof KeyboardEvent) {
      if (event.key === 'Enter') {
        this.formSubmitEvent.emit(event);
      }
    }
  }
  autoResize(event: Event) {
    this.autoResizeEvent.emit(event);
  }
}
