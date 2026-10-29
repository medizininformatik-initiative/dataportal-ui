import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LogicSwitchComponent } from './logic-switch.component'

describe.skip('LogicSwitchComponent', () => {
  let component: LogicSwitchComponent
  let fixture: ComponentFixture<LogicSwitchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogicSwitchComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LogicSwitchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
