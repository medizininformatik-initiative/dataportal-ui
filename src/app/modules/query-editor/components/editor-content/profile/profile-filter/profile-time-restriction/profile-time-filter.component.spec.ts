import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileTimeFilterComponent } from './profile-time-filter.component'

describe.skip('ProfileTimeRestrictionComponent', () => {
  let component: ProfileTimeFilterComponent
  let fixture: ComponentFixture<ProfileTimeFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileTimeFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileTimeFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
