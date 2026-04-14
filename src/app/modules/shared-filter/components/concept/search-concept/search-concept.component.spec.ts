import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConceptComponent } from './search-concept.component';

describe('SearchConceptComponent', () => {
  let component: SearchConceptComponent;
  let fixture: ComponentFixture<SearchConceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchConceptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
