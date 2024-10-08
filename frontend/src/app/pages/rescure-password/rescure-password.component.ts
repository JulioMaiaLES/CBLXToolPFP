import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { zoomInAnimation } from '@animations/route-animation';
import { AuthService } from '@app/services/auth.service';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnBrPackage from '@zxcvbn-ts/language-pt-br';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-rescure-password',
  templateUrl: './rescure-password.component.html',
  styleUrls: ['./rescure-password.component.scss'],
  animations: [zoomInAnimation],
})
export class RescurePasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService
  ) {}

  email = '';
  hash = '';

  loading = false;
  view_pass = false;
  view_repass = false;

  form = this.fb.group({
    password: ['', [Validators.required, this.validScore()]],
    re_password: ['', [Validators.required, this.samePassword()]],
  });

  score = 0;
  password_warning = '';
  password_suggestions: string[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.hash = params['hash'];

      if (!this.email || !this.hash) {
        this.router.navigate(['/']);
      }
    });

    this.form.get('password')?.valueChanges.subscribe((value) => {
      this.strengthPassword(value || '');
    });
  }

  handleFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const body = {
      email: this.email,
      forgot_password_hash: this.hash,
      new_password: this.form.value.password,
    };

    this.authService.rescurePassword(body).subscribe({
      next: () => {
        this.loading = false;
        this.notifier.notify('success', 'Senha alterada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  samePassword() {
    return (control: AbstractControl) => {
      const password = control.value;
      if (password) {
        if (password !== this.form.value.password) {
          return { diff_password: true };
        }
      }
      return null;
    };
  }

  validScore() {
    return (control: AbstractControl) => {
      const password = control.value;
      if (password) {
        if (this?.score < 3) {
          return { poor_password: true };
        }
      }
      return null;
    };
  }

  strengthPassword(password: string) {
    const options = {
      translations: zxcvbnBrPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnBrPackage.dictionary,
      },
    };
    zxcvbnOptions.setOptions(options);
    const passwordStatus = zxcvbn(password);
    this.score = passwordStatus.score;
    this.password_warning = passwordStatus.feedback.warning || '';
    this.password_suggestions = passwordStatus.feedback.suggestions;
  }
}
