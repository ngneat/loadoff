import { ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

class SubscribeContext<T> {
  $implicit: T | undefined = undefined;
  subscribe: T | undefined = undefined;
  error: any = undefined;
  completed: boolean = false;
}

@Directive({
  selector: '[subscribe]'
})
export class SubscribeDirective<T> implements OnInit {
  private subscription: Subscription | undefined;

  // @ts-ignore
  private context = new SubscribeContext<T>();

  @Input() set subscribe(source: Observable<T> | null | undefined) {
    this.subscription?.unsubscribe();

    if (!source) {
      return;
    }

    this.subscription = source.subscribe({
      next: (value) => {
        this.context.$implicit = value;
        this.context.subscribe = value;

        this.cdr.markForCheck();
      },
      error: (err) => {
        this.context.error = err;
      },
      complete: () => {
        this.context.completed = true;
        this.cdr.markForCheck();
      }
    });
  }

  static SubscribeDirective<T>(
    directive: SubscribeDirective<T>,
    context: unknown | null | undefined
  ): context is SubscribeContext<T> {
    return true;
  }

  static ngTemplateGuard_subscribe: 'binding';

  constructor(private tpl: TemplateRef<SubscribeContext<T>>,
              private cdr: ChangeDetectorRef,
              private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    this.vcr.createEmbeddedView(this.tpl, this.context);
  }

}
