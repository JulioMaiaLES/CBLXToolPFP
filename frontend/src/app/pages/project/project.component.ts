// project.component.ts
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '@services/project.service';
import { AuthService } from '@services/auth.service';
import { StorageService } from '@services/storage.service';
import { NewProjectName } from '@app/components/modals/new-project-name/new-project-name.component';
import { ChangeDetectorRef } from '@angular/core';
import { CookiesLoginComponent } from '@components/modals/cookies-login/cookies-login.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public storage: StorageService,
    private authService: AuthService,
    private projectService: ProjectService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login_form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  ngOnInit(): void {
    this.awaitRemember();
    this.loadUserProjects();
  }

  awaitRemember() {
    this.login_form.get('remember')?.valueChanges.subscribe((value) => {
      if (!value) return;

      if (!this.storage.cookies) {
        this.openCookieDialog();
      }
    });
  }

  handleCreateProject() {
    console.log('Opening create project dialog...');
    const dialogRef = this.dialog.open(NewProjectName, {
      data: {
        email: this.login_form.get('email')?.value,
        message: 'Insira o nome do novo projeto:'
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserProjects();
      } else {
        console.log('Create project dialog was closed without data.');
      }
    });
  }
  

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      (data) => {
        console.log('Projects loaded:', data);  // Verifica se os projetos estão sendo retornados
        this.projects = data;  // Armazena os projetos retornados na variável `projects`
        this.cdr.detectChanges();  // Força a atualização da tela
      },
      (error) => {
        console.error('Erro ao carregar os projetos:', error);
      }
    );
  }

  openCookieDialog() {
    console.log('Opening cookie dialog...');
    const dialogRef = this.dialog.open(CookiesLoginComponent, {
      panelClass: 'cookies-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.storage.cookies = true;
      } else {
        this.login_form.get('remember')?.setValue(false);
      }
    });
  }
}
