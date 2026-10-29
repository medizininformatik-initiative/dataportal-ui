/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'
import { ProfileReferenceComponent } from './profile-reference.component'

describe.skip('TokenFilterComponent', () => {
  let component: ProfileReferenceComponent
  let fixture: ComponentFixture<ProfileReferenceComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileReferenceComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReferenceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
