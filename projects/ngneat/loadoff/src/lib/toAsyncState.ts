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
      success: false
    };

    this.mergedState = {
      ...defaults,
      ...state
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

export function isSuccess<T>(state: AsyncState<T>): state is AsyncState<T> & { res: T } {
  return state.success;
}

export function hasError<T>(state: AsyncState<T>): state is AsyncState<T> & { res: undefined } {
  return !!state.error;
}

export function isComplete<T>(state: AsyncState<T>) {
  return state.complete;
}

export function isLoading<T>(state: AsyncState<T>) {
  return state.loading;
}

export function toAsyncState<T>(): OperatorFunction<T, AsyncState<T>> {
  return pipe(
    map((res) => {
      return new AsyncState<T>({
        res,
        loading: false,
        complete: true,
        success: true
      });
    }),
    startWith(new AsyncState<T>()),
    catchError((error) => {
      return of(
        new AsyncState<T>({
          error,
          loading: false,
          complete: true
        })
      );
    })
  );
}
