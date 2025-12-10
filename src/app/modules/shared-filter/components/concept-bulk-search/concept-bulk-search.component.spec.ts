import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptBulkSearchComponent } from './concept-bulk-search.component';

describe('ConceptBulkSearchComponent', () => {
  let component: ConceptBulkSearchComponent;
  let fixture: ComponentFixture<ConceptBulkSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptBulkSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptBulkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
