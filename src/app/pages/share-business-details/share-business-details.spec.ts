import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareBusinessDetails } from './share-business-details';

describe('ShareBusinessDetails', () => {
  let component: ShareBusinessDetails;
  let fixture: ComponentFixture<ShareBusinessDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareBusinessDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareBusinessDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
