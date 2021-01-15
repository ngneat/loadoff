import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createAsyncState, loadingFor, toAsyncState } from '@ngneat/loadoff';
import { delay, finalize, map, tap } from 'rxjs/operators';
import { AsyncState } from 'projects/ngneat/loadoff/src/lib/a';
import { Observable } from 'rxjs';

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
  posts = createAsyncState<Post>();
  loading = loadingFor('update', 'delete');
  constructor(private http: HttpClient) {}
  post$: Observable<AsyncState<string>>;
  post2$: Observable<Post>;

  ngOnInit() {
    this.post$ = this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/2').pipe(
      map((post) => post.title),
      toAsyncState()
    );

    this.post2$ = this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/2');

    this.http
      .get<Post>('https://jsonplaceholder.typicode.com/posts/2')
      .pipe(
        delay(1000),
        this.posts.track()
        // tap((v) => console.log('res', v)),
        // finalize(() => console.log('done'))
      )
      .subscribe({
        error(e) {
          console.log(e);
        },
      });
  }

  refresh() {
    this.ngOnInit();
  }
}
