import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCategories } from './business-categories';

describe('BusinessCategories', () => {
  let component: BusinessCategories;
  let fixture: ComponentFixture<BusinessCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
