import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SectionNameComponent } from './section-name.component'

describe.skip('SectionNameComponent', () => {
  let component: SectionNameComponent
  let fixture: ComponentFixture<SectionNameComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionNameComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SectionNameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
