import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableModule } from 'angular-resizable-element';
import { AngularSplitModule } from 'angular-split';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, ResizableModule, AngularSplitModule]
})
export class MenuComponent implements OnInit {

  isMenuHidden: boolean = false;  // Initialize with a default value
  keepLeft: boolean = true;

  images: { src: string; alt: string }[] = [
    {
      src: '../../../../assets/images/jornada.png',
      alt: 'Educação'
    },
    {
      src: '../../../../assets/images/jornada.png',
      alt: 'Turismo'
    },
    {
      src: '../../../../assets/images/jornada.png',
      alt: 'Saúde'
    }
  ];  

  constructor(public sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Subscribe to sidebar state changes
    this.sidebarService.getSidebarStateObservable().subscribe(isOpen => {
      this.isMenuHidden = !isOpen;
    });
  }

  // Toggle sidebar visibility and update SidebarService state
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();  // This method handles the toggle internally
  }
}