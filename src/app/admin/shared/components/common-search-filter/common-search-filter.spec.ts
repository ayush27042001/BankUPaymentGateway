import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSearchFilter } from './common-search-filter';

describe('CommonSearchFilter', () => {
  let component: CommonSearchFilter;
  let fixture: ComponentFixture<CommonSearchFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSearchFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonSearchFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
