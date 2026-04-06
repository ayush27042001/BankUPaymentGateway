import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanVerification } from './pan-verification';

describe('PanVerification', () => {
  let component: PanVerification;
  let fixture: ComponentFixture<PanVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PanVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
