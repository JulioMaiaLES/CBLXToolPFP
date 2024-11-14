//jornada.component.ts
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-jornada',
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.scss'],
})
export class JornadaComponent implements OnInit {
  projectName: string = 'Projeto CBL';
  projects: any[] = [];
  currentProject: any = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadCurrentProject();
  }

  loadCurrentProject(): void {
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      this.currentProject = JSON.parse(projectData);
      this.projectName = this.currentProject.name;
      console.log('Projeto atual carregado:', this.currentProject);
    } else {
      console.error('Nenhum projeto encontrado no localStorage');
    }
  }
}
