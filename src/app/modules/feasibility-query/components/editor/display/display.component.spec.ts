import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DisplayFeasibilityQueryComponent } from './display.component'

describe.skip('DisplayFeasibilityQueryComponent', () => {
  let component: DisplayFeasibilityQueryComponent
  let fixture: ComponentFixture<DisplayFeasibilityQueryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayFeasibilityQueryComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DisplayFeasibilityQueryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
