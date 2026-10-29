import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditFieldsComponent } from './edit-fields.component'

describe.skip('EditFieldsComponent', () => {
  let component: EditFieldsComponent
  let fixture: ComponentFixture<EditFieldsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFieldsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EditFieldsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
