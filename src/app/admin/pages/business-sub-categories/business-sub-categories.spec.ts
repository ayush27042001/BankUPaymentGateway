import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSubCategories } from './business-sub-categories';

describe('BusinessSubCategories', () => {
  let component: BusinessSubCategories;
  let fixture: ComponentFixture<BusinessSubCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSubCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessSubCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
