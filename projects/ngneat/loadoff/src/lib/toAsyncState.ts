import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

export class AsyncState<T, E = any> {
  res: T | undefined = undefined;
  error: E | undefined = undefined;
  loading = true;
  success = false;
  complete = false;

  constructor(state: Partial<AsyncState<T, E>> = {}) {
    Object.assign(this, state);
  }
}

export function createAsyncState<T, E = any>(state: Partial<AsyncState<T, E>> = {}) {
  return new AsyncState(state);
}

export function createSyncState<T, E = any>(res: T) {
  return new AsyncState<T, E>({
    loading: false,
    complete: true,
    res,
  });
}

export function isSuccess<T>(state: AsyncState<T>): state is AsyncState<T> & { res: T } {
  return state.success;
}

export function hasError<T>(state: AsyncState<T>): state is AsyncState<T> & { res: undefined } {
  return !!state.error;
}

export function isComplete(state: AsyncState<unknown>) {
  return state.complete;
}

export function isLoading(state: AsyncState<unknown>) {
  return state.loading;
}

export function toAsyncState<T, E = any>(): OperatorFunction<T, AsyncState<T, E>> {
  return pipe(
    map((res) => {
      return new AsyncState<T, E>({
        res,
        loading: false,
        complete: true,
        success: true,
      });
    }),
    startWith(new AsyncState<T, E>()),
    catchError((error) => {
      console.error(error);

      return of(
        new AsyncState<T, E>({
          error,
          loading: false,
          complete: true,
        })
      );
    })
  );
}
