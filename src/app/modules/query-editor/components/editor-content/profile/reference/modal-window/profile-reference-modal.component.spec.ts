/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { ProfileReferenceModalComponent } from './profile-reference-modal.component'

describe.skip('TokenFilterComponent', () => {
  let component: ProfileReferenceModalComponent
  let fixture: ComponentFixture<ProfileReferenceModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileReferenceModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReferenceModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
