import { createAsyncStore } from './asyncStore';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { spy } from './test.utils';

interface Response {
  data: Array<{ id: number }>;
}

function http() {
  return of<Response>({ data: [{ id: 1 }] }).pipe(delay(1000));
}

describe('AsyncStore', () => {
  it('should create async store', fakeAsync(() => {
    const store = createAsyncStore<Response>();
    const valueSpy = spy();

    store.value$.subscribe(valueSpy);

    expect(valueSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: undefined,
        error: undefined,
        loading: true,
        success: false,
        complete: false,
      })
    );

    http().pipe(store.track()).subscribe();

    tick(1000);

    expect(valueSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { data: [{ id: 1 }] },
        error: undefined,
        loading: false,
        success: true,
        complete: true,
      })
    );

    store.update({ data: [{ id: 3 }] });

    expect(valueSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { data: [{ id: 3 }] },
        error: undefined,
        loading: false,
        success: true,
        complete: true,
      })
    );

    store.update((state) => {
      return {
        data: [...state.data, { id: 5 }],
      };
    });

    expect(valueSpy.next).toHaveBeenCalledWith(
      jasmine.objectContaining({
        res: { data: [{ id: 3 }, { id: 5 }] },
        error: undefined,
        loading: false,
        success: true,
        complete: true,
      })
    );
  }));
});
