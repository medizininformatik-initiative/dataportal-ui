/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { TokenFilterComponent } from './token-filter.component'

describe.skip('TokenFilterComponent', () => {
  let component: TokenFilterComponent
  let fixture: ComponentFixture<TokenFilterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TokenFilterComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
