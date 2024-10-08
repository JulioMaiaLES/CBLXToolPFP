import { Component } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { ResizableModule } from 'angular-resizable-element';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-jornada',
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.scss'],
})
export class JornadaComponent{

  isMenuHidden = true;

  toggleMenu() {
    this.isMenuHidden = !this.isMenuHidden;
  }

  constructor( 
    public progressService: ProgressService, 
  ) {}


}
