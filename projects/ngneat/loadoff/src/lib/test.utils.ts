import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

export type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};

export function spy(): Spied<{ next: any; error: any; complete: any }> {
  return jasmine.createSpyObj('spy', ['next', 'error', 'complete']);
}

export function http() {
  const request = new Subject();

  return {
    request,
    get: request.asObservable().pipe(delay(1000)),
  };
}
