import { BehaviorSubject, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';
import { toAsyncState } from '@ngneat/loadoff';
import { retainResult } from './retainResult';

describe('retainResult', () => {
  it('should retain result on refresh', fakeAsync(() => {
    const reqSpy = spy();

    const refresh$: BehaviorSubject<any> = new BehaviorSubject<any>(1);

    refresh$
      .pipe(
        switchMap((id) => http(id).pipe(toAsyncState())),
        retainResult()
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
