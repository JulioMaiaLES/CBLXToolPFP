import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent {

  constructor(public dialogRef: MatDialogRef<ProfileComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }

}
