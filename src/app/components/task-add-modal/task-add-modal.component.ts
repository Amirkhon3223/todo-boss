import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-add-modal',
  templateUrl: './task-add-modal.component.html',
  styleUrl: './task-add-modal.component.css'
})
export class TaskAddModalComponent {
  constructor(public dialogRef: MatDialogRef<TaskAddModalComponent>) {}
}
