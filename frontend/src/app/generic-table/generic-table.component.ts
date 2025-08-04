import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css',
})
export class GenericTableComponent {
  @Input() data: Record<string, any>[] = [];
  @Input() columns: { key: string; label: string, type:string }[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Input() del : boolean | undefined
  getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
}
