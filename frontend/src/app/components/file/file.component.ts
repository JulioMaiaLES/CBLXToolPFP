import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FileComponent {
  @Input() data: { files: any[] } = { files: [] };
  renderedFiles: RenderedFile[] = [];
  files: File[] = []; // Store non-image files
  objectUrls: string[] = []; // Track object URLs for cleanup

  onFileSelected(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files: FileList = inputElement.files;
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const renderType = this.determineRenderType(file);
        const renderedFile: RenderedFile = { file, renderType };

        if (renderType === 'pdf') {
          renderedFile.downloadUrl = this.getFileUrl(file);
        }

        this.renderedFiles.push(renderedFile);
      }
    }
  }

  determineRenderType(file: File): 'pdf' | 'other' {
    if (file.type.includes('pdf')) {
      return 'pdf';
    } else {
      return 'other';
    }
  }

  getFileUrl(file: File): string {
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url); // Track URLs for cleanup
    return url;
  }

  cleanupObjectUrls(): void {
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls = [];
  }

  downloadFile(file: File): void {
    const url = this.getFileUrl(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
  }
}

interface RenderedFile {
  file: File;
  renderType: 'pdf' | 'other';
  downloadUrl?: string;
}