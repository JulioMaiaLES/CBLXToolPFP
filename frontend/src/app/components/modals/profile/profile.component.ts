import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<ProfileComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  // Method to open the file explorer
  onEditImageClick(): void {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection and validate file type
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    
    if (file) {
      console.log('Selected file:', file);

      // Handle the file here (e.g., upload, preview, etc.)
    }
  }
}