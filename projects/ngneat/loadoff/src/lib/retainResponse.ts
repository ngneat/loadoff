import { OperatorFunction, pipe } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { AsyncState, createAsyncState } from './toAsyncState';

/**
 * Operator that retains the previous response on a new emission of an AsyncState item.
 * This can be useful for implementing a refresh mechanism, where you want to keep displaying the old value while fetching a new value
 */
export function retainResponse<T, E = any>(): OperatorFunction<AsyncState<T, E>, AsyncState<T, E>> {
  return pipe(
    startWith(createAsyncState<T, E>()),
    scan(
      (acc: AsyncState<T, E>, val: AsyncState<T, E>) =>
        new AsyncState<T, E>({
          ...val,
          res: val.success ? val.res : acc.res,
        })
    )
  );
}
