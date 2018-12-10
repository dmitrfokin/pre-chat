import { TestBed } from '@angular/core/testing';

import { PreMeetingService } from './pre-meeting.service';

describe('PreMeetingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreMeetingService = TestBed.get(PreMeetingService);
    expect(service).toBeTruthy();
  });
});
