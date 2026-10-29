import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SimpleResultComponent } from './simple-result.component'

describe.skip('SimpleResultComponent', () => {
  let component: SimpleResultComponent
  let fixture: ComponentFixture<SimpleResultComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleResultComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SimpleResultComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
