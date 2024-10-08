import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  engageProgress = 0;
  investigateProgress = 0;
  actProgress = 0;
  answeredQuestions = 0;
  totalQuestions = 0;
  totalUploads = 0;

  updateEngageProgress(answeredQuestions: number, totalQuestions: number) {
    this.answeredQuestions += answeredQuestions;
    this.totalQuestions += totalQuestions;
    this.engageProgress = this.calculateProgress(this.answeredQuestions, this.totalQuestions);
  }

  updateInvestigateProgress(answeredQuestions: number, totalQuestions: number) {
    this.answeredQuestions += answeredQuestions;
    this.totalQuestions += totalQuestions;
    this.investigateProgress = this.calculateProgress(this.answeredQuestions, this.totalQuestions);
  }

  updateActProgress(uploads: number) {
    this.totalUploads += uploads;
  }

  private calculateProgress(answeredQuestions: number, totalQuestions: number): number {
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }
}
