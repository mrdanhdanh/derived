import { Directive, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AppComponent } from './app.component';

@Directive({
  selector: '[derived]',
  standalone: true,
  providers: [NgModel]
})
export class DerivedDirective implements OnInit, OnDestroy {
  @Input('derived') derivedConfig!: { deps: string[], handler: string };
  private unsubscribers: (() => void)[] = [];

  constructor(@Host() private host: AppComponent, private ngModel: NgModel) {}

  ngOnInit() {
    if (!this.derivedConfig) return;
    const deps = this.derivedConfig.deps || [];
    const handler = this.derivedConfig.handler;
    const hostAny = this.host as any;
    deps.forEach(dep => {
      if (hostAny['DerivedFrom']) {
        const sub = hostAny['DerivedFrom'].subscribe((value: any) => {
          console.log(`DerivedDirective: Detected change in ${dep}, invoking handler ${handler}, value:`, value);  
          if (dep === value && typeof hostAny[handler] === 'function') {
            hostAny[handler](value);
          }
        });
        this.unsubscribers.push(() => sub.unsubscribe());
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribers.forEach(unsub => unsub());
  }
}