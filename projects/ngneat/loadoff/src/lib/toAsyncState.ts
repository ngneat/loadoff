import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

export class AsyncState<T, E = any> {
  public res: T | undefined = undefined;
  public error: E | undefined = undefined;
  public loading: boolean = true;
  public success: boolean = false;
  public complete: boolean = false;

  constructor(state: Partial<AsyncState<T, E>> = {}) {
    this.res = state.res ?? this.res;
    this.error = state.error ?? this.error;
    this.loading = state.loading ?? this.loading;
    this.success = state.success ?? this.success;
    this.complete = state.complete ?? this.complete;
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

export function isSuccess(state: AsyncState<unknown>) {
  return state.success;
}

export function hasError(state: AsyncState<unknown>) {
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
