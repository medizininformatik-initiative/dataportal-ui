import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AllowedUnitsComponent } from './allowed-units.component'

describe.skip('AllowedUnitsComponent', () => {
  let component: AllowedUnitsComponent
  let fixture: ComponentFixture<AllowedUnitsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllowedUnitsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AllowedUnitsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
