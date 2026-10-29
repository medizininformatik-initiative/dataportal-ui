import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DisplaySearchtree } from './data-selection.component'

describe.skip('DataSelectionComponent', () => {
  let component: DisplaySearchtree
  let fixture: ComponentFixture<DisplaySearchtree>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplaySearchtree],
    }).compileComponents()

    fixture = TestBed.createComponent(DisplaySearchtree)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
