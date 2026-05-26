// Shared module — all components are standalone; import them individually
// Providers (MAT_DATE_LOCALE, MAT_DATE_FORMATS) are now supplied via appConfig

export const FORMATS_GERMAN = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}
