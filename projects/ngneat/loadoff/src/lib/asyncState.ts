import { BehaviorSubject, defer, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface AsyncState<T, E = any> {
  loading: boolean;
  error: E | undefined;
  res: T | undefined;
}

function asyncTracker<T, E = any>(state: BehaviorSubject<AsyncState<T, E>>) {
  return function (source: Observable<T>) {
    return defer(() => {
      let value: AsyncState<T, E> = {
        loading: true,
        error: undefined,
        res: undefined,
      };

      state.next(value);

      return source.pipe(
        tap((res) => {
          value.res = res;
          state.next(value);
        }),
        catchError((e) => {
          value.error = e;
          state.next(value);

          return throwError(e);
        }),
        finalize(() => {
          value.loading = false;
          state.next(value);
        })
      );
    });
  };
}

function createAsyncState<Response, E = any>() {
  const state = new BehaviorSubject<AsyncState<Response, E>>({
    loading: true,
    error: undefined,
    res: undefined,
  });

  return {
    state,
    track() {
      return asyncTracker(state);
    },
  };
}
