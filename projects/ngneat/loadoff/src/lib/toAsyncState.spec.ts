import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';
import { AsyncState, toAsyncState } from '@ngneat/loadoff';

interface CustomError {
  errorCode: string;
  errorMessage: string;
}
const DEFAULT_ERROR: Error = new Error('error');
const CUSTOM_ERROR: CustomError = { errorCode: 'ERROR-123-OMG', errorMessage: `I'm a custom error` };

function http() {
  return of({ id: 1 }).pipe(delay(1000));
}

function httpError(error: any) {
  return of({ id: 1 }).pipe(
    delay(1000),
    map(() => {
      throw error;
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
    const error$ = httpError(DEFAULT_ERROR).pipe(toAsyncState<unknown, any>());
    assertError<unknown, Error>(error$, DEFAULT_ERROR);
  }));

  it('should work with a custom error', fakeAsync(() => {
    const error$ = httpError(CUSTOM_ERROR).pipe(toAsyncState<unknown, CustomError>());
    assertError<unknown, CustomError>(error$, CUSTOM_ERROR);
  }));
});

function assertError<T, E>(error$: Observable<AsyncState<T, E>>, error: E) {
  const reqSpy = spy();

  error$.subscribe(reqSpy);

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
      error: error,
      loading: false,
      success: false,
      complete: true,
    })
  );
}
