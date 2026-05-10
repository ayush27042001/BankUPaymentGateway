import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepStatus } from './pep-status';

describe('PepStatus', () => {
  let component: PepStatus;
  let fixture: ComponentFixture<PepStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PepStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(PepStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
