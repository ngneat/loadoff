import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncState, createAsyncStore, toAsyncState } from '@ngneat/loadoff';
import { delay, map, startWith, switchMap } from 'rxjs/operators';

import { BehaviorSubject, merge, Observable, of, Subject, timer } from 'rxjs';
import { retainResponse } from '@ngneat/loadoff';

interface Post {
  body: string;
  title: string;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  post$: Observable<AsyncState<string>>;

  delayed$: Observable<AsyncState<Post>>;

  higher$: Observable<AsyncState<Post>>;

  highersInitial$: Observable<AsyncState<Post>>;

  retainResponse$: Observable<AsyncState<string>>;
  refresh$ = new BehaviorSubject<boolean>(true);

  writable = createAsyncStore<string>();

  postId = new Subject<string>();

  ngOnInit() {
    this.post$ = this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/2').pipe(
      map((post) => post.title),
      delay(1000),
      toAsyncState()
    );

    this.delayed$ = timer(1000).pipe(
      switchMap(() => {
        return this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/3');
      }),
      toAsyncState()
    );

    this.higher$ = merge(
      of(new AsyncState()),
      this.postId.pipe(
        switchMap((id) => {
          return this.http
            .get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .pipe(delay(1000), toAsyncState());
        })
      )
    );

    this.highersInitial$ = this.postId.pipe(startWith(1)).pipe(
      switchMap((id) => {
        return this.http
          .get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
          .pipe(delay(1000), toAsyncState());
      })
    );

    this.http
      .get<Post>('https://jsonplaceholder.typicode.com/posts/5')
      .pipe(
        map((post) => post.title),
        this.writable.track()
      )
      .subscribe();

    this.retainResponse$ = this.refresh$.pipe(
      map(() => Math.floor(Math.random() * Math.floor(20)) + 1),
      switchMap((randomId) =>
        this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${randomId}`).pipe(
          map((post) => post.title),
          delay(1000),
          toAsyncState()
        )
      ),
      retainResponse()
    );
  }

  fetch(id: string) {
    this.writable.update((data) => `${data} Changed!`);
    this.postId.next(id);
  }

  refresh() {
    this.ngOnInit();
  }
}
