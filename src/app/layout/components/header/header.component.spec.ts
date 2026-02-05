import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LanguageComponent } from '../language/language.component';
import { HeaderComponent } from './header.component';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUserProfile } from '../../../shared/models/user/user-profile.interface';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  @Component({ selector: 'num-stub', template: '' })
  class StubComponent {}

  const profile = { info: {} } as IUserProfile;
  const authService = {
    logOut: () => {},
    loadUserProfile: () => Promise.resolve(profile),
    hasValidAccessToken: (): boolean => true,
  } as OAuthService;

  const featureService = {
    getStylesheet: (): string => 'abideTheme',
  } as FeatureService;

  const featureProviderService = {
    getFeatures: (): IAppConfig => ({
      env: null,
      api: null,
      uiBackendApi: null,
      features: null,
      stylesheet: 'abide',
      auth: null,
      dataset: null,
      queryVersion: null,
      options: null,
      fhirport: null,
      legal: null,
      mock: null,
      proposalPortalLink: null,
    }),
    setTheme: (oldTheme: string, newTheme: string): void => {},
  } as FeatureProviderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MaterialModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FontAwesomeTestingModule,
      ],
      providers: [
        {
          provide: OAuthService,
          useValue: authService,
        },
        {
          provide: FeatureProviderService,
          useValue: featureProviderService,
        },
        {
          provide: FeatureService,
          useValue: featureService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, LanguageComponent, StubComponent, ButtonComponent],
      imports: [FontAwesomeTestingModule, MaterialModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile', async () => {
    await component.initProfile();

    expect(component.profile).toEqual(profile);
  });
});
