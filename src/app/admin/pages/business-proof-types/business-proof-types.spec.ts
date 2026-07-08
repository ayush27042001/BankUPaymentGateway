import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProofTypes } from './business-proof-types';

describe('BusinessProofTypes', () => {
  let component: BusinessProofTypes;
  let fixture: ComponentFixture<BusinessProofTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProofTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessProofTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the edit modal and reset edit state', () => {
    component.showEditModal = true;
    component.editProofType = {
      businessProofTypeID: 101,
      proofName: 'Aadhaar',
      proofCode: 'AAD',
      description: 'Identity proof',
      isActive: true,
      createdDate: '2024-01-01',
      updatedDate: ''
    };

    component.closeEditModal();

    expect(component.showEditModal).toBeFalse();
    expect(component.editProofType.proofName).toBe('');
    expect(component.editProofType.proofCode).toBe('');
  });
});
