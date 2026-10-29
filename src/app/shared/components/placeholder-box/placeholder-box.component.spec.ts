import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PlaceholderBoxComponent } from './placeholder-box.component'

describe.skip('PlaceholderBoxComponent', () => {
  let component: PlaceholderBoxComponent
  let fixture: ComponentFixture<PlaceholderBoxComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceholderBoxComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PlaceholderBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
