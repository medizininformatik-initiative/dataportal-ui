import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TimerestrictionTypeSelectorComponent } from './timerestriction-type-selector.component'

describe.skip('TimerestrictionTypeSelectorComponent', () => {
  let component: TimerestrictionTypeSelectorComponent
  let fixture: ComponentFixture<TimerestrictionTypeSelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerestrictionTypeSelectorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TimerestrictionTypeSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
