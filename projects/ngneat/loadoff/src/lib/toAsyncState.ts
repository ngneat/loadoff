import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

interface AsyncModel<T, E> {
  res?: T | undefined;
  loading?: boolean;
  error?: E | undefined;
  success?: boolean;
  complete?: boolean;
}

export class AsyncState<T, E = any> {
  private mergedState: AsyncModel<T, E>;

  constructor(state: AsyncModel<T, E> = {}) {
    const defaults = {
      error: undefined,
      res: undefined,
      loading: true,
      complete: false,
      success: false,
    };

    this.mergedState = {
      ...defaults,
      ...state,
    };
  }

  get res(): T | undefined {
    return this.mergedState.res;
  }

  get error(): E | undefined {
    return this.mergedState.error;
  }

  get loading(): boolean {
    return this.mergedState.loading!;
  }

  get success(): boolean {
    return this.mergedState.success!;
  }

  get complete(): boolean {
    return this.mergedState.complete!;
  }
}

export function createAsyncState<T, E = any>(state: AsyncModel<T, E> = {}) {
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
