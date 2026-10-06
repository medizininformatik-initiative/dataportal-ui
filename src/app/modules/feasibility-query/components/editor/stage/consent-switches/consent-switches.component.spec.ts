import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConsentSwitchesComponent } from './consent-switches.component'

describe.skip('ConsentSwitchesComponent', () => {
  let component: ConsentSwitchesComponent
  let fixture: ComponentFixture<ConsentSwitchesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsentSwitchesComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ConsentSwitchesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
