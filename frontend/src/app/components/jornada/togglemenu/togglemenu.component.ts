import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-togglemenu',
  templateUrl: './togglemenu.component.html',
  styleUrls: ['./togglemenu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TogglemenuComponent {

  @Output() menuToggled = new EventEmitter<void>(); // Event to notify parent components if necessary

  constructor(public sidebarService: SidebarService) {}

  // Get the current state of the sidebar
  isSidebarOpen(): boolean {
    return this.sidebarService.getSidebarState();  // Use service method to get current state
  }

  // Toggle the sidebar visibility
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();  // Use service to handle the toggle
  }

  onClick(): void {
    this.toggleSidebar();  // Toggle the sidebar state
    this.menuToggled.emit();  // Notify parent components, if needed
  }
}
