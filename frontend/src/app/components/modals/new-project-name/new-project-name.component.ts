import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AuthService } from './../../../services/auth.service';

interface Data {
  name: string;
}

@Component({
  selector: 'app-new-project-name',
  templateUrl: './new-project-name.component.html',
  styleUrls: ['./new-project-name.component.scss'],
})
export class NewProjectName {
  constructor(
    @Inject(DIALOG_DATA) private data: Data,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<NewProjectName>,
    private notifier: NotifierService
  ) {}

  loading = false;
  form = this.fb.group({
    email: [this.data.name, [Validators.required, Validators.email]],
  });

  handleFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.setLoading(true);
    this.authService.forgotPassword(this.form.value as string).subscribe({
      next: () => {
        this.setLoading(false);
        this.notifier.notify('success', 'Projeto criado com sucesso!');
        this.dialogRef.close();
      },
      error: () => {
        this.setLoading(false);
      },
    });
  }

  setLoading(value: boolean) {
    this.loading = value;
    this.dialogRef.disableClose = value;
  }
}
