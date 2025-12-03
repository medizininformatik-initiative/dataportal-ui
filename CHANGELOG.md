# Changelog

## v6.4.0 (2025-11-24)

### Changed
* Removed unused and outdated configuration entries; Data Portal settings are now retrieved from the backend settings endpoint during application initialization. [#432](https://github.com/medizininformatik-initiative/feasibility-gui/issues/432)
* CRTDL display objects are now loaded from the backend at startup. [#455](https://github.com/medizininformatik-initiative/feasibility-gui/issues/455)
* Improved display of terminology titles. [#465](https://github.com/medizininformatik-initiative/feasibility-gui/issues/465)
* Renamed the URL of the profile editing page to use the “feature” segment. [#467](https://github.com/medizininformatik-initiative/feasibility-gui/issues/467)

### Features
* Implemented auto-save functionality in the data selection editor; profile changes are now saved automatically.
  [#468](https://github.com/medizininformatik-initiative/feasibility-gui/issues/468)
* Added a selectable boolean to criteria-relative data to prevent adding elements to the cohort when not allowed.
  [#482](https://github.com/medizininformatik-initiative/feasibility-gui/issues/482)
* Outsourced the action bar from the data-selection display component.
  [#479](https://github.com/medizininformatik-initiative/feasibility-gui/issues/479)

### Fixed
* Fixed UI crashes occurring when linking a reference in the data selection.
  [#478](https://github.com/medizininformatik-initiative/feasibility-gui/issues/478)
* Prevented flickering of route animations.
  [#483](https://github.com/medizininformatik-initiative/feasibility-gui/issues/483)
* Prevented accidental deletion of selected concepts in the criterion editor during scrolling and enabled automatic addition to stage.
  [#486](https://github.com/medizininformatik-initiative/feasibility-gui/issues/486)
* Ensured that the criterion filter is loaded correctly when not set in CRTDL by using the value-attribute definition.
  [#488](https://github.com/medizininformatik-initiative/feasibility-gui/issues/488)


## v6.3.7 (2025-10-08)

### Features
* Major overhaul of CSS and component layouts for improved consistency and responsiveness. [#452](https://github.com/medizininformatik-initiative/feasibility-gui/issues/452), [#440](https://github.com/medizininformatik-initiative/feasibility-gui/issues/440)

### Changed
* Updated the behavior of criteria relations for better logical handling. [#452](https://github.com/medizininformatik-initiative/feasibility-gui/issues/452)

### Fixed
* Fixed missing token and date filters when loading a CRTDL. [#453](https://github.com/medizininformatik-initiative/feasibility-gui/issues/453)
* Fixed an issue where unmatched fields in a loaded CRTDL were not properly removed [#454](https://github.com/medizininformatik-initiative/feasibility-gui/issues/454)
* Corrected sorting behavior of criteria. [#419](https://github.com/medizininformatik-initiative/feasibility-gui/issues/419)


## v6.3.6 (2025-09-19)

### Feature
* Updated UI profile to support multiple value sets and criteria sets for feasibility [#425](https://github.com/medizininformatik-initiative/feasibility-gui/issues/425)

### Changed
* Redesigned snackbar [#447](https://github.com/medizininformatik-initiative/feasibility-gui/issues/447)
* Added feedback through the snackbar on profile edit [#448](https://github.com/medizininformatik-initiative/feasibility-gui/issues/448)

### Fixed
* Prevent field tree from collapsing on every selection [#445](https://github.com/medizininformatik-initiative/feasibility-gui/issues/445)
* Ensure patient profile always remains part of the data extraction [#449](https://github.com/medizininformatik-initiative/feasibility-gui/issues/449)
* Allow unsetting/deleting of filters [#442](https://github.com/medizininformatik-initiative/feasibility-gui/issues/442)



## v6.3.5 (2025-08-24)

### Changed
* Changed description of Feature Selection [#438](https://github.com/medizininformatik-initiative/feasibility-gui/issues/438)
* Refactor user profile handling across services and components [#436](https://github.com/medizininformatik-initiative/feasibility-gui/pull/436)
* Add AuthToken and HttpError interceptors for improved HTTP request handling [#435](https://github.com/medizininformatik-initiative/feasibility-gui/pull/435)



## v6.3.4 (2025-08-18)

### Feature
* Infinite scrolling – implemented for CodeableConcept search, Criteria search, and Reference search [#217](https://github.com/medizininformatik-initiative/feasibility-gui/issues/217)
* Support loading of query by id via url params [#416](https://github.com/medizininformatik-initiative/feasibility-gui/issues/416)
* Add Link to Proposal Portal [#368](https://github.com/medizininformatik-initiative/feasibility-gui/issues/368)
* Display tree icon next to each search result [#413](https://github.com/medizininformatik-initiative/feasibility-gui/issues/413)

### Fixed
* Fix selected Fields window placement [#417](https://github.com/medizininformatik-initiative/feasibility-gui/issues/417)

### Changed
* Search architecture reworked – streamlined data flow and improved clarity of the search process.
* Search engine updates – revised engine logic and search operation flow.
* Keyed vs. simple search distinction – introduced clear separation between searches with a dataset URL (keyed search) and simple result searches.
* New abstraction layers – improved maintainability and separation of concerns.
* Refactored class names – applied consistent and meaningful naming conventions.
* Type safety improvements – added TypeGuard utilities and type assertions for safer runtime checks.
* Schema validation – introduced interfaces to enforce the search schema structure.
* Implemented resolver logic to load and validate query information before component initialization.
* Updated CSS styling for the error-handling snackbar



## v6.3.3 (2025-07-24)

### Feature
* Preloaded criteria filter, criteria search results and data selection profiles before page load using Angular route resolver [#415](https://github.com/medizininformatik-initiative/feasibility-gui/issues/415)

### Fixed
* Added missing language entries [#412](https://github.com/medizininformatik-initiative/feasibility-gui/issues/412)


## v6.3.2 (2025-07-21)

### HotFix
* add missing lang entry
* fix auth config


## v6.3.1 (2025-07-21)

### Feature
* **About Page** with system version information (UI, Backend, Ontology) [#403](https://github.com/medizininformatik-initiative/feasibility-gui/issues/403)

### Changed
* Updated **language files** in `src/assets/i18n` [#393](https://github.com/medizininformatik-initiative/feasibility-gui/issues/393), [#399](https://github.com/medizininformatik-initiative/feasibility-gui/issues/399), [#400](https://github.com/medizininformatik-initiative/feasibility-gui/issues/400)

### Fixed
* Ensured **all CI tests** run successfully [#405](https://github.com/medizininformatik-initiative/feasibility-gui/issues/405)
* Fix snackbar message when cancel downloading [#398](https://github.com/medizininformatik-initiative/feasibility-gui/issues/398)


## v6.3.0 (2025-07-01)

### Feature
* new e2e testing with Cypress Gherkin 

### Changes
* Refactor Action-Bar Logic into Separate Components ([#335](https://github.com/medizininformatik-initiative/feasibility-gui/issues/335))
* Change download behaviour of Cohort selection ([#395](https://github.com/medizininformatik-initiative/feasibility-gui/issues/395))
* Query without data selection is not saveable anymore ([#396](https://github.com/medizininformatik-initiative/feasibility-gui/issues/396))

### Bug Fixes
* Fix for mandatory patient feature is added to DSE on query load ([#394](https://github.com/medizininformatik-initiative/feasibility-gui/issues/394))
* Checkbox for "Only if referenced" is only be visible if feature is referenced ([#397](https://github.com/medizininformatik-initiative/feasibility-gui/issues/397))


## v6.2.0 (2025-05-27)

### Feature
* Implemented loading of reference profile lists ([#381](https://github.com/medizininformatik-initiative/feasibility-gui/issues/381))
* Added support for single feature patient profiles ([#380](https://github.com/medizininformatik-initiative/feasibility-gui/issues/380))
* Prevent Maximum Quantity Value from Being Less Than Minimum Quantity ([#374](https://github.com/medizininformatik-initiative/feasibility-gui/issues/374))

### Changes
* Completed rework of Core Service for improved internal structure ([#387](https://github.com/medizininformatik-initiative/feasibility-gui/issues/387))

### Bug Fixes
* Fix downloading an uploaded CRTDL with filter again ([#382](https://github.com/medizininformatik-initiative/feasibility-gui/issues/382))
* Fixing various small issues ([#386](https://github.com/medizininformatik-initiative/feasibility-gui/issues/386))


## v6.2.0-alpha (2025-05-12)

### Feature
* Added new editor pages for Criterion and Profile ([#373](https://github.com/medizininformatik-initiative/feasibility-gui/issues/373))
* Implemented reference solution as per related issue ([#309](https://github.com/medizininformatik-initiative/feasibility-gui/issues/309))

### Changes
* Introduced updated data model ([#373](https://github.com/medizininformatik-initiative/feasibility-gui/issues/373))
* Adjusted CSS for indentation in tree view ([#350](https://github.com/medizininformatik-initiative/feasibility-gui/issues/350))
* Increased ElasticSearch visualization limit from 20 to 50 matches ([#352](https://github.com/medizininformatik-initiative/feasibility-gui/issues/352))

### Bug Fixes
* fixes for various minor issues and clean up code




## v6.1.0 (2025-04-04)

### Changes
* switch to API v5
* switch date display to european format ([#371](https://github.com/medizininformatik-initiative/feasibility-gui/issues/371))

### Feature
* new save dialog with checkboxes for cohort and data selection ([#354](https://github.com/medizininformatik-initiative/feasibility-gui/issues/354))
* new TypeGuard and Type Assertion functionality for type safety during compiling time ([#360](https://github.com/medizininformatik-initiative/feasibility-gui/issues/360))

### Bug Fixes
* fixes for various minor issues and clean up code




## v6.0.10 (2025-03-19)

### Bug Fixes
*  Updated hasQueryResult handling in result action bar component to save cohorts ([#365](https://github.com/medizininformatik-initiative/feasibility-gui/issues/365))


## v6.0.9 (2025-03-19)

### Bug Fixes
* Prevent constant openings of modal after downloading query  ([#363](https://github.com/medizininformatik-initiative/feasibility-gui/issues/363))

### Changes
* Adjustments for german UI translation



## v6.0.8 (2025-03-11)

### Bug Fixes
* Increment the details button counter after the modal is closed ([#357](https://github.com/medizininformatik-initiative/feasibility-gui/issues/357))
* Split URL list of data selection references based on URL length ([#353](https://github.com/medizininformatik-initiative/feasibility-gui/issues/353))
* UI now continues polling results even after receiving an error from `summary-result`. If the final response contains an error, it will be displayed, while intermediate errors are ignored to ensure uninterrupted polling ([#349](https://github.com/medizininformatik-initiative/feasibility-gui/issues/349))



## v6.0.7 (2025-02-27)

### Bug Fixes
* Fixed index increment issue with parentheses ([#313](https://github.com/medizininformatik-initiative/feasibility-gui/issues/313))
* Reduced container height ([#343](https://github.com/medizininformatik-initiative/feasibility-gui/issues/343))
* Corrected consent subscription ([#344](https://github.com/medizininformatik-initiative/feasibility-gui/issues/344))

### Features
* Defined and applied interfaces ([#333](https://github.com/medizininformatik-initiative/feasibility-gui/issues/333))
* Refactored CriterionValidationService into smaller services ([#332](https://github.com/medizininformatik-initiative/feasibility-gui/issues/332))
* Merged two criterion creation services into one ([#326](https://github.com/medizininformatik-initiative/feasibility-gui/issues/326))
* Added translation for consent text ([#263](https://github.com/medizininformatik-initiative/feasibility-gui/issues/263))



## v6.0.6 (2025-02-18)

### Bug Fixes
* fixed error message for missing consent validation

### Changes
* Refactored CreateCriterionService ([#326](https://github.com/medizininformatik-initiative/feasibility-gui/issues/326))



## v6.0.5 (2025-02-17)

### Bug Fixes
* fixed wrong key for valueDefinition mapping



## v6.0.4 (2025-02-14)

### Bug Fixes
* fixed wrong key for attributeDefinition mapping

### Changes
* Refactored criterion hash service



## v6.0.4-alpha (2025-02-11)

### Bug Fixes
* Removed hashes in result details modal and replaced them with DIZ n-1 ([#313](https://github.com/medizininformatik-initiative/feasibility-gui/issues/313)).
* Fixed error message display and refactored snackbar service ([#310](https://github.com/medizininformatik-initiative/feasibility-gui/issues/310)).
* Resolved inconsistency between summary and detail results ([#303](https://github.com/medizininformatik-initiative/feasibility-gui/issues/303), [#304](https://github.com/medizininformatik-initiative/feasibility-gui/issues/304)).

### Changes
* Refactored feasibility query result service into smaller services ([#329](https://github.com/medizininformatik-initiative/feasibility-gui/issues/329)).
* Updated result details only once per feasibility query ([#317](https://github.com/medizininformatik-initiative/feasibility-gui/issues/317)).
* Refactored backend service ([#312](https://github.com/medizininformatik-initiative/feasibility-gui/issues/312)).

### Features
* Added UI support for attribute translations and main value display ([#314](https://github.com/medizininformatik-initiative/feasibility-gui/issues/314), [#311](https://github.com/medizininformatik-initiative/feasibility-gui/issues/311), [#315](https://github.com/medizininformatik-initiative/feasibility-gui/issues/315)).
* Displayed warning message when the start date is earlier than the end date ([#308](https://github.com/medizininformatik-initiative/feasibility-gui/issues/308)).




## v6.0.3 (2024-12-09)

### Bugfix

* Update query result after each polling intervall ([#303](https://github.com/medizininformatik-initiative/feasibility-gui/issues/304))


## v6.0.2 (2024-11-21)

### Bugfix

* Getting polling time from Feature-Provider-Service instead of Feature-Service
* Repeat polling until end of timer, regardless Null results in between



## v6.0.1 (2024-11-20)

### Bugfix

* Display data for all chip types correctly
* small language fixes

### Changed
* Increased pencil size icon in menu



## v6.0.0 (2024-11-20)

* New Design
  - Introduced a completely redesigned user interface for an improved user experience.
  - Updated visual elements, including color schemes, typography, and iconography, to create a modern and cohesive look.

* New Data Model
  - Implemented a new data model to enhance data handling and processing capabilities.

* New Component Structure
  - Reorganized the component structure for better modularity and maintainability.

* New Process Infrastructure
  - Developed a new process infrastructure to optimize system performance and scalability.
  - Redesigned the information architecture to make content more discoverable and ensure logical organization of information throughout the platform.

* New Backend Endpoints
  - Added new backend endpoints to support additional functionalities and improve API interactions.
  - Integrated Elastic Search feature that allows users to quickly find criteria and concepts within the application.

* New Module: Data Selection
  - Introduced a new data selection module to facilitate more efficient data management and retrieval.

* New translation services
  - Implemented new translation services for converting FeasibilityQueries and DataSelections to new CRDTL format.


### Feature

* Referenced Profiles in DSE Fields: ([#292](https://github.com/medizininformatik-initiative/feasibility-gui/issues/292)), ([#294](https://github.com/medizininformatik-initiative/feasibility-gui/issues/294))
  * Introduced referencedProfiles field for DSE to identify profiles referenced by a given field.
  * Added a checkbox in the UI to specify if a field is included as a profile reference or as a profile itself.
  * Automatic Addition of Referenced Profiles: When fetching the data selection profile, automatically include referenced profiles if the reference field is marked as required or recommended.
* Enable upload of data definition and cohort in data definition page
* Feature: reset time restriction, added new data class TimeRestrictionNotSet as default class
* added language switch
* implemented a new snackbar notification system to display error messages
* added animations for routing between pages
* introduced a stepper component for the data-query page
* removed the dashboard and set the Data Request page as the default start page ([#260](https://github.com/medizininformatik-initiative/feasibility-gui/issues/260))
* Switched from module to context in Search Result list ([#286](https://github.com/medizininformatik-initiative/feasibility-gui/issues/286))
* Added service to validate whether a criterion has all optional filters set and if inclusion criteria are set.
* Checked through service whether required attributes are set ([#277](https://github.com/medizininformatik-initiative/feasibility-gui/issues/277))
* Extended data model and added key to data object in adapter for profile tree; added info to view component to display field names comma-separated next to profile in DSE tree ([#275](https://github.com/medizininformatik-initiative/feasibility-gui/issues/275))
* Added required and recommended fields in data model and disabled delete for required fields([#273](https://github.com/medizininformatik-initiative/feasibility-gui/issues/273))
* Implemented dynamic tab title based on page and subpage ([#174](https://github.com/medizininformatik-initiative/feasibility-gui/issues/174))


### Changed
* update to new api endpoint version v4 ([#232](https://github.com/medizininformatik-initiative/feasibility-gui/issues/232))
* setting uniqueID for each DataSelection profile
* Changing icons, header and descriptions for better usability
* Update translations
* added new translators for FeasibilityQuery <> CCTDL and DataSelection <> CCTDL
* refactored Urls: querybuilder was renamed to feasibility-query
* split the feasibility-query page into three subpages: Search, Editor, and Result, each with representative URLs (feasibility-query/search, feasibility-query/editor, feasibility-query/result)
* split the data-selection page into three subpages: Search, Editor, and Result, with representative URLs (data-selection/search, data-selection/editor, data-selection/result)
* split the data-query page into two pages: Cohort Definition and Data Selection, with representative URLs (data-query/cohort-definition, data-query/data-selection).
* renamed file and folder names: querybuilder is now feasibility-query
* Added validation check before downloading and uploading a data request or cohort definition on the data request page
* Changed label in numerical input fields and swapped min and max input fields in RangeFilter


### Bugfix
* fixed display and css of the search filter ([#231](https://github.com/medizininformatik-initiative/feasibility-gui/issues/231))
* fixed spelling issue ([#230](https://github.com/medizininformatik-initiative/feasibility-gui/issues/230))
* fixed filter error in the linking criteria search ([#229](https://github.com/medizininformatik-initiative/feasibility-gui/issues/229))
* fixed search param error in the linking criteria search ([#228](https://github.com/medizininformatik-initiative/feasibility-gui/issues/228))
* show attribute display in the modal window ([#227](https://github.com/medizininformatik-initiative/feasibility-gui/issues/227))
* fixed viewport for Drag&Drop ([#226](https://github.com/medizininformatik-initiative/feasibility-gui/issues/226))
* exclude termcode version from hash ([#224](https://github.com/medizininformatik-initiative/feasibility-gui/issues/224))
* fixed various css problems
* Loading large queries - separate queries to chunks for getting profile data by ids ([#290](https://github.com/medizininformatik-initiative/feasibility-gui/issues/290))
* apply rerendering after setting filter ([#238](https://github.com/medizininformatik-initiative/feasibility-gui/issues/238))
* fix moving criteria within in- and exclusion ([#236](https://github.com/medizininformatik-initiative/feasibility-gui/issues/236))
* added missing translation keys
* fixed various css problems
* various bugfixing and code refactoring
* allowed empty search strings to be treated as valid search terms despite the minimum length requirement of 3 characters ([#254](https://github.com/medizininformatik-initiative/feasibility-gui/issues/254))
* added a ternary operator for the placeholder ([#255](https://github.com/medizininformatik-initiative/feasibility-gui/issues/255))
* fixed consent issue when loading from saved queries and starting a request.
* Fixed translation of Quantity in CCDL Translator ([#282](https://github.com/medizininformatik-initiative/feasibility-gui/issues/282))
* Fixed setting of comparator by creating a mapping function from UI intern to CCDL comparator ([#281](https://github.com/medizininformatik-initiative/feasibility-gui/issues/281))
* Set optional when creating a criterion based on the criteria profile data ([#280](https://github.com/medizininformatik-initiative/feasibility-gui/issues/280))
* Added missing function for translating valueFilter from CCDL to Ui intern data model ([#278](https://github.com/medizininformatik-initiative/feasibility-gui/issues/278))
* Added missing check for field children ([#274](https://github.com/medizininformatik-initiative/feasibility-gui/commit/3ff9d5a756025139497dc05654d8ac84f1941133))
* Display previously selected filter and search text when switching between search and editor page ([#262](https://github.com/medizininformatik-initiative/feasibility-gui/issues/262))
* Enabled multiple ValueSet URLs for CodeableConcept search, concatenated by commas ([#253](https://github.com/medizininformatik-initiative/feasibility-gui/issues/253))



## v6.0.0-alpha.6 (2024-11-15)

### Changed
* Added validation check before downloading and uploading a data request or cohort definition on the data request page
* Changed label in numerical input fields and swapped min and max input fields in RangeFilter

### Feature
* Switched from module to context in Search Result list ([#286](https://github.com/medizininformatik-initiative/feasibility-gui/issues/286))
* Added service to validate whether a criterion has all optional filters set and if inclusion criteria are set.
* Checked through service whether required attributes are set ([#277](https://github.com/medizininformatik-initiative/feasibility-gui/issues/277))
* Extended data model and added key to data object in adapter for profile tree; added info to view component to display field names comma-separated next to profile in DSE tree ([#275](https://github.com/medizininformatik-initiative/feasibility-gui/issues/275))
* Added required and recommended fields in data model and disabled delete for required fields([#273](https://github.com/medizininformatik-initiative/feasibility-gui/issues/273))
* Implemented dynamic tab title based on page and subpage ([#174](https://github.com/medizininformatik-initiative/feasibility-gui/issues/174))

### Bugfix
* Fixed translation of Quantity in CCDL Translator ([#282](https://github.com/medizininformatik-initiative/feasibility-gui/issues/282))
* Fixed setting of comparator by creating a mapping function from UI intern to CCDL comparator ([#281](https://github.com/medizininformatik-initiative/feasibility-gui/issues/281))
* Set optional when creating a criterion based on the criteria profile data ([#280](https://github.com/medizininformatik-initiative/feasibility-gui/issues/280))
* Added missing function for translating valueFilter from CCDL to Ui intern data model ([#278](https://github.com/medizininformatik-initiative/feasibility-gui/issues/278))
* Added missing check for field children ([#274](https://github.com/medizininformatik-initiative/feasibility-gui/commit/3ff9d5a756025139497dc05654d8ac84f1941133))
* Display previously selected filter and search text when switching between search and editor page ([#262](https://github.com/medizininformatik-initiative/feasibility-gui/issues/262))
* Enabled multiple ValueSet URLs for CodeableConcept search, concatenated by commas ([#253](https://github.com/medizininformatik-initiative/feasibility-gui/issues/253))



## v6.0.0-alpha.5 (2024-10-30)

### Changed
* refactored Urls: querybuilder was renamed to feasibility-query
* split the feasibility-query page into three subpages: Search, Editor, and Result, each with representative URLs (feasibility-query/search, feasibility-query/editor, feasibility-query/result)
* split the data-selection page into three subpages: Search, Editor, and Result, with representative URLs (data-selection/search, data-selection/editor, data-selection/result)
* split the data-query page into two pages: Cohort Definition and Data Selection, with representative URLs (data-query/cohort-definition, data-query/data-selection).
* renamed file and folder names: querybuilder is now feasibility-query

### Feature
* implemented a new snackbar notification system to display error messages
* added animations for routing between pages
* introduced a stepper component for the data-query page
* removed the dashboard and set the Data Request page as the default start page ([#260](https://github.com/medizininformatik-initiative/feasibility-gui/issues/260))


### Bugfix
* allowed empty search strings to be treated as valid search terms despite the minimum length requirement of 3 characters ([#254](https://github.com/medizininformatik-initiative/feasibility-gui/issues/254))
* added a ternary operator for the placeholder ([#255](https://github.com/medizininformatik-initiative/feasibility-gui/issues/255))
* fixed consent issue when loading from saved queries and starting a request.



## v6.0.0-alpha.4 (2024-10-20)

### Changed
* added new translators for FeasibilityQuery <> CCTDL and DataSelection <> CCTDL

### Bugfix
* various bugfixing and code refactoring



## v6.0.0-alpha.3 (2024-09-09)

### Feature
* added language switch

### Bugfix
* apply rerendering after setting filter ([#238](https://github.com/medizininformatik-initiative/feasibility-gui/issues/238))
* fix moving criteria within in- and exclusion ([#236](https://github.com/medizininformatik-initiative/feasibility-gui/issues/236))
* added missing translation keys
* fixed various css problems


## v6.0.0-alpha.2 (2024-09-05)

### Bugfix
* fixed display and css of the search filter ([#231](https://github.com/medizininformatik-initiative/feasibility-gui/issues/231))
* fixed spelling issue ([#230](https://github.com/medizininformatik-initiative/feasibility-gui/issues/230))
* fixed filter error in the linking criteria search ([#229](https://github.com/medizininformatik-initiative/feasibility-gui/issues/229))
* fixed search param error in the linking criteria search ([#228](https://github.com/medizininformatik-initiative/feasibility-gui/issues/228))
* show attribute display in the modal window ([#227](https://github.com/medizininformatik-initiative/feasibility-gui/issues/227))
* fixed viewport for Drag&Drop ([#226](https://github.com/medizininformatik-initiative/feasibility-gui/issues/226))
* exclude termcode version from hash ([#224](https://github.com/medizininformatik-initiative/feasibility-gui/issues/224))
* fixed various css problems

### Changed
* update to new api endpoint version v4 ([#232](https://github.com/medizininformatik-initiative/feasibility-gui/issues/232))
* setting uniqueID for each DataSelection profile



## v6.0.0-alpha.1 (2024-08-28)

### Changed
* New Design
  - Introduced a completely redesigned user interface for an improved user experience.
  - Updated visual elements, including color schemes, typography, and iconography, to create a modern and cohesive look.
  
* New Data Model
  - Implemented a new data model to enhance data handling and processing capabilities.
  
* New Component Structure
  - Reorganized the component structure for better modularity and maintainability.
  
* New Process Infrastructure
  - Developed a new process infrastructure to optimize system performance and scalability.
  - Redesigned the information architecture to make content more discoverable and ensure logical organization of information throughout the platform.
  
* New Backend Endpoints
  - Added new backend endpoints to support additional functionalities and improve API interactions.
  - Integrated Elastic Search feature that allows users to quickly find criteria and concepts within the application.

* New Module: Data Selection
  - Introduced a new data selection module to facilitate more efficient data management and retrieval.
  
* New translation services 
  - Implemented new translation services for converting FeasibilityQueries and DataSelections to new CRDTL format.



## v5.0.0-alpha.1 (2024-04-01)

### Changed
* Custom Internal Data Format for Structured Queries:
  -	Developed an internal data format specifically for Structured Queries, a data representation developed by our team.
* Improved Data Model Structure:
  -	Restructured the data model for better representation of Structured Queries through class and folder organization.
* Utilization of Abstract Classes and General Concepts:
  -	Incorporated abstract classes and general concepts into the data model for improved versatility.
* Simplified Attribute and Value Filter Types:
  -	Cleaned up attribute and value filter types for easier use.
* Type Checking Service Implementation:
  -	Added a service to perform type validation checks for attribute and value filter types.
* Structured Query Translation Service
  -	New translation services for translating UI query model to Structured Query and backwards for loading and import
* Structured Query validation:
  -	Uploaded Structured Queries gets validated
  -	Validation process changed for more precise information, which part of the structured query is corrupt


## v2.3.4 (2023-12-15)

### Bugfix
* Fix loading queries with empty or undefined results ([#161](https://github.com/medizininformatik-initiative/feasibility-gui/pull/161))


## v2.3.3 (2023-12-14)

### Bugfix
* Fix save-button on loading queries ([#159](https://github.com/medizininformatik-initiative/feasibility-gui/pull/159))
* Show patient results for saved queries 
* Fix height for search popup


## v2.3.2 (2023-12-14)

### Feature
* Improved design and handling of loading queries and templates ([#154](https://github.com/medizininformatik-initiative/feasibility-gui/pull/154))


## v2.3.1 (2023-12-08)

### Bugfix
* Fix: reset Snackbar after incompatible query message ([#151](https://github.com/medizininformatik-initiative/feasibility-gui/pull/151))


## v2.3.0 (2023-12-08)

### Bugfix
* Fix: set correct english display for Send Button ([#149](https://github.com/medizininformatik-initiative/feasibility-gui/pull/149))
* Fix: fix translation to Structured Query for quantity-range filter ([#148](https://github.com/medizininformatik-initiative/feasibility-gui/pull/148))
* Fix: fix location result display when result is 0 ([#146](https://github.com/medizininformatik-initiative/feasibility-gui/pull/146))

### Feature
* Support loading of non-compatible queries and templates; shows warning for every incorrect criterion ([#147](https://github.com/medizininformatik-initiative/feasibility-gui/pull/147))


## v2.2.0 (2023-11-17)

### Bugfix
* Fix: Update central consent to set conset criterion directly ([#139](https://github.com/medizininformatik-initiative/feasibility-gui/pull/138))
* fix: display unit when selecting value range ([#139](https://github.com/medizininformatik-initiative/feasibility-gui/pull/139))


## v2.1.0 (2023-11-09)

### Feature
* Link to proposal configurable([#126](https://github.com/medizininformatik-initiative/feasibility-gui/issues/126))
* Allow setting criterion as required for dataselection ([#125](https://github.com/medizininformatik-initiative/feasibility-gui/issues/125))
* Make all termtree nodes selectable for dataselection ([#124](https://github.com/medizininformatik-initiative/feasibility-gui/issues/124))
* Add info text to dataselection ([#123](https://github.com/medizininformatik-initiative/feasibility-gui/issues/123))
* Add info snakebar for Downtime ([#122](https://github.com/medizininformatik-initiative/feasibility-gui/issues/122))
* Update saving of queries and templates ([#116](https://github.com/medizininformatik-initiative/feasibility-gui/issues/116))
* Make value filter optional according to ui profile ([#112](https://github.com/medizininformatik-initiative/feasibility-gui/issues/112))
* Improve error handling ([#88](https://github.com/medizininformatik-initiative/feasibility-gui/issues/88))

### Bugfix
* Error loading linked criteria ([#131](https://github.com/medizininformatik-initiative/feasibility-gui/issues/131))
* Remove value filter if no concept selected ([#121](https://github.com/medizininformatik-initiative/feasibility-gui/issues/121))
* Quantity for Attributes does not work ([119](https://github.com/medizininformatik-initiative/feasibility-gui/issues/119))
* Loading of linking criterion does not work ([#115](https://github.com/medizininformatik-initiative/feasibility-gui/issues/115))

## v2.0.0 (2023-10-08)

### Feature
* Update to Ontology Version 2.0.0
* Add Context and dynamic ui profile loading
* Add Referenced Criteria
* Add reset filter option
* Make values optional according to ui_profile information
* Dataselection
* Upload Feasibility Query
* Make UI user configurable via config

## v1.0.0 (2023-03-29)

### Feature
* add import and download functionality for Structured Query files
* add consent chooser
* adding tooltips
* add getting rate limit result from backend
* make copyright year configurable

### Bugfix
* change baseurl path in configuration
* refactor docker setup and update to the newest nginx
* change user-role checking, switch from group to realm-access roles


## v0.4.0 (2023-03-17)

### Security
* update to Angular 15 & Angular Material 15
* update to Node.js v18.13.0
* update to new Backend obfuscation API

### Feature
* add error handling and messages for too many requests

### Bugfix
* fixing various style issues

The full changelog can be found [here](https://github.com/medizininformatik-initiative/feasibility-gui/milestone/1?closed=1).


## v0.3.0 (2022-11-19)
Initial Version
