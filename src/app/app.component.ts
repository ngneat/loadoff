import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isSuccess, loadingFor, toAsyncState } from '@ngneat/loadoff';
import { delay, map } from 'rxjs/operators';
import { AsyncState } from 'projects/ngneat/loadoff/src/lib/toAsyncState';
import { Observable } from 'rxjs';
import { createAsyncState } from '../../projects/ngneat/loadoff/src/lib/asyncState';

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
  // @ts-ignore
  post$: Observable<AsyncState<string>>;
  // @ts-ignore
  post2$: Observable<Post>;

  ngOnInit() {
    this.post$ = this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/2').pipe(
      map((post) => post.title),
      delay(1000),
      toAsyncState()
    );

    // this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/3').pipe(
    //   toAsyncState()
    // ).subscribe(state => {
    //
    // })

    this.post2$ = this.http.get<Post>('https://jsonplaceholder.typicode.com/posts/2');

    // this.http
    //   .get<Post>('https://jsonplaceholder.typicode.com/posts/2')
    //   .pipe(
    //     delay(1000),
    //     this.posts.track()
    //     // tap((v) => console.log('res', v)),
    //     // finalize(() => console.log('done'))
    //   )
    //   .subscribe({
    //     error(e) {
    //       console.log(e);
    //     },
    //   });
  }

  refresh() {
    this.ngOnInit();
  }
}
