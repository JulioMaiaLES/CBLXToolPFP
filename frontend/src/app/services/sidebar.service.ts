import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isHidden = new BehaviorSubject<boolean>(true);  // Using BehaviorSubject to track sidebar state

  // Optionally, add a method to set the state explicitly
  setSidebarState(state: boolean): void {
    this.isHidden.next(state);  // Update BehaviorSubject value
  }

  // Method to get the current state of the sidebar
  getSidebarState(): boolean {
    return this.isHidden.value;
  }

  // Method to toggle the sidebar
  toggleSidebar(): void {
    this.isHidden.next(!this.isHidden.value);  // Toggle the current state
  }

  // Method to get the observable of the sidebar state
  getSidebarStateObservable() {
    return this.isHidden.asObservable();  // Return observable for subscribing to state changes
  }

}