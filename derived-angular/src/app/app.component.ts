import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DerivedDirective } from './derived.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DerivedDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'derived-angular';

  hincd = '';
  hinnma = '';
  hinnmb = '';
  hinkb = '';
  hintl = '';

  DerivedFrom = new Subject<string>();
  derivedOrigin = '';

  // Khi hincd thay đổi
  onDerivedFromHincd(value: string) {
    this.derivedOrigin = 'HINCD';
    this.hincd = value;
    this.DerivedFrom.next('HINCD');
    console.log('hincd changed to:', this.hincd);
  }

  // Khi hinnma thay đổi
  onDerivedFromHinnma(value: string) {
    this.derivedOrigin = 'HINNMA';
    this.hinnma = value;
    // Gọi hàm này thì mới kích hoạt được derived
    // Có thể thêm điều kiện, chẳng hạn như khi check không có lỗi chẳng hạn
    this.DerivedFrom.next('HINNMA');
  }

  // Khi hinnmb thay đổi
  onHinnmbChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.hinnmb = this.hinnma + '_danh';
    console.log('hinnmb changed to:', this.hinnmb);
    // ...xử lý riêng nếu cần...
  }

  handleHinnma() {
    this.hinnma = this.hincd + ' - processed';
    console.log('hinnma updated to:', this.hinnma);
    this.DerivedFrom.next('HINNMA');
    // Xử lý khi hincd thay đổi
    // Ví dụ: this.hinnma = this.hincd + ' - processed';
  }

  handleHinnmb() {
    console.log('Handling hinnmb is called by: ', this.derivedOrigin);
    this.hinnmb = `${this.hincd}-${this.hinnma}`;
    console.log('hinnmb updated to:', this.hinnmb);
    // Xử lý khi hincd hoặc hinnma thay đổi
    // Ví dụ: this.hinnmb = this.hincd + '-' + this.hinnma;
  }
  handleHinkb() {
    switch (this.derivedOrigin) {
      case 'HINCD':
        this.hinkb = `1`;
        break;
      case 'HINNMA':
        this.hinkb = `2`;
        break;
      default:
        this.hinkb = `0`;
    }
  }
}
