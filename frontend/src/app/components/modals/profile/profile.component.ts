import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent {

  previewImage: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    private http: HttpClient
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  // Method to open the file explorer
  onEditImageClick(): void {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection and validate file type
  
  //Implementação Básica:
  
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const file = input?.files?.[0];
    
  //   if (file) {
  //     console.log('Selected file:', file);

  //     // Handle the file here (e.g., upload, preview, etc.)
  //   }
  // }

  //___________________________

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
  
    if (!file) return;
  
    // 1. Validate File Type and Size
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      console.error('Invalid file type');
      alert('Only .jpg, .png, and .svg files are allowed.');
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) { // 2MB size limit
      console.error('File too large');
      alert('File size should not exceed 2MB.');
      return;
    }
  
    // 2. Convert to Base64 and Prepare Payload
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log('Base64 Image:', base64);
  
      const payload = {
        userId: 'current_user_id', // Replace with the actual user ID
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        imageData: base64,
      };
  
      // Send Base64 payload to backend
      this.uploadBase64Image(payload);
  
      // 4. Preview the Image
      this.previewImage = base64; // Show the image preview
    };
    reader.readAsDataURL(file);
  
    // 3. Use FormData for Multipart Upload
    const formData = new FormData();
    formData.append('userId', 'current_user_id'); // Replace with actual user ID
    formData.append('profileImage', file);
  
    // Send FormData to backend
    this.uploadFormDataImage(formData);
  }
  
  uploadBase64Image(payload: any): void {
    this.http.post('backend/api/upload-profile-image', payload).subscribe({
      next: () => console.log('Base64 Image uploaded successfully!'),
      error: (err) => console.error('Error uploading Base64 image:', err),
    });
  }
  
  uploadFormDataImage(formData: FormData): void {
    this.http.post('backend/api/upload-profile-image', formData).subscribe({
      next: () => console.log('FormData Image uploaded successfully!'),
      error: (err) => console.error('Error uploading FormData image:', err),
    });
  }
  

  compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 800; // Max width or height
          let { width, height } = img;
  
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Compression failed.'));
            },
            file.type,
            0.8 // Compression quality (0 to 1)
          );
        };
      };
      reader.readAsDataURL(file);
    });
  }
  
  async uploadCompressedImage(file: File): Promise<void> {
    try {
      const compressedFile = await this.compressImage(file);
      const formData = new FormData();
      formData.append('userId', 'current_user_id'); // Replace with actual user ID
      formData.append('profileImage', compressedFile, file.name);
  
      this.http.post('backend/api/upload-profile-image', formData).subscribe({
        next: () => console.log('Compressed image uploaded successfully!'),
        error: (err) => console.error('Error uploading compressed image:', err),
      });
    } catch (error) {
      console.error(error);
      alert('Failed to compress the image. Please try again.');
    }
  }

}