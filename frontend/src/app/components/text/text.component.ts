import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class TextComponent {
  @Input() data!: { text: string };
  @Input() isTabCollapsed!: boolean; // Collapse state of the tab
  @Input() isPaginationCollapsed!: boolean; // Collapse state of the pagination

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto'; // Reset height
    target.style.height = `${target.scrollHeight}px`; // Adjust height dynamically
  }

  // // Method to handle the toggle state from app-tab
  // handleTabToggle(isCollapsed: boolean): void {
  //   this.isTabCollapsed = isCollapsed;
  //   this.updateTextWidth();
  // }

  // togglePagination(): void {
  //   this.isPaginationCollapsed = !this.isPaginationCollapsed;
  //   this.updateTextWidth();
  // }

  // private updateTextWidth(): void {
  //   this.isFullWidth = this.isTabCollapsed || (this.isTabCollapsed && this.isPaginationCollapsed);
  // }

}
