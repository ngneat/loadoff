
import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";
import { AsyncState } from "./toAsyncState";

export function someLoading(): OperatorFunction<AsyncState<unknown>[], boolean> {
  return map(states => states.some(s => s.loading))
}