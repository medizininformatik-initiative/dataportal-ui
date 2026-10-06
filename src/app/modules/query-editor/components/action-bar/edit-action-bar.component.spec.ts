/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { EditActionBarComponent } from './edit-action-bar.component'

describe.skip('EditActionBarComponent', () => {
  let component: EditActionBarComponent
  let fixture: ComponentFixture<EditActionBarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditActionBarComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActionBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
