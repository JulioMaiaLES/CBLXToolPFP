//project.component.ts
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '@services/project.service';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { StorageService } from '@services/storage.service';
import { NewProjectName } from '@app/components/modals/new-project-name/new-project-name.component';
import { ChangeDetectorRef } from '@angular/core';
import { CookiesLoginComponent } from '@components/modals/cookies-login/cookies-login.component';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProfileComponent } from '@app/components/modals/profile/profile.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: any[] = [];
  filteredProjects!: Observable<any[]>;
  profileImage: string | undefined;
  searchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public storage: StorageService,
    private authService: AuthService,
    private projectService: ProjectService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  login_form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  ngOnInit(): void {
    this.awaitRemember();
    this.loadUserProjects();
    this.loadUserProfile();
    
    this.filteredProjects = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProjects(value || ''))
    );
  }

  openProfileModal(): void {
    this.dialog.open(ProfileComponent, {
      width: '1200px', // Customize width and height as needed
      height: 'auto'
    });
  }

  filterProjects(value: string): { id: number; name: string }[] {
    const filterValue = value.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(filterValue)
    );
  }

  // Função para quando o usuário selecionar um projeto da lista
  onOptionSelected(selectedProjectName: string): void {
    const selectedProject = this.projects.find(project => project.name === selectedProjectName);
    if (selectedProject) {
      console.log('Projeto selecionado:', selectedProject);

      // Chamar a função para definir o projeto atual na sessão
      this.setCurrentProject(selectedProject.id);
    }
  }

  setCurrentProject(project: any): void {
    console.log('Definindo projeto atual:', project);
  
    if (project && project.id) {
      try {
        // Salvar o projeto completo no localStorage
        const projectData = JSON.stringify(project);
        console.log('Salvando no localStorage:', projectData);
  
        localStorage.setItem('currentProject', projectData);
  
        // Confirmação de que o projeto foi salvo corretamente
        const savedProject = localStorage.getItem('currentProject');
        console.log('Verificação após salvar (getItem):', savedProject);
  
        // Redirecionar para a página de jornada
        this.router.navigate(['/jornada']);
      } catch (error) {
        console.error('Erro ao salvar projeto no localStorage:', error);
      }
    } else {
      console.error('Erro: Projeto inválido ou sem ID:', project);
    }
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
    console.log('Abrindo diálogo de criação de projeto...');
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
        console.log('Diálogo de criação de projeto foi fechado sem dados.');
      }
    });
  }

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      (data) => {
        console.log('Projetos carregados:', data);
        this.projects = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erro ao carregar os projetos:', error);
      }
    );
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.profileImage = data.profile_image || '../../../assets/images/perfil-prototipo.png';
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário:', error);
        this.profileImage = '../../../assets/images/perfil-prototipo.png';
      }
    );
  }

  openCookieDialog() {
    console.log('Abrindo diálogo de cookies...');
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
