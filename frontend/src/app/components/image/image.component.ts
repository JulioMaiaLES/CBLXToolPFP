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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
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

    const newWidth = this.initialWidth + deltaX;
    const newHeight = this.initialHeight + deltaY;

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
