import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BoolLogicSwitchComponent } from './bool-logic-switch.component'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MaterialModule } from 'src/app/layout/material/material.module'

describe.skip('BoolLogicSwitchComponent', () => {
  let component: BoolLogicSwitchComponent
  let fixture: ComponentFixture<BoolLogicSwitchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, FontAwesomeTestingModule, TranslateModule.forRoot()],
      declarations: [BoolLogicSwitchComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BoolLogicSwitchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit switched event', () => {
    spyOn(component.switched, 'emit')

    // trigger the click
    const nativeElement = fixture.nativeElement
    const button = nativeElement.querySelector('mat-chip')
    button.dispatchEvent(new Event('click'))

    expect(component.switched.emit).toHaveBeenCalledWith('outer')
  })
})
