import { TestBed } from '@angular/core/testing';

import { VjsPlayerService } from './vjs-player.service';

describe('VjsPlayerService', () => {
  let service: VjsPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VjsPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
