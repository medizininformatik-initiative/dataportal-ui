/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { CriterionComponent } from './criterion.component'

describe.skip('CriterionComponent', () => {
  let component: CriterionComponent
  let fixture: ComponentFixture<CriterionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CriterionComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
