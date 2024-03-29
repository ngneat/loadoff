import { BehaviorSubject, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';
import { createAsyncState, toAsyncState } from './toAsyncState';
import { retainResponse } from './retainResponse';

describe('retainResponse', () => {
  it('should retain response on refresh', fakeAsync(() => {
    const reqSpy = spy();

    const refresh$: BehaviorSubject<any> = new BehaviorSubject<any>(1);

    refresh$
      .pipe(
        switchMap((id) => http(id).pipe(toAsyncState())),
        retainResponse()
      )
      .subscribe(reqSpy);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadingObject(undefined)));

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadedObject(1)));

    refresh$.next(2);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadingObject(1)));

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadedObject(2)));

    refresh$.next(null);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadingObject(2)));

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadedObject(null)));
  }));

  it('should be able to pass in a startWithValue', fakeAsync(() => {
    const reqSpy = spy();

    const refresh$: BehaviorSubject<any> = new BehaviorSubject<any>(1);

    const startWithValue = createAsyncState({
      res: 'INITIAL RESPONSE',
    });

    refresh$
      .pipe(
        switchMap((id) => http(id).pipe(toAsyncState())),
        retainResponse(startWithValue)
      )
      .subscribe(reqSpy);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadingObject('INITIAL RESPONSE')));

    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(jasmine.objectContaining(createLoadedObject(1)));
  }));
});

function http(val: any) {
  return of(val).pipe(delay(1000));
}

function createLoadingObject(res: any) {
  return {
    res: res,
    error: undefined,
    loading: true,
    success: false,
    complete: false,
  };
}

function createLoadedObject(res: any) {
  return {
    res: res,
    error: undefined,
    loading: false,
    success: true,
    complete: true,
  };
}
