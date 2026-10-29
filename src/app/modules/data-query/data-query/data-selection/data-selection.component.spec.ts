import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataSelectionComponent } from './data-selection.component'

describe.skip('DataSelectionComponent', () => {
  let component: DataSelectionComponent
  let fixture: ComponentFixture<DataSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSelectionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DataSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
