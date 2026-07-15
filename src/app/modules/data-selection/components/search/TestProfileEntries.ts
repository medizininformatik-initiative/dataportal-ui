import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'

export function createTestProfileEntries(): ProfileListEntry[] {
  const profiles = [
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-diagnose/StructureDefinition/Diagnose',
      name: 'MII PR Diagnose Condition',
      module: 'modul-diagnose',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-prozedur/StructureDefinition/Procedure',
      name: 'MII PR Prozedur Procedure',
      module: 'modul-prozedur',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-person/StructureDefinition/Vitalstatus',
      name: 'MII PR Person Vitalstatus',
      module: 'modul-person',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-person/StructureDefinition/Todesursache',
      name: 'MII PR Person Todesursache',
      module: 'modul-person',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-labor/StructureDefinition/DiagnosticReportLab',
      name: 'MII PR Labor Laborbefund',
      module: 'modul-labor',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-labor/StructureDefinition/ObservationLab',
      name: 'MII PR Labor Laboruntersuchung',
      module: 'modul-labor',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-labor/StructureDefinition/ServiceRequestLab',
      name: 'MII PR Labor Laboranforderung',
      module: 'modul-labor',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-medikation/StructureDefinition/MedicationRequest',
      name: 'MII PR Medikation MedicationRequest',
      module: 'modul-medikation',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-medikation/StructureDefinition/MedicationStatement',
      name: 'MII PR Medikation MedicationStatement',
      module: 'modul-medikation',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-medikation/StructureDefinition/medikationsliste',
      name: 'MII PR Medikation Medikationsliste',
      module: 'modul-medikation',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-medikation/StructureDefinition/Medication',
      name: 'MII PR Medikation Medication',
      module: 'modul-medikation',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-medikation/StructureDefinition/MedicationAdministration',
      name: 'MII PR Medikation MedicationAdministration',
      module: 'modul-medikation',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/core/modul-fall/StructureDefinition/KontaktGesundheitseinrichtung',
      name: 'MII PR Fall Kontakt mit einer Gesundheitseinrichtung',
      module: 'modul-fall',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/ext/modul-biobank/StructureDefinition/Specimen',
      name: 'Profile - Specimen - Bioprobe',
      module: 'modul-biobank',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/ext/modul-biobank/StructureDefinition/Organization',
      name: 'Profile - Organization - Sammlung/Biobank',
      module: 'modul-biobank',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/ext/modul-biobank/StructureDefinition/Substance',
      name: 'Profile - Substance - Additiv',
      module: 'modul-biobank',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-einwilligung',
      name: 'Profile - MI-I - Consent - Einwilligung',
      module: 'modul-consent',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-documentreference',
      name: 'Profile - MI-I - Consent - DocumentReference',
      module: 'modul-consent',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/modul-consent/StructureDefinition/mii-pr-consent-provenance',
      name: 'MII PR Consent Provenance',
      module: 'modul-consent',
    },
    {
      url: 'https://www.medizininformatik-initiative.de/fhir/ext/modul-icu/StructureDefinition/atemwegsdruck-bei-mitl-exspiratorischem-gasfluss',
      name: 'SD MII ICU Atemwegsdruck Bei Mitl Exspiratorischem Gasfluss',
      module: 'modul-icu',
    },
  ]

  return profiles.map((profile, index) => {
    return new ProfileListEntry(
      profile.url,
      new Display([], profile.name),
      index % 3,
      new Display([], profile.module),
      true
    )
  })
}
