import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptFilterTableComponent } from './concept-filter-table.component';

describe('ConceptFilterTableComponent', () => {
  let component: ConceptFilterTableComponent;
  let fixture: ComponentFixture<ConceptFilterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptFilterTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptFilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
