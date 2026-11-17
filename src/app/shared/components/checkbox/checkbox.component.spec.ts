import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CheckboxComponent } from './checkbox.component'

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>
  let input: HTMLInputElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxComponent] }).compileComponents()
    fixture = TestBed.createComponent(CheckboxComponent)
    fixture.detectChanges()
    input = fixture.nativeElement.querySelector('input')
  })

  it('emits the new state on click', () => {
    const emitted: boolean[] = []
    fixture.componentInstance.checkedChange.subscribe((v) => emitted.push(v))
    input.click()
    expect(emitted).toEqual([true])
  })

  it('reflects the checked and disabled inputs', () => {
    fixture.componentRef.setInput('checked', true)
    fixture.componentRef.setInput('disabled', true)
    fixture.detectChanges()
    expect(input.checked).toBe(true)
    expect(input.disabled).toBe(true)
  })

  it('leaves the tab order when not tabbable', () => {
    fixture.componentRef.setInput('tabbable', false)
    fixture.detectChanges()
    expect(input.getAttribute('tabindex')).toBe('-1')
  })
})
