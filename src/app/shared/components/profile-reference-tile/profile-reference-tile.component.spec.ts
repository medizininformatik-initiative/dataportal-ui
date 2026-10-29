import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileReferenceTileComponent } from './profile-reference-tile.component'

describe.skip('ProfileReferenceComponent', () => {
  let component: ProfileReferenceTileComponent
  let fixture: ComponentFixture<ProfileReferenceTileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileReferenceTileComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProfileReferenceTileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
