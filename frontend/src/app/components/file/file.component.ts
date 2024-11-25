import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FileComponent {
  @Input() data!: { fileName?: string; filePath?: string };
  renderedFiles: RenderedFile[] = [];
  objectUrls: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.openFileExplorer(); // Automatically open the file explorer when the component is rendered
  }

  openFileExplorer(): void {
    this.fileInput.nativeElement.click(); // Trigger the file input element
  }

  onFileSelected(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files: FileList = inputElement.files;
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const renderType = this.determineRenderType(file);
        const renderedFile: RenderedFile = {
          file,
          renderType,
          downloadUrl: this.getFileUrl(file),
        };
        this.renderedFiles.push(renderedFile);
      }
    }
  }

  determineRenderType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    return extension;
  }

  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const iconMapping: { [key: string]: string } = {
      pdf: '../../../assets/images/pdf.png',
      doc: '../../../assets/images/doc.png',
      docx: '../../../assets/images/doc.png',
      xls: '../../../assets/images/xls.png',
      xlsx: '../../../assets/images/xls.png',
      ppt: '../../../assets/images/ppt.png',
      csv: '../../../assets/images/csv.png',
      other: '../../../assets/images/file.png'
    };
    return iconMapping[extension || 'other'] || iconMapping['other'];
  }

  getFileUrl(file: File): string {
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url); // Track URLs for cleanup
    return url;
  }

  cleanupObjectUrls(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
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
  renderType: string;
  downloadUrl?: string;
}