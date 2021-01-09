import { BehaviorSubject, defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

function loadingTracker<T>(tracker: BehaviorSubject<boolean>) {
  return function (source: Observable<T>) {
    return defer(() => {
      tracker.next(true);

      return source;
    }).pipe(finalize(() => tracker.next(false)));
  };
}

export function loadingFor<K extends PropertyKey>(...keys: K[]) {
  const result: Record<
    K,
    {
      inProgress$: Observable<boolean>;
      track: <T>() => MonoTypeOperatorFunction<T>;
    }
  > = {} as any;

  for (const key of keys) {
    const subject = new BehaviorSubject<boolean>(false);

    result[key] = {
      inProgress$: subject.asObservable(),
      track<T>() {
        return loadingTracker<T>(subject);
      },
    };
  }

  return result;
}
