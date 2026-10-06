import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConceptComponent } from './concept.component'

describe.skip('ConceptComponent', () => {
  let component: ConceptComponent
  let fixture: ComponentFixture<ConceptComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ConceptComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
