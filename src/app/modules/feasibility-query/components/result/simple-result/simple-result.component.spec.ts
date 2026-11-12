import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryResultService } from 'src/app/service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import { MatDialog } from '@angular/material/dialog'
import { of, throwError } from 'rxjs'
import { SimpleResultComponent } from './simple-result.component'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { TestBed } from '@angular/core/testing'

describe('SimpleResultComponent details (#631)', () => {
  const dialog = { open: jest.fn() }
  const snackbar = { displayErrorMessage: jest.fn() }
  const resultService = {
    getDetailedResultRateLimit: () => of(),
    refreshResultRateLimit: jest.fn(),
    getDetailedObfuscatedResult: jest.fn(),
  }
  let component: SimpleResultComponent

  beforeEach(() => {
    jest.clearAllMocks()
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) })
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: SnackbarService, useValue: snackbar },
        { provide: FeasibilityQueryResultService, useValue: resultService },
        { provide: AppSettingsProviderService, useValue: { getPollingTimeUi: () => 1 } },
        {
          provide: FeasibilityQueryProviderService,
          useValue: { getActiveFeasibilityQuery: () => of({ getResultIds: () => ['r1'] }) },
        },
      ],
    })
    component = TestBed.runInInjectionContext(() => new SimpleResultComponent())
  })

  it('shows the error and never opens the modal when the details request fails', () => {
    resultService.getDetailedObfuscatedResult.mockReturnValue(
      throwError(() => ({ code: 'FEAS-10005', retryAfterSeconds: undefined }))
    )
    component.openDialogResultDetails()
    expect(snackbar.displayErrorMessage).toHaveBeenCalledWith('FEAS-10005', undefined)
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('opens the modal once the details are there', () => {
    resultService.getDetailedObfuscatedResult.mockReturnValue(of({}))
    component.openDialogResultDetails()
    expect(dialog.open).toHaveBeenCalled()
    expect(snackbar.displayErrorMessage).not.toHaveBeenCalled()
  })
})
