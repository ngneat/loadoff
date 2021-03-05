import { spy, http } from './test.utils';
import { loadingFor } from '@ngneat/loadoff';
import { fakeAsync, tick } from '@angular/core/testing';

describe('loadingFor', () => {
  it('should work with one', fakeAsync(() => {
    const httpReq = http();
    const loading = loadingFor('update');
    const reqSpy = spy();

    loading.update.inProgress$.subscribe(reqSpy);
    expect(reqSpy.next).toHaveBeenCalledWith(false);

    httpReq.get.pipe(loading.update.track()).subscribe();

    expect(reqSpy.next).toHaveBeenCalledWith(true);

    httpReq.request.next();
    tick(1000);

    expect(reqSpy.next).toHaveBeenCalledWith(false);
  }));

  it('should work with multiple', fakeAsync(() => {
    const httpReq = http();
    const loading = loadingFor('update', 'delete');
    const updateReqSpy = spy();
    const deleteReqSpy = spy();

    loading.update.inProgress$.subscribe(updateReqSpy);
    expect(updateReqSpy.next).toHaveBeenCalledWith(false);

    loading.delete.inProgress$.subscribe(deleteReqSpy);
    expect(deleteReqSpy.next).toHaveBeenCalledWith(false);

    httpReq.get.pipe(loading.update.track()).subscribe();

    httpReq.get.pipe(loading.delete.track()).subscribe();

    expect(updateReqSpy.next).toHaveBeenCalledWith(true);
    expect(deleteReqSpy.next).toHaveBeenCalledWith(true);

    httpReq.request.next();
    tick(1000);

    expect(updateReqSpy.next).toHaveBeenCalledWith(false);
    expect(deleteReqSpy.next).toHaveBeenCalledWith(false);
  }));
});
