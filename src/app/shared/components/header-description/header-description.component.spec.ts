import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeaderDescriptionComponent } from './header-description.component'

describe.skip('HeaderDescriptionComponent', () => {
  let component: HeaderDescriptionComponent
  let fixture: ComponentFixture<HeaderDescriptionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderDescriptionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderDescriptionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
