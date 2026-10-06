import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileReferenceChipComponent } from './profile-reference-chip.component'

describe.skip('ProfileReferenceChipComponent', () => {
  let component: ProfileReferenceChipComponent
  let fixture: ComponentFixture<ProfileReferenceChipComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileReferenceChipComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileReferenceChipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
