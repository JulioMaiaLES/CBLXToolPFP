import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  renderedFiles: RenderedFile[] = [];

  constructor(public dialogRef: MatDialogRef<ModalComponent>) { }

  onFileSelected(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files: FileList = inputElement.files;
      this.dialogRef.close(files);
    }
  }

  

  // Método para determinar o tipo de arquivo
  getFileType(file: File): 'image' | 'pdf' | 'other' {
    if (file.type.includes('image')) {
      return 'image';
    } else if (file.type.includes('pdf')) {
      return 'pdf';
    } else {
      return 'other';
    }
  }

  // Método para obter a URL do arquivo para download
  getFileUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}

interface RenderedFile {
  file: File;
  renderType: 'image' | 'pdf' | 'other';
  downloadUrl?: string;
}
