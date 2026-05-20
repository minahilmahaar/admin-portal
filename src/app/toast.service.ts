import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastState = new BehaviorSubject<{ message: string; color: string; visible: boolean }>({
    message: '',
    color: '',
    visible: false,
  });

  toastState$ = this.toastState.asObservable();

  show(message: string, color: string = 'success', duration: number = 3000) {
    this.toastState.next({ message, color, visible: true });
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.toastState.next({ ...this.toastState.value, visible: false });
  }
}
