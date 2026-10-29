/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { ReferenceComponent } from './reference-edit.component'

describe.skip('ReferenceComponent', () => {
  let component: ReferenceComponent
  let fixture: ComponentFixture<ReferenceComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferenceComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
