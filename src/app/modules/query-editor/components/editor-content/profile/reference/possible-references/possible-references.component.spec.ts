import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PossibleReferencesComponent } from './possible-references.component'

describe.skip('PossibleReferencesComponent', () => {
  let component: PossibleReferencesComponent
  let fixture: ComponentFixture<PossibleReferencesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PossibleReferencesComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PossibleReferencesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
