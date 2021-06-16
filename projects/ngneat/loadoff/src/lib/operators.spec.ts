import { fakeAsync, tick } from "@angular/core/testing"
import { toAsyncState } from "./toAsyncState"
import { combineLatest, timer } from "rxjs"
import { someLoading } from "./operators"

describe('someLoading', () => {
  it('should return if there is loading', fakeAsync(() => {

    const one = timer(1000).pipe(toAsyncState());
    const two = timer(2000).pipe(toAsyncState());

    const spy = jasmine.createSpy();
    combineLatest([one, two]).pipe(someLoading()).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(true);

    tick(1000);

    expect(spy).toHaveBeenCalledWith(true);

    tick(2000);

    expect(spy).toHaveBeenCalledWith(false);

  }))
})