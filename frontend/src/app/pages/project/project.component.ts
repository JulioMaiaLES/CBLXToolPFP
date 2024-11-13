// project.component.ts
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

  onOptionSelected(selectedProject: string): void {
    console.log('Selected Project:', selectedProject);
    // Implement your logic here, e.g., navigate to the project details
    const selected = this.projects.find(project => project.name === selectedProject);
    if (selected) {
      this.router.navigate(['/projects', selected.id]);
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

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.profileImage = data.profile_image || '../../../assets/images/perfil-prototipo.png';
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário:', error);
        this.profileImage = '../../../assets/images/perfil-prototipo.png'; // Imagem padrão em caso de erro
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
