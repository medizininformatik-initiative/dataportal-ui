/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { EditorContentComponent } from './editor-content.component'

describe.skip('EditorContentComponent', () => {
  let component: EditorContentComponent
  let fixture: ComponentFixture<EditorContentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorContentComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
