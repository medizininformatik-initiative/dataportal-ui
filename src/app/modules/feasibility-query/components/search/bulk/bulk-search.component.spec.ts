/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityQueryBulkSearchComponent } from './bulk-search.component';

describe('FeasibilityQueryBulkSearchComponent', () => {
  let component: FeasibilityQueryBulkSearchComponent;
  let fixture: ComponentFixture<FeasibilityQueryBulkSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeasibilityQueryBulkSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeasibilityQueryBulkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
