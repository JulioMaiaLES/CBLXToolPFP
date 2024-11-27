import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '@app/components/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ActService } from '@app/services/act.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from '../../../app/services/sidebar.service'
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from '@app/services/drag-drop.service';

@Component({
  selector: 'app-act',
  templateUrl: './act.component.html',
  styleUrls: ['./act.component.scss'],
})
export class ActComponent {

  actIconPath: string = '../../../assets/images/edit-icon-blue.png';
  isTabCollapsed: boolean = false;
  isPaginationCollapsed: boolean = false;
  isFullWidth: boolean = false;
  expandedPhase: string | null = null;
  draggedItem: string | null = null;
  isMenuHidden: boolean = true;
  textAreas: string[] = [''];
  files: File[] = [];  // No changes needed, already correctly typed
  renderedFiles: RenderedFile[] = [];  // Properly typed with the interface defined
  images: { name: string; value: string }[] = [];  // No changes needed, correctly typed
  pages: Array<{ id: number; title: string; formGroup: FormGroup }> = [];
  currentPageId: number = 1; // Default to Page 1
  currentPage: any; 
  title: string = 'Título'; // Default title for new pages
  isEditingTitle: boolean = false;
  blocks: Array<{ type: string; data: any }> = [];
  droppedBlocks: any[] = []; // Stores the blocks added to the screen
  droppedBlocks$ = this.dragDropService.blocks$;

  private debounceTimer!: ReturnType<typeof setTimeout>;  // Correct type declaration for debounceTimer
  private fileReader: FileReader = new FileReader();  // No changes needed, properly initialized
  private objectUrls: string[] = [];

  // actForm: FormGroup;
  // otherPageForm!: FormGroup;

  // Use ViewChild to reference the file input element
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  dataBlocks = [
    { type: 'text', data: 'Default Text' },
    { type: 'image', data: 'path/to/image.jpg' },
    { type: 'table', data: {} },
    { type: 'file', data: 'path/to/file.pdf' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalComponent>, 
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private dragDropService: DragDropService
    // private actService: ActService
  ) {
    this.updateCurrentPage();
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const phase = params.get('phase');
      if (phase) {
        this.expandedPhase = phase;
      }
    });

    // Initialize with a default page
    this.addNewPage();
  }

  onDropZone(event: CdkDragDrop<any>) {
    console.log('Drop Event Triggered:', event);
  
    if (event.previousContainer !== event.container) {
      const droppedBlock = event.item.data;
      console.log('Dropped Block:', droppedBlock);
  
      // Add the dropped block to the `blocks` array
      this.blocks.push({
        type: droppedBlock.component.toLowerCase(), // Ensure consistent lowercase type
        data: this.initializeBlockData(droppedBlock.component),
      });
  
      console.log('Updated Blocks:', this.blocks);
    }
  }

  initializeBlockData(type: string): any {
    switch (type.toLowerCase()) {
      case 'text':
        return { text: 'Default text content' };
      case 'image':
        return { src: 'path/to/default-image.jpg', alt: 'Default image description' };
      case 'table':
        return { rows: [[{ value: 'Cell 1' }, { value: 'Cell 2' }]], columns: ['Column 1', 'Column 2'] };
      case 'file':
        return { fileName: 'example.pdf', filePath: 'path/to/example.pdf' };
      default:
        return {};
    }
  }

  startEditingTitle(): void {
    this.isEditingTitle = true;
  }

  stopEditingTitle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.title = input.value;
    this.isEditingTitle = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  addNewPage(): void {
    const newPageId = this.pages.length + 1;
    const newPage = {
      id: newPageId,
      title: `Página ${newPageId}`,
      formGroup: this.fb.group({ content: [''] }),
    };
    this.pages.push(newPage);
    // this.selectPage(newPageId); 
  }

  // Update the current page object based on currentPageId
  private updateCurrentPage(): void {
    this.currentPage = this.pages.find((page) => page.id === this.currentPageId);
  }
  

  selectPage(pageId: number): void {
    this.currentPageId = pageId;
    this.updateCurrentPage();
  }

  getCurrentPage(): any {
    return this.pages.find((page) => page.id === this.currentPageId);
  }


 // Method to handle the toggle state from app-tab
  handleTabToggle(isCollapsed: boolean): void {
    this.isTabCollapsed = isCollapsed;
    this.updateFormWidth();
  }

  togglePagination(): void {
    this.isPaginationCollapsed = !this.isPaginationCollapsed;
    this.updateFormWidth();
  }

  private updateFormWidth(): void {
    this.isFullWidth = this.isTabCollapsed || (this.isTabCollapsed && this.isPaginationCollapsed);
  }

  // Method to track if a phase is expanded
  isExpanded(phase: string): boolean {
    return this.expandedPhase === phase;
  }

  // Toggle phase open or close based on `phase`
  togglePhase(phase: string): void {
    this.expandedPhase = this.isExpanded(phase) ? null : phase;
  }

  onDragStart(event: DragEvent, itemType: string) {
    this.draggedItem = itemType;
    console.log('Dragging:', itemType); // Debugging log
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow dropping
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDrop(event: DragEvent, phase: string) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    console.log(`Dropped on ${phase}`); // Debugging log

    if (this.draggedItem === 'image') {
      this.fileInputRef.nativeElement.click(); // Trigger file input
    } else if (this.draggedItem) {
      this.addContentToPhase(phase, this.draggedItem);
    }

    this.draggedItem = null; // Reset dragged item
  }

  

  onFileSelected(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const file = inputElement.files[0];
      this.renderImage(file);
    }
  }

  private renderImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.style.maxWidth = '100%';
      this.addImageToPhase('big_idea', img); // Example: Add to Big Idea phase
    };
    reader.readAsDataURL(file);
  }

  private addImageToPhase(phase: string, image: HTMLImageElement) {
    const phaseBody = document.querySelector(`[formArrayName="${phase}"] .phase-body`) as HTMLElement;
    if (phaseBody) {
      phaseBody.appendChild(image);
    }
  }

  private addContentToPhase(phase: string, contentType: string) {
    const phaseBody = document.querySelector(`[formArrayName="${phase}"] .phase-body`) as HTMLElement;

    let element: HTMLElement;
    switch (contentType) {
      case 'text':
        element = document.createElement('p');
        element.textContent = 'New Text Element';
        break;
      case 'table':
        element = document.createElement('table');
        element.innerHTML = '<tr><td>New Table</td></tr>';
        break;
      default:
        return;
    }

    if (phaseBody) {
      phaseBody.appendChild(element);
    }
  }




