
import { ProgressService } from '../../services/progress.service';
import { ResizableModule } from 'angular-resizable-element';
import { AngularSplitModule } from 'angular-split';
import { Component, ViewChild, ViewContainerRef, HostListener} from '@angular/core';
import { TabelaComponent } from '@app/components/tabela/tabela.component';
import { TabelaVariavelComponent } from '@app/components/tabelavariavel/tabelavariavel.component';
import { CblCanvasComponent } from '@app/components/cbl-canvas/cbl-canvas.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { ModalInvestigateComponent } from '@app/components/modals/modal-investigate/modal-investigate.component';
import { InvestigateService } from '@app/services/investigate.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SidebarService } from '../../../app/services/sidebar.service'
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from '@app/services/drag-drop.service';

@Component({
  selector: 'app-investigate',
  templateUrl: './investigate.component.html',
  styleUrls: ['./investigate.component.scss']
})
export class InvestigateComponent {
  @ViewChild('componenteContainer', { read: ViewContainerRef }) componenteContainer!: ViewContainerRef;
  @ViewChild(ModalInvestigateComponent) modal!: ModalInvestigateComponent;
 
  investigateIconPath = '../../../assets/images/edit-icon-yellow.png';
  isTabCollapsed: boolean = false;
  isPaginationCollapsed: boolean = false;
  isFullWidth: boolean = false;
  expandedPhase: string | null = null;
  isMenuHidden: boolean = true;  // Explicitly declare boolean type (optional)
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


  investigateForm: FormGroup;
  otherPageForm!: FormGroup;

  dataBlocks = [
    { type: 'text', data: 'Default Text' },
    { type: 'image', data: 'path/to/image.jpg' },
    { type: 'table', data: {} },
    { type: 'file', data: 'path/to/file.pdf' },
  ];

  constructor(
    private fb: FormBuilder,
    private progressService: ProgressService,
    private investigateService: InvestigateService,
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalComponent>,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private dragDropService: DragDropService
  ) {
    this.investigateForm = new FormGroup({
      guiding_question: new FormControl('', Validators.required),
      guiding_resource: new FormControl('', Validators.required),
      guiding_activity: new FormControl('', Validators.required),
      result: new FormControl('', Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required)
    });

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


  isExpanded(phase: string): boolean {
    return this.expandedPhase === phase;
  }

  togglePhase(phase: string): void {
    if (this.expandedPhase === phase) {
      this.expandedPhase = null; // Collapse if already expanded
    } else {
      this.expandedPhase = phase; // Expand the selected phase
    }
  }
  
  toggleMenu(): void {
    this.sidebarService.toggleSidebar();
  }

  adicionarLinha():void {
    this.textAreas.push('');
  }

  // showModal() {
  //   this.isModalVisible = true;
  // }

  // closeModal() {
  //   this.isModalVisible = false;
  // }

  updateProgress() {
    this.progressService.investigateProgress = Math.round((this.progressService.answeredQuestions / this.progressService.totalQuestions) * 100);
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

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === '/') {
  //     clearTimeout(this.debounceTimer);
  //     this.debounceTimer = setTimeout(() => this.openModal(), 300);
  //   }
  // }

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

  createInvestigate(investigateData: any){
    
    this.investigateService.createInvestigate(investigateData).subscribe(
      (response) => {
        console.log('Investigate created successfully');
      },
      (error) =>{
        console.error('Error creating investigate', error);
      }
    );
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
  
  // Automatically resize the textarea height based on content
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



