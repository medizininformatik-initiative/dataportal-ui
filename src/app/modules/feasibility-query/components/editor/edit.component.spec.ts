import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FeasibilityQueryEditorComponent } from './edit.component'

describe.skip('EditorComponent', () => {
  let component: FeasibilityQueryEditorComponent
  let fixture: ComponentFixture<FeasibilityQueryEditorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeasibilityQueryEditorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FeasibilityQueryEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
