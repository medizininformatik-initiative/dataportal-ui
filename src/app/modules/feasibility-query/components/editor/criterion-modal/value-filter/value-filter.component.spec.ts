import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ValueFilterComponent } from './value-filter.component'

describe.skip('ValueFilterComponent', () => {
  let component: ValueFilterComponent
  let fixture: ComponentFixture<ValueFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ValueFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
