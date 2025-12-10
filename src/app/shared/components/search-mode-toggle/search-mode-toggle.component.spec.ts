import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchModeToggleComponent } from './search-mode-toggle.component';

describe('SearchModeToggleComponent', () => {
  let component: SearchModeToggleComponent;
  let fixture: ComponentFixture<SearchModeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchModeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit mode change', () => {
    spyOn(component.modeChange, 'emit');
    component.onModeChange('bulk-search');
    expect(component.modeChange.emit).toHaveBeenCalledWith('bulk-search');
  });
});
