import { Component, HostListener } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '@app/components/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ActService } from '@app/services/act.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from '../../../app/services/sidebar.service'


@Component({
  selector: 'app-act',
  templateUrl: './act.component.html',
  styleUrls: ['./act.component.scss'],
})
export class ActComponent {
  isMenuHidden: boolean = true;
  textAreas: string[] = [''];
  files: File[] = [];  // No changes needed, already correctly typed
  renderedFiles: RenderedFile[] = [];  // Properly typed with the interface defined
  images: { name: string; value: string }[] = [];  // No changes needed, correctly typed

  private debounceTimer!: ReturnType<typeof setTimeout>;  // Correct type declaration for debounceTimer
  private fileReader: FileReader = new FileReader();  // No changes needed, properly initialized
  private objectUrls: string[] = [];

  actForm: FormGroup;

  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalComponent>, 
    private sidebarService: SidebarService,
    private actService: ActService) {
      this.actForm = new FormGroup({
        image: new FormControl('', Validators.required),
        file: new FormControl('', Validators.required),
        text_input: new FormControl('', Validators.required),
      });
  }

  toggleMenu(): void {
    this.sidebarService.toggleSidebar();  // Delegate toggling to the SidebarService
  }

  adicionarLinha():void {
    this.textAreas.push('');
  }
  
  

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

  determineRenderType(file: File): 'image' | 'pdf' | 'other' {
    if (file.type.includes('image')) {
      return 'image';
    } else if (file.type.includes('pdf')) {
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
  
  downloadFile(file: File) {
    const url = this.getFileUrl(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.openModal(), 300);
    }
  }

  // Helper method to process files
  private processFiles(files: FileList): void {
    const fileArray = Array.from(files); // Convert FileList to an array once

    fileArray.forEach(file => {
      if (this.isImage(file)) {
        this.imageRenderer(file); // Process image files
      } else {
        this.files.push(file); // Store non-image files in this.files
      }
    });

    // Optional: Log the processed files or remove this in production
    console.log('Non-image files:', this.files);
  }

  // Check if the file is an image based on its type
  private isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

 // Image rendering method
  private imageRenderer(file: File): void {
    this.fileReader.onload = () => {
      this.images.push({
        name: file.name,
        value: this.fileReader.result as string // Store image as base64 string
      });
    };
    this.fileReader.readAsDataURL(file); // Read the image file as a Data URL
  }

  openModal(): void {
    import('@app/components/modal/modal.component').then(({ ModalComponent }) => {
      const dialogRef = this.dialog.open(ModalComponent, {
        width: '250px',
      });
  
      dialogRef.afterClosed().subscribe((files: FileList | null) => {
        if (files && files.length > 0) {
          this.processFiles(files); // Delegate file processing to a helper method
        }
      });
    });
  }

  createAct(actData: any){
    this.actService.createEngage(actData).subscribe(
      (response) => {
        console.log('Act created Successfully');
      },
      (error) => {
        console.error('Error creating engage:', error)
      }
    )
  }

  getFileIcon(file: File) {
    if (file.type.includes('pdf')) {
      return '../../../assets/images/pdf.png';
    } else if (file.type.includes('csv')) {
      return '../../../assets/images/csv.png';
    } else if (file.type.includes('ppt')) {
      return '../../../assets/images/ppt.png';
    } else if (file.type.includes('xls')) {
      return '../../../assets/images/xls.png';
    } else if (file.type.includes('doc') || file.type.includes('word')) {
      return '../../../assets/images/doc.png';
    } else{
      return '../../../assets/images/file.png';
    }
  }

autoResize(event: any) {
  const target = event.target;
  // Reset height to auto to calculate new height
  target.style.height = 'auto';
  // Set new height based on scrollHeight
  target.style.height = target.scrollHeight + 'px';

  // Reset width to auto to calculate new width
  target.style.width = 'auto';
  // Set new width based on scrollWidth
  target.style.width = target.scrollWidth + 'px';
}


}

interface RenderedFile {
  file: File;
  renderType: 'image' | 'pdf' | 'other';
  downloadUrl?: string;
}