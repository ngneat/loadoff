import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

interface AsyncModel<T, E> {
  res?: T | undefined;
  loading?: boolean | undefined;
  error?: E | undefined;
  complete?: boolean;
}

export class AsyncState<T, E = any> {
  constructor(
    private state: AsyncModel<T, E> = {
      loading: true,
      error: undefined,
      res: undefined,
      complete: false,
    }
  ) {}

  get res(): T | undefined {
    return this.state.res;
  }

  get loading(): boolean {
    return !!this.state.loading;
  }

  get error(): E | undefined {
    return this.state.error;
  }

  get complete(): boolean {
    return !!this.state.complete;
  }
}

export function toAsyncState<T>(): OperatorFunction<T, AsyncState<T>> {
  return pipe(
    map((res) => {
      return new AsyncState<T>({
        loading: false,
        res,
        complete: true,
      });
    }),
    startWith(new AsyncState<T>()),
    catchError((error) => {
      return of(
        new AsyncState<T>({
          error,
          loading: false,
          complete: true,
        })
      );
    })
  );
}
