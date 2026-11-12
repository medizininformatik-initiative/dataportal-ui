import { BackendService } from 'src/app/service/Backend/Backend.service'
import { BehaviorSubject, throwError } from 'rxjs'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryResultService } from 'src/app/service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ResultDetailModalComponent } from './result-detail-modal.component'
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { TestBed } from '@angular/core/testing'

describe('ResultDetailModalComponent', () => {
  const detailError = { code: 'FEAS-10004', retryAfterSeconds: undefined, until: Infinity }
  const snackbar = { displayErrorMessage: jest.fn() }
  const dialogRef = { close: jest.fn() }
  const resultService = { getDetailedObfuscatedResult: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    resultService.getDetailedObfuscatedResult.mockReturnValue(throwError(() => detailError))
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: BackendService, useValue: {} },
        { provide: SnackbarService, useValue: snackbar },
        { provide: FeasibilityQueryResultService, useValue: resultService },
        { provide: ResultProviderService, useValue: { getOne: () => undefined } },
        {
          provide: FeasibilityQueryProviderService,
          useValue: {
            getActiveFeasibilityQuery: () =>
              new BehaviorSubject({ getResultIds: () => ['r1'] }).asObservable(),
          },
        },
      ],
    })
  })

  it('shows the error code in the snackbar and closes instead of the generic error (#631)', async () => {
    TestBed.runInInjectionContext(() => new ResultDetailModalComponent()).ngOnInit()
    // deferred out of change detection (NG0100), so nothing has happened synchronously
    expect(snackbar.displayErrorMessage).not.toHaveBeenCalled()
    await Promise.resolve()
    expect(snackbar.displayErrorMessage).toHaveBeenCalledWith('FEAS-10004', undefined)
    expect(dialogRef.close).toHaveBeenCalled()
  })
})
