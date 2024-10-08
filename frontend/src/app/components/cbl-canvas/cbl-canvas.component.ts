import { Component } from '@angular/core';

@Component({
  selector: 'app-cbl-canvas',
  templateUrl: './cbl-canvas.component.html',
  styleUrls: ['./cbl-canvas.component.scss']
})
export class CblCanvasComponent {
  problemStatement: string = '';
  learningObjectives: string = '';
  resources: string = '';
  activities: string = '';
  assessment: string = '';
  isVisible: boolean = true;

  constructor() { }

  // Método para limpar todos os campos do canvas
  clearCanvas() {
    this.problemStatement = '';
    this.learningObjectives = '';
    this.resources = '';
    this.activities = '';
    this.assessment = '';
  }

  // Método para salvar os dados do canvas
  saveCanvasData() {
    console.log('Dados do canvas salvos:', {
      problemStatement: this.problemStatement,
      learningObjectives: this.learningObjectives,
      resources: this.resources,
      activities: this.activities,
      assessment: this.assessment
    });
  }

  // Método para remover o canvas
  removeCanvas() {
    const confirmacao = confirm("Tem certeza que deseja deletar o CBL Canvas? Todos os dados dela serão perdidos.");
    if (confirmacao) {
      this.isVisible = false;
    }
  }
}
