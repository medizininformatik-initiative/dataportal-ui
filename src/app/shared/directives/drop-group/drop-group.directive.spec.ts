import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DropGroupDirective } from './drop-group.directive'

describe.skip('DropGroupComponent', () => {
  let component: DropGroupDirective
  let fixture: ComponentFixture<DropGroupDirective>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropGroupDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(DropGroupDirective)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
