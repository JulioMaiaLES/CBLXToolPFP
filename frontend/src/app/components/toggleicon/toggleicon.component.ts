import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggleicon',
  templateUrl: './toggleicon.component.html',
  styleUrls: ['./toggleicon.component.scss'],
  // standalone: true,
})
export class ToggleiconComponent {
  @Input() isCollapsed: boolean = false; // Receives collapsed state
  @Output() toggle: EventEmitter<void> = new EventEmitter(); // Emits toggle event

  // Emit toggle event when icon is clicked
  onToggleClick() {
    this.toggle.emit();
  }
}
