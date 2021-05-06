import { BehaviorSubject, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';
import { toAsyncState } from '@ngneat/loadoff';
import { retainResult } from './retainResult';

function http(id: number) {
  return of({ id: id }).pipe(delay(1000));
}

describe('retainResult', () => {
  it('should retain result on refresh', fakeAsync(() => {
    const reqSpy = spy();

    const refresh$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    refresh$
      .pipe(
        switchMap((id) => http(id).pipe(toAsyncState())),
        retainResult()
      )
      .subscribe(reqSpy);

    expect(reqSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: undefined,
        error: undefined,
        loading: true,
        success: false,
        complete: false,
      })
    );

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { id: 1 },
        error: undefined,
        loading: false,
        success: true,
        complete: true,
      })
    );

    refresh$.next(2);

    expect(reqSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { id: 1 },
        error: undefined,
        loading: true,
        success: false,
        complete: false,
      })
    );

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { id: 2 },
        error: undefined,
        loading: false,
        success: true,
        complete: true,
      })
    );
  }));
});
