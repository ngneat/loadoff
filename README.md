<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

> When it comes to loaders, take a load off your mind...

## Installation

`npm install @ngneat/loadoff`

## Create a Loader

To create a loader, call the `loadingFor` function and specify the loaders you want to create:

```ts
import { loadingFor } from '@ngneat/loadoff';

@Component({
  template: `
    <button>
      Add
      <spinner *ngIf="loader.add.inProgress$ | async"></spinner>
    </button>
    
    <button>
      Edit 
      <spinner *ngIf="loader.edit.inProgress$ | async"></spinner>
    </button>
    
    <button>
      Delete 
      <spinner *ngIf="loader.delete.inProgress$ | async"></spinner>
    </button>
  `
})
class UsersTableComponent {
  loader = loadingFor('add', 'edit', 'delete');

  add() {
    this.service.add().pipe(
      this.loader.add.track()
    ).subscribe();
  }

  edit() {
    this.service.add().pipe(
      this.loader.edit.track()
    ).subscribe();
  }

  delete() {
    this.service.add().pipe(
      this.loader.delete.track()
    ).subscribe();
  }
}
```

## Async State
`AsyncState` provides a nice abstraction over `async` observables. You can use the `toAsyncState` operator to create an `AsyncState` instance which exposes a `loading`, `error`, and `res` state:

```ts
import { AsyncState, toAsyncState } from '@ngneat/loadoff';

@Component({
  template: `
    <ng-container *ngIf="users$ | async; let state">
      <p *ngIf="state.loading">Loading....</p>
      <p *ngIf="state.error">Error</p>
      <p *ngIf="state.res">
        {{ state.res | json }}
      </p>
    </ng-container>
  `
})
class UsersComponent {
  users$: Observable<AsyncState<Users>>;

  ngOnInit() {
    this.users$ = this.http.get<Users>('/users').pipe(
      toAsyncState()
    );
  }

}

```

You can also use the `*subscribe` [directive](https://github.com/ngneat/subscribe) instead of `*ngIf`.

### `createAsyncState`
You can use the `createAsyncState` to manually create an instance of `AsyncState`:

```ts
import { createAsyncState } from '@ngneat/loadoff';


class UsersComponent {
  state = createAsyncState()
}
```

The initial state of `AsyncState` instance is:

```ts
{
  error: undefined,
  res: undefined,
  loading: true,
  complete: false,
  success: false,
};
```

You can always override it by passing a partial object to the `createAsyncState` function:

```ts
import { createAsyncState } from '@ngneat/loadoff';


class UsersComponent {
  state = createAsyncState({ loading: false, complete: true, res: data })
}
```


### `createSyncState`
Sometimes there could be a more complex situation when you want to return a `sync` state which means setting the `loading` to `false`
and `complete` to `true`:

```ts
import { createSyncState, toAsyncState } from '@ngneat/loadoff';


class UsersComponent {
  ngOnInit() {
    source$.pipe(
      switchMap((condition) => {
        if(condition) {
          return of(createSyncState(data));
        }

        return inner$.pipe(toAsyncState())
      })
    )
  }
}
```

### Helper Functions

```ts
import { isSuccess, hasError, isComplete, isLoading } from '@ngneat/loadoff';

class UsersComponent {
  loading$ = combineLatest([asyncState, asyncState]).pipe(someLoading())

  ngOnInit() {
    this.http.get<Users>('/users').pipe(
      toAsyncState()
    ).subscribe(res => {
      if(isSuccess(res)) {}
      if(hasError(res)) {}
      if(isComplete(res)) {}
      if(isLoading(res)) {}
    })
  }

}
```

### `retainResponse`
Sometimes you want to retain the response while fetching a new value. This can be achieved with the `retainResponse` operator.

```ts
import { toAsyncState, retainResponse } from '@ngneat/loadoff';

@Component({
  template: `
    <ng-container *ngIf="users$ | async; let state">
      <p *ngIf="state.loading">Loading....</p>
      <p *ngIf="state.error">Error</p>
      <p *ngIf="state.res">
        {{ state.res | json }}
      </p>
    </ng-container>
    <button (click)='refresh$.next(true)'>Refresh</button>
  `
})
class UsersComponent {
  users$: Observable<AsyncState<Users>>;
  refresh$ = new BehaviorSubject<boolean>(true);

  ngOnInit() {
    this.users$ = this.refresh$.pipe(
      switchMap(() => this.http.get<Users>('/users').pipe(toAsyncState())),
      retainResponse()
    );
  }
}
```

The `retainResponse` operator accepts an optional `startWithValue` parameter which you can use to initialize the stream with an alternative `AsyncState` value.

## Async Storage State
`AsyncStore` provides the same functionality as `AsyncState`, with the added ability of being `writable`:

```ts
import { AsyncState, createAsyncStore } from '@ngneat/loadoff';

@Component({
  template: `
    <ng-container *ngIf="store.value$ | async; let state">
      <p *ngIf="state.loading">Loading....</p>
      <p *ngIf="state.error">Error</p>
      <p *ngIf="state.res">
        {{ state.res | json }}
      </p>
    </ng-container>
    
    <button (click)="updateUsers()">Update Users</button>
  `
})
class UsersComponent {
  store = createAsyncStore<Users>();

  ngOnInit() {
    this.users$ = this.http.get<Users>('/users').pipe(
      this.store.track()
    );
  }
  
  updateUsers() {
    this.store.update((users) => {
      return [];
    });
  }

}

```


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com/"><img src="https://avatars.githubusercontent.com/u/6745730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/loadoff/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/@ngneat/loadoff/commits?author=NetanelBasal" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!

<div>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