//   toggleMenu(): void {
//     this.sidebarService.toggleSidebar();  // Delegate toggling to the SidebarService
//   }

//   adicionarLinha():void {
//     this.textAreas.push('');
//   }

//   onFileSelected(event: any): void {
//     const inputElement = event?.target as HTMLInputElement;
//     if (inputElement && inputElement.files) {
//       const files: FileList = inputElement.files;
//       for (let i = 0; i < files.length; i++) {
//         const file: File = files[i];
//         const renderType = this.determineRenderType(file);
//         const renderedFile: RenderedFile = { file, renderType };
//         if (renderType === 'pdf') {
//           renderedFile.downloadUrl = this.getFileUrl(file);
//         }
//         this.renderedFiles.push(renderedFile);
//       }
//     }
//   }

//   determineRenderType(file: File): 'image' | 'pdf' | 'other' {
//     if (file.type.includes('image')) {
//       return 'image';
//     } else if (file.type.includes('pdf')) {
//       return 'pdf';
//     } else {
//       return 'other';
//     }
//   }

//   getFileUrl(file: File): string {
//     const url = URL.createObjectURL(file);
//     this.objectUrls.push(url); // Track URLs for cleanup
//     return url;
//   }
  
//   cleanupObjectUrls(): void {
//     this.objectUrls.forEach(url => URL.revokeObjectURL(url));
//     this.objectUrls = [];
//   }
  
//   downloadFile(file: File) {
//     const url = this.getFileUrl(file);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = file.name;
//     a.click();
//   }

//   @HostListener('document:keydown', ['$event'])
//   handleKeyboardEvent(event: KeyboardEvent) {
//     if (event.key === '/') {
//       clearTimeout(this.debounceTimer);
//       this.debounceTimer = setTimeout(() => this.openModal(), 300);
//     }
//   }

//   // Helper method to process files
//   private processFiles(files: FileList): void {
//     const fileArray = Array.from(files); // Convert FileList to an array once

//     fileArray.forEach(file => {
//       if (this.isImage(file)) {
//         this.imageRenderer(file); // Process image files
//       } else {
//         this.files.push(file); // Store non-image files in this.files
//       }
//     });

//     // Optional: Log the processed files or remove this in production
//     console.log('Non-image files:', this.files);
//   }

//   // Check if the file is an image based on its type
//   private isImage(file: File): boolean {
//     return file.type.startsWith('image/');
//   }

//  // Image rendering method
//   private imageRenderer(file: File): void {
//     this.fileReader.onload = () => {
//       this.images.push({
//         name: file.name,
//         value: this.fileReader.result as string // Store image as base64 string
//       });
//     };
//     this.fileReader.readAsDataURL(file); // Read the image file as a Data URL
//   }

//   openModal(): void {
//     import('@app/components/modal/modal.component').then(({ ModalComponent }) => {
//       const dialogRef = this.dialog.open(ModalComponent, {
//         width: '250px',
//       });
  
//       dialogRef.afterClosed().subscribe((files: FileList | null) => {
//         if (files && files.length > 0) {
//           this.processFiles(files); // Delegate file processing to a helper method
//         }
//       });
//     });
//   }

  // createAct(actData: any){
  //   this.actService.createEngage(actData).subscribe(
  //     (response) => {
  //       console.log('Act created Successfully');
  //     },
  //     (error) => {
  //       console.error('Error creating engage:', error)
  //     }
  //   )
  // }

  // getFileIcon(file: File) {
  //   if (file.type.includes('pdf')) {
  //     return '../../../assets/images/pdf.png';
  //   } else if (file.type.includes('csv')) {
  //     return '../../../assets/images/csv.png';
  //   } else if (file.type.includes('ppt')) {
  //     return '../../../assets/images/ppt.png';
  //   } else if (file.type.includes('xls')) {
  //     return '../../../assets/images/xls.png';
  //   } else if (file.type.includes('doc') || file.type.includes('word')) {
  //     return '../../../assets/images/doc.png';
  //   } else{
  //     return '../../../assets/images/file.png';
  //   }
  // }

  // autoResize(event: Event): void {
  //   const target = event.target as HTMLTextAreaElement;
  //   target.style.height = 'auto'; // Reset height to auto first
  //   target.style.height = `${Math.min(target.scrollHeight, 400)}px`; // Restrict height, max 400px
  // }

  autoResize(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto'; // Reset height
    target.style.height = target.scrollHeight + 'px'; // Set height to fit content
  
    // Adjust the step-container height based on the textarea content
    const stepContainer = target.closest('.step-container') as HTMLElement;
    if (stepContainer) {
      stepContainer.style.height = 'auto'; // Reset height
      stepContainer.style.height = Math.max(target.scrollHeight + 40, 90) + 'px'; // Adjust as needed, 40px for padding
    }
  }

}

interface RenderedFile {
  file: File;
  renderType: 'image' | 'pdf' | 'other';
  downloadUrl?: string;
}