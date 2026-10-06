import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditorActionBarComponent } from './editor-action-bar.component'

describe.skip('StageComponent', () => {
  let component: EditorActionBarComponent
  let fixture: ComponentFixture<EditorActionBarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorActionBarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EditorActionBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
