import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FeasibilityQuerySearchComponent } from './search.component'

describe('FeasibilityQuerySearchComponent', () => {
  let component: FeasibilityQuerySearchComponent
  let fixture: ComponentFixture<FeasibilityQuerySearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeasibilityQuerySearchComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FeasibilityQuerySearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
