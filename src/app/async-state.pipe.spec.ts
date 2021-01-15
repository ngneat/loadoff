import { AsyncStatePipe } from './async-state.pipe';

describe('AsyncStatePipe', () => {
  it('create an instance', () => {
    const pipe = new AsyncStatePipe();
    expect(pipe).toBeTruthy();
  });
});
