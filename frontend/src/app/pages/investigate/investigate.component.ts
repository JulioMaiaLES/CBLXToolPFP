
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SidebarService } from '../../../app/services/sidebar.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-investigate',
  templateUrl: './investigate.component.html',
  styleUrls: ['./investigate.component.scss']
})
export class InvestigateComponent {
  @ViewChild('componenteContainer', { read: ViewContainerRef }) componenteContainer!: ViewContainerRef;
  @ViewChild(ModalInvestigateComponent) modal!: ModalInvestigateComponent;
  
  expandedPhase: string | null = null;
  isMenuHidden: boolean = true;  // Explicitly declare boolean type (optional)
  textAreas: string[] = [''];
  files: File[] = [];  // No changes needed, already correctly typed
  renderedFiles: RenderedFile[] = [];  // Properly typed with the interface defined
  images: { name: string; value: string }[] = [];  // No changes needed, correctly typed

  private debounceTimer!: ReturnType<typeof setTimeout>;  // Correct type declaration for debounceTimer
  private fileReader: FileReader = new FileReader();  // No changes needed, properly initialized
  private objectUrls: string[] = [];


  investigateForm: FormGroup;

  constructor(
    private progressService: ProgressService,
    private investigateService: InvestigateService,
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalComponent>,
    private sidebarService: SidebarService,
    private route: ActivatedRoute
  ) {
    this.investigateForm = new FormGroup({
      guiding_question: new FormControl('', Validators.required),
      guiding_resource: new FormControl('', Validators.required),
      guiding_activity: new FormControl('', Validators.required),
      result: new FormControl('', Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const phase = params.get('phase');
      if (phase) {
        this.expandedPhase = phase;
      }
    });
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
  
  autoResize(event: any) {
    const target = event.target;
    if (target.scrollHeight !== target.clientHeight) {
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    }
  }

}

interface RenderedFile {
  file: File;
  renderType: 'image' | 'pdf' | 'other';
  downloadUrl?: string;
}



