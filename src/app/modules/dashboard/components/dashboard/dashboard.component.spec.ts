import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc'
import { DashboardComponent } from './dashboard.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { IAppConfig } from 'src/app/config/model/AppConfig/AppConfigData'
import { DirectivesModule } from 'src/app/shared/directives/directives.module'
import { FeatureService } from '../../../../service/Feature.service'

describe.skip('DashboardComponent', () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  const authService = {
    loadUserProfile: () => Promise.resolve({}),
    hasValidAccessToken: (): boolean => true,
  } as OAuthService

  const config = {
    env: 'test',
  } as unknown as IAppConfig

  const featureService = {
    getStylesheet: (): string => 'abideTheme',
  } as FeatureService

  const testBedConfig = {
    declarations: [DashboardComponent],
    imports: [
      TranslateModule.forRoot(),
      HttpClientTestingModule,
      OAuthModule.forRoot(),
      DirectivesModule,
    ],
    providers: [
      {
        provide: OAuthService,
        useValue: authService,
      },
      {
        provide: FeatureService,
        useValue: featureService,
      },
    ],
  }

  it('should create', () => {
    TestBed.configureTestingModule(testBedConfig).compileComponents()
    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    component.config = config
    fixture.detectChanges()

    expect(component).toBeTruthy()
  })

  it('should show text "not logged in"', fakeAsync(() => {
    spyOn(authService, 'hasValidAccessToken').and.returnValue(false)

    TestBed.overrideProvider(OAuthService, { useValue: authService })
    TestBed.configureTestingModule(testBedConfig).compileComponents()
    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    component.config = config

    fixture.detectChanges()
    tick()

    expect(component.authTest).toEqual('Not logged in')
  }))

  it('should show text with name when logged in without roles', fakeAsync(() => {
    spyOn(authService, 'hasValidAccessToken').and.returnValue(true)
    spyOn(authService, 'loadUserProfile').and.returnValue(Promise.resolve({ name: 'Emmy' }))

    TestBed.overrideProvider(OAuthService, { useValue: authService })
    TestBed.configureTestingModule(testBedConfig).compileComponents()
    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    component.config = config

    fixture.detectChanges()
    tick()

    expect(component.authTest).toEqual('Hello Emmy')
  }))

  it('should show text with name when logged in with roles', fakeAsync(() => {
    spyOn(authService, 'hasValidAccessToken').and.returnValue(true)
    spyOn(authService, 'loadUserProfile').and.returnValue(
      Promise.resolve({ name: 'Emmy', groups: ['CODEX_DEVELOPER', 'MATHEMATICIAN'] })
    )

    TestBed.overrideProvider(OAuthService, { useValue: authService })
    TestBed.configureTestingModule(testBedConfig).compileComponents()
    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    component.config = config

    fixture.detectChanges()
    tick()

    expect(component.authTest).toEqual('Hello Emmy, Roles: CODEX_DEVELOPER, MATHEMATICIAN')
  }))
})
