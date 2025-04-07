import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class GlobalobjectService {
  public Version = '0.0.0.0';


  onReload = new EventEmitter<void>();
  triggerOnReload(): void {
    this.onReload.emit();
  }

  constructor() {}
}
