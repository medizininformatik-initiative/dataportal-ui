import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataSelectionActionBarComponent } from './data-selection-action-bar.component'

describe.skip('DataSelectionActionBarComponent', () => {
  let component: DataSelectionActionBarComponent
  let fixture: ComponentFixture<DataSelectionActionBarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSelectionActionBarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DataSelectionActionBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
