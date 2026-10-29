import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ErrorDisplayService } from '../../service/ErrorDisplay/error-display.service'
import { ErrorDisplayComponent } from './error-display.component'

describe.skip('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent
  let fixture: ComponentFixture<ErrorDisplayComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      providers: [ErrorDisplayService],
    }).compileComponents()

    fixture = TestBed.createComponent(ErrorDisplayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
