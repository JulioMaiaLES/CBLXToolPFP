// engage.component.ts
import { Component, HostListener, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '@app/components/modal/modal.component';
import { EngageService } from '@app/services/engage.service';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Observable } from 'rxjs';
import { SidebarService } from '../../../app/services/sidebar.service'
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from '@app/services/drag-drop.service';

@Component({
  selector: 'app-engage',
  templateUrl: './engage.component.html',
  styleUrls: ['./engage.component.scss'],
})
export class EngageComponent implements OnInit{

  contentHeight = 500; // Initial height of content wrapper (fictional value)
  maxContentHeight = 800; // Maximum height before stopping expansion (fictional value)
  expansionStep = 20; // Amount to expand each time
  isTabCollapsed: boolean = false;
  isPaginationCollapsed: boolean = false;
  isFullWidth: boolean = false;
  isHalfWidth: boolean = false;
  pages: Array<{ id: number; title: string; formGroup: FormGroup }> = [];
  currentPageId: number = 1; // Default to Page 1
  currentPage: any; 
  title: string = 'Título'; // Default title for new pages
  isEditingTitle: boolean = false;
  blocks: Array<{ type: string; data: any }> = [];
  droppedBlocks: any[] = []; // Stores the blocks added to the screen
  droppedBlocks$ = this.dragDropService.blocks$;

  engageData: {
    [key: string]: string[];  // Allow indexing with a string key
    big_idea: string[];
    essential_question: string[];
    challenge: string[];
  } = { big_idea: [], essential_question: [], challenge: [] };

  // Boolean to track whether the content box is collapsed or expanded
  expandedPhase: string | null = null;
  isMenuHidden: boolean = true;  // Explicitly declare boolean type (optional)
  files: File[] = [];  // No changes needed, already correctly typed
  renderedFiles: RenderedFile[] = [];  // Properly typed with the interface defined
  images: { name: string; value: string }[] = [];  // No changes needed, correctly typed

  engageForm!: FormGroup;  // Initialized in ngOnInit, so non-null assertion is fine
  otherPageForm!: FormGroup;

  private debounceTimer!: ReturnType<typeof setTimeout>;  // Correct type declaration for debounceTimer
  private fileReader: FileReader = new FileReader();  // No changes needed, properly initialized
  private objectUrls: string[] = [];  // Initialized properly to hold URLs
  private saveTimeout!: ReturnType<typeof setTimeout>; // Declare saveTimeout

  dataBlocks = [
    { type: 'text', data: 'Default Text' },
    { type: 'image', data: 'path/to/image.jpg' },
    { type: 'table', data: {} },
    { type: 'file', data: 'path/to/file.pdf' },
  ];

  constructor(
    private fb: FormBuilder,
    private engageService: EngageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
    private progressService: ProgressService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dragDropService: DragDropService
  ) {
    this.updateCurrentPage();
  }

  ngOnInit() {
    // Initialize the form with FormArrays for each phase
    this.engageForm = this.fb.group({
      big_idea: this.fb.array([this.createField()]),
      essential_question: this.fb.array([this.createField()]),
      challenge: this.fb.array([this.createField()]),
    });
  
    // Load the engage data (if needed for pre-existing data)
    this.loadEngageData();
  
    // Handle query parameters to determine the expanded phase
    this.route.queryParamMap.subscribe(params => {
      const phase = params.get('phase');
      if (phase) {
        this.expandedPhase = phase;
      }
    });

    this.otherPageForm = this.fb.group({
      content: [''],
    });

    // Initialize with a default page
    this.addNewPage();
    this.blocks = [];

    if (this.pages.length > 0) {
      this.currentPageId = this.pages[0].id; // Set the default page to the first page
    }
  }

