import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCategory } from './business-category';

describe('BusinessCategory', () => {
  let component: BusinessCategory;
  let fixture: ComponentFixture<BusinessCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCategory],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
