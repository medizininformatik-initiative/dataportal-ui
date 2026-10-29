import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditTimeRestrictionComponent } from './edit-time-restriction.component'

describe.skip('EditTimeRestrictionComponent', () => {
  let component: EditTimeRestrictionComponent
  let fixture: ComponentFixture<EditTimeRestrictionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTimeRestrictionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EditTimeRestrictionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
