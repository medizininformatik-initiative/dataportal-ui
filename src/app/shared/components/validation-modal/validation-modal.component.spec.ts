/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { ValidationModalComponent } from './validation-modal.component'

describe.skip('ValidationModalComponent', () => {
  let component: ValidationModalComponent
  let fixture: ComponentFixture<ValidationModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
