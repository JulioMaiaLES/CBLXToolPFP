import { Component, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ImageComponent {
  @Input() data: { imageUrl: string; width: number; height: number } = {
    imageUrl: '',
    width: 200,
    height: 200,
  };

  imageUrl: string | null = null;
  isResizing: boolean = false;
  initialWidth: number = 0;
  initialHeight: number = 0;
  initialMouseX: number = 0;
  initialMouseY: number = 0;

  @ViewChild('resizableImage') resizableImage!: ElementRef<HTMLImageElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Reference to the file input

  maxWidth: number = window.innerWidth * 0.7; // 90% of screen width
  maxHeight: number = window.innerHeight * 0.7; // 90% of screen height

  ngAfterViewInit(): void {
    if (!this.data.imageUrl) {
      this.openFileExplorer(); // Trigger file explorer if no image is provided
    }
  }

  openFileExplorer(): void {
    this.fileInput.nativeElement.click(); // Simulate a click on the file input element
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.data.imageUrl = this.imageUrl; // Update the data object
        this.data.width = Math.min(this.data.width, this.maxWidth);
        this.data.height = Math.min(this.data.height, this.maxHeight);
      };
      reader.readAsDataURL(file);
    }
  }

  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
    this.initialWidth = this.resizableImage.nativeElement.offsetWidth;
    this.initialHeight = this.resizableImage.nativeElement.offsetHeight;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  onResize(event: MouseEvent): void {
    if (!this.isResizing) return;

    const deltaX = event.clientX - this.initialMouseX;
    const deltaY = event.clientY - this.initialMouseY;

    const newWidth = Math.min(this.initialWidth + deltaX, this.maxWidth);
    const newHeight = Math.min(this.initialHeight + deltaY, this.maxHeight);

    // Ensure image dimensions are constrained to 80% of the viewport
    this.data.width = Math.max(50, newWidth); // Set a minimum width (e.g., 50px)
    this.data.height = Math.max(50, newHeight); // Set a minimum height (e.g., 50px)

    if (this.resizableImage) {
      this.resizableImage.nativeElement.style.width = `${newWidth}px`;
      this.resizableImage.nativeElement.style.height = `${newHeight}px`;
    }
  }

  @HostListener('document:mouseup')
  onResizeEnd(): void {
    this.isResizing = false;
  }
}