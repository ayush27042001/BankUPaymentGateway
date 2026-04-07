import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPlatform } from './connect-platform';

describe('ConnectPlatform', () => {
  let component: ConnectPlatform;
  let fixture: ComponentFixture<ConnectPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectPlatform],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectPlatform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
