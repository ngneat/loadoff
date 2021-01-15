import { Pipe, PipeTransform } from '@angular/core';
import { AsyncState, toAsyncState } from 'projects/ngneat/loadoff/src/lib/toAsyncState';
import { Observable } from 'rxjs';

@Pipe({
  name: 'asyncState',
})
export class AsyncStatePipe implements PipeTransform {
  transform<T>(source: Observable<T>): Observable<AsyncState<T>> {
    return source.pipe(toAsyncState());
  }
}
