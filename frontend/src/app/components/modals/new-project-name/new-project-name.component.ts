// new-project-name.component.ts
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AuthService } from './../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';

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
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<NewProjectName>,
    private notifier: NotifierService,
    private router: Router // Importa o Router para fazer o redirecionamento
  ) {}

  loading = false;
  form = this.fb.group({
    name: [this.data.name, [Validators.required]],
  });

  handleFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    // Pegar o token do AuthService
    const token = this.authService.getToken();
    if (!token) {
      // Se não houver token, redirecionar para a página de login manualmente
      this.notifier.notify('error', 'Usuário não autenticado. Faça login.');
      this.router.navigate(['/login']);
      return;
    }
  
    const projectName = this.form.value.name ?? ''; // Garantir que não seja null ou undefined
    const userEmail = 'usuario@example.com'; // Ajuste aqui para recuperar o email do AuthService ou de outro local
  
    const projectData = {
      name: projectName,
      email: userEmail,
    };
  
    this.setLoading(true);
    this.projectService.createProject(projectData).subscribe({
      next: () => {
        this.setLoading(false);
        this.notifier.notify('success', 'Projeto criado com sucesso!');
        // Feche o diálogo e retorne os dados do projeto para o componente pai
        this.dialogRef.close(projectData);
      },
      error: (err) => {
        this.setLoading(false);
        this.notifier.notify('error', 'Erro ao criar projeto: ' + err.message);
      },
    });
  }

  setLoading(value: boolean) {
    this.loading = value;
    this.dialogRef.disableClose = value;
  }
}