  onDrop(event: CdkDragDrop<any>) {
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

  stopEditingTitle(event: KeyboardEvent): void {
    console.log('Stop editing title', event);
  }

  startEditingTitle(): void {
    this.isEditingTitle = true;
  }

  // startEditingTitle(): void {
  //   this.isEditingTitle = true;
  // }

  // stopEditingTitle(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.title = input.value;
  //   this.isEditingTitle = false;
  // }

  onPageChange(page: number): void {
    this.currentPageId = page;
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

   // Method to handle textarea resizing and content wrapper expansion
   handleTextareaResize(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    
    // Reset textarea height to auto to correctly calculate scroll height
    target.style.height = 'auto';
    const newHeight = target.scrollHeight;

    // Check if the textarea height exceeds the wrapper's current height
    if (newHeight >= this.contentHeight && this.contentHeight < this.maxContentHeight) {
      // Increase content wrapper height by the expansion step
      this.contentHeight += this.expansionStep;
    }

    // Apply the new height to the textarea
    target.style.height = `${newHeight}px`;
  }

  loadEngageData(): void {
    this.engageService.getEngage().subscribe({
      next: (response) => {
        if (response.data) {
          this.engageData = response.data;
          this.populateForm();
          console.log('Engage data loaded successfully', this.engageData);
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      error: (error) => console.error('Failed to load engage data:', error),
    });
  }

  populateForm(): void {
    // Destructure engageData with default values
    const { big_idea = '', essential_question = '', challenge = '' } = this.engageData;
  
    // Convert to arrays properly
    this.setFields('big_idea', this.convertToArray(big_idea));
    this.setFields('essential_question', this.convertToArray(essential_question));
    this.setFields('challenge', this.convertToArray(challenge));
  }
  
  // Update this function to handle empty strings correctly
  convertToArray(data: string | string[]): string[] {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'string') {
      if (data.trim() === '') {
        return ['']; // Return array with an empty string to create a text area
      }
      return data.split(','); // Split by commas or another delimiter if needed
    }
    return []; // Return an empty array if the data is null or not a valid string
  }
  
  setFields(fieldName: string, fieldData: string[]): void {
    const formArray = this.engageForm.get(fieldName) as FormArray;
    formArray.clear(); // Clear existing FormArray
    
    // Create form controls for each entry in fieldData, including empty strings
    fieldData.forEach(data => {
      formArray.push(this.fb.group({
        content: [data, Validators.required],
      }));
    });
  }
  

  get bigIdeaFields(): FormArray {
    return this.engageForm.get('big_idea') as FormArray;
  }

  get essentialQuestionFields(): FormArray {
    return this.engageForm.get('essential_question') as FormArray;
  }

  get challengeFields(): FormArray {
    return this.engageForm.get('challenge') as FormArray;
  }

  createField(): FormGroup {
    return this.fb.group({
      content: ['', Validators.required],
    });
  }

  addFields(fieldName: string, count: number): void {
    const control = this.engageForm.get(fieldName) as FormArray;
    
    // Instead of pushing multiple at once, map through and add each individually
    for (let i = 0; i < count; i++) {
      control.push(this.createField());
    }
  }
  
  saveDataWithDebounce(formData: { [key: string]: string[] }): void {
    // Clear the existing timeout if there's one
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
  
    // Set a new timeout to debounce the save operation
    this.saveTimeout = setTimeout(() => {
      this.saveData(formData).subscribe({
        next: (response) => console.log('Data saved successfully', response),
        error: (error) => console.error('Failed to save data:', error),
      });
    }, 500); // Adjust debounce time as needed
  }
  

  onFormSubmit(event: Event, fieldName: string, index: number): void {
    // event.preventDefault();
  
    const fieldArray = this.engageForm.get(fieldName) as FormArray;
    const field = fieldArray.at(index); // Get the specific field by index
  
    if (!field.valid) {
      console.log('Field is empty or invalid. Aborting submission.');
      return;
    }
  
    // Get the new value from the form field
    const fieldValue = field.get('content')?.value.trim();
  
    if (fieldValue) {
      // Ensure engageData is properly updated
      if (Array.isArray(this.engageData[fieldName])) {
        // If engageData[fieldName] is an array, update it accordingly
        this.engageData[fieldName].splice(index, 1, fieldValue);
      } else {
        // Otherwise, assign the new value directly
        this.engageData[fieldName] = fieldValue;
      }
    }
  
    // Save all filled fields with debounce to avoid repeated saves
    this.saveDataWithDebounce(this.engageData);
  
    // Optionally, add a new field after the current one is submitted
    this.addFields(fieldName, 1);
  }
  

  // handleEnterAndSubmit(event: Event, fieldName: string, index: number): void {
  //   // event.preventDefault(); 

  //   // Submit the form data for the current field
  //   this.onFormSubmit(event, fieldName, index);

  //   // Retrieve the current form control and its value
  //   const fieldArray = this.engageForm.get(fieldName) as FormArray;
  //   const field = fieldArray.at(index);
  //   const currentValue = field.get('content')?.value || '';

  //   // Add a new line after submission in the same textarea
  //   field.get('content')?.setValue(currentValue + '\n');

  //   // Delay refocusing to ensure the cursor stays in the same textarea
  //   setTimeout(() => {
  //     const textArea = document.querySelectorAll('.textos')[index] as HTMLTextAreaElement;
  //     if (textArea) {
  //       textArea.focus();
  //       // Move the cursor to the end of the text in the current field
  //       textArea.setSelectionRange(textArea.value.length, textArea.value.length);
  //     }
  //   }, 0); // Delay to allow the DOM update to complete
  // }

  saveData(formData: any): Observable<any> {
    return this.engageService.createOrUpdateEngage(formData);
  }

  updateProgress() {
    this.progressService.answeredQuestions++;
    this.progressService.engageProgress = Math.round((this.progressService.answeredQuestions / this.progressService.totalQuestions) * 100);
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
  
  // Method to track if a phase is expanded
  isExpanded(phase: string): boolean {
    return this.expandedPhase === phase;
  }

  // Toggle phase open or close based on `phase`
  togglePhase(phase: string): void {
    this.expandedPhase = this.isExpanded(phase) ? null : phase;
  }

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


