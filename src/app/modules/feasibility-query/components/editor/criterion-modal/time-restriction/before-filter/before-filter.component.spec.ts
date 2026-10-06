import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BeforeFilterComponent } from './before-filter.component'

describe.skip('BeforeFilterComponent', () => {
  let component: BeforeFilterComponent
  let fixture: ComponentFixture<BeforeFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeforeFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BeforeFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
