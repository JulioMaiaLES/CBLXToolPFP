import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface DragDropBlock {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  private _blocks$ = new BehaviorSubject<DragDropBlock[]>([]);
  public blocks$ = this._blocks$.asObservable();

  private droppedBlocks: DragDropBlock[] = [];

  handleDrop(event: CdkDragDrop<DragDropBlock[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedBlock = event.item.data;
      this.droppedBlocks.splice(event.currentIndex, 0, droppedBlock);
      this._blocks$.next([...this.droppedBlocks]);
    }
  }

  getDroppedBlocks(): DragDropBlock[] {
    return this.droppedBlocks;
  }
}
