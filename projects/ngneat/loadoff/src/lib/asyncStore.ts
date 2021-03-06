import { BehaviorSubject, MonoTypeOperatorFunction, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AsyncState } from './toAsyncState';

export function createAsyncStore<Response, E = any>() {
  const store = new BehaviorSubject<AsyncState<Response, E>>(new AsyncState());

  function update(data: Response | ((res: Response) => Response)) {
    let resolved = data;

    if (typeof data === 'function') {
      resolved = (data as Function)(store.getValue().res);
    }

    store.next(
      new AsyncState({
        res: resolved as Response,
        loading: false,
        complete: true,
        success: true,
      })
    );
  }

  return {
    value$: store.asObservable(),
    update,
    track<T extends Response>(): MonoTypeOperatorFunction<T> {
      return pipe(
        tap({
          next(data) {
            update(data);
          },
          error(err) {
            store.next(
              new AsyncState<T>({
                error: err,
                loading: false,
                complete: true,
              })
            );
          },
        })
      );
    },
  };
}
