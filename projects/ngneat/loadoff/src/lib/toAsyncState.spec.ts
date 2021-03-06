import { of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';
import { AsyncState, toAsyncState } from '@ngneat/loadoff';

function http() {
  return of({ id: 1 }).pipe(delay(1000));
}

function httpError() {
  return of({ id: 1 }).pipe(
    delay(1000),
    map(() => {
      throw new Error('error');
    })
  );
}

describe('toAsyncState', () => {
  it('should work with success', fakeAsync(() => {
    const reqSpy = spy();

    http().pipe(toAsyncState()).subscribe(reqSpy);

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
  }));

  it('should work with error', fakeAsync(() => {
    const reqSpy = spy();

    httpError().pipe(toAsyncState()).subscribe(reqSpy);

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
        res: undefined,
        error: new Error('error'),
        loading: false,
        success: false,
        complete: true,
      })
    );
  }));
});
