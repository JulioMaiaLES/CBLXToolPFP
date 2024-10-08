import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AuthService } from './../../../services/auth.service';

interface Data {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  constructor(
    @Inject(DIALOG_DATA) private data: Data,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private notifier: NotifierService
  ) {}

  loading = false;
  form = this.fb.group({
    email: [this.data.email, [Validators.required, Validators.email]],
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
        this.notifier.notify('success', 'E-mail enviado com sucesso');
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
