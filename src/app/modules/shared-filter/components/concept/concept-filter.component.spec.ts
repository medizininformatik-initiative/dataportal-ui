import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedConceptFilterComponent } from './shared-concept-filter.component';

describe('SharedConceptFilterComponent', () => {
  let component: SharedConceptFilterComponent;
  let fixture: ComponentFixture<SharedConceptFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedConceptFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedConceptFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
