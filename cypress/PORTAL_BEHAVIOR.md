# FDPG Dataportal: how it behaves

A plain-language description of the portal, written from the Gherkin scenarios in
`cypress/e2e/**/*.feature` and the notes in [GHERKIN_SCENARIOS.md](GHERKIN_SCENARIOS.md).
Each section ends with a **Covered by** line pointing at the feature file that proves it.
Anything marked *(not tested)* is described in the notes but has no scenario yet.

Labels are quoted as the portal shows them. The UI is German by default and can be
switched to English; where both are known they are written as "Bulksuche" / "Bulk search".

---

## 1. Signing in and getting around

You sign in through the identity provider (Keycloak). After signing in you land on the
cohort definition page.

The **side navigation** on the left lists four areas:

| English label | German label (where known) | What it is |
|---|---|---|
| Data Definition | | The cohort definition (your saved working cohort) |
| Cohort Selection | Kohortenselektion | Search for criteria and build a cohort |
| Feature Selection | Merkmalselektion | Search for data selection features |
| Saved data definitions | Gespeicherte Datendefinitionen | Your saved queries |

The side navigation can be **collapsed** to icons only. When collapsed, the labels are gone
(they move into tooltips). Expanding it again brings the labels back.

In the header, a **user menu** offers three entries:

- **About the Portal** opens an about dialog.
- **Log** shows the error log. It is **disabled while there are no errors** to show.
- **Log Out** ends the session and takes you to the sign-in page.

The **language dropdown** offers German and English. Switching translates the side
navigation immediately, and the choice **stays while you move around inside the app**.
A full page reload (a fresh visit) does not keep it.

**Signing in again and reloading.**

- A failed sign-in stays on the Keycloak form with "Invalid username or password." under the
  username field. The username is kept and the password is cleared.
- Reloading a page such as the criteria search keeps you signed in. Reloading the Feasibility
  Editor with a cohort in it also loads the editor again, but the cohort you had in memory is
  gone. (An earlier crash on this reload was fixed; it is confirmed on the dev build only.)

*Covered by:* `login/login.feature`, `Navigation/side-navigation.feature`,
`UserMenu/user-menu.feature`, `Language/language-switch.feature`

---

## 2. Defining a cohort (Feasibility)

### Starting point: the empty cohort definition

If you have no cohort yet, the cohort definition page shows an **empty message**. The
buttons "Feasibility Query" and "Save cohort" are **disabled** because there is nothing to
run or save. "New Cohort" takes you to the criteria search.

### Searching for criteria

The criteria search ("Feasibility Search") shows a table of **20 rows** to begin with. Two
buttons are **disabled** until you select something: "Add to cohort selection" and
"Show cohort selection".

- Typing in the search field narrows the table to rows containing your text.
  Clearing the field brings back the 20 rows.
- Ticking a row's checkbox and clicking "Add to cohort selection" adds it. That button then
  **disables itself** again and "Show cohort selection" becomes enabled.
- "Show cohort selection" opens the **Feasibility Editor**.

Search matches text anywhere in a name or code, across all terminologies. A search for a
short name such as "Age" is outranked by unrelated hits that merely contain "age", so the
exact row may not be on the first page. Searching by code (for example `30525-0`) is
the reliable way to reach one criterium.

### Search filters and reset

The criteria search has three dropdowns: **"KDS-Modul"**, **"Kontext"** and **"Terminologie"**.
Options read "Name (count)". The modules are Diagnose, Onkologie, Prozedur, Labor, Medikation,
Bioprobe, Einwilligung and Fall.

- **"Filter zurücksetzen"** starts **disabled**.
- Choosing a filter (for example Terminologie "ICD-10-GM", or Kontext "Diagnose") **enables
  it**, and the loaded rows then all belong to that filter.
- Clicking it **clears the filters**, restores the default list and disables the button
  again. It does **not clear the search box**: text you typed stays there. This is intended.
- The table keeps showing **20 rows** with or without a filter, because that is the page
  size. Check what the rows contain, not how many there are.
- A code search with a terminology filter shows only that terminology, with the exact code
  first (for "E11" in ICD-10-GM: E11, then E11.3, E11.31 and so on). Without the filter you
  also get unrelated codes that end in the same text, such as `V03AE11`.
- After you choose a terminology, the select shows the system URL (for example
  `http://fhir.de/CodeSystem/bfarm/icd-10-gm`), not the display name. This is intended and
  also happens on the single search page.

*(Not tested)*: combining "KDS-Modul" with "Terminologie". After a module filter, the
ICD-10-GM option could not be found, so the options may depend on the other filters.

### Bulk search

Reached from the "Bulksuche" tab or the "Zur Bulksuche" button in the criteria editor
(route `/feasibility-query/bulk-search`). Instead of searching for one criterium at a time,
you paste many codes at once.

The page has a multi-line code box, a "Kontext" dropdown, a "Terminologie" dropdown and a
"Suchen" button.

- "Suchen" stays **disabled until all three are set**: the codes, the context (for example
  "Diagnose") and the terminology (for example "ICD-10-GM"). Setting only some of them is
  not enough.
- Codes can be separated by **commas, spaces or line breaks**. All three give the same
  result.
- A code that does not exist is **not dropped silently**: it lands in a separate
  "Not found" tab, and the found codes are listed with their count.

- The **terminology dropdown has its own search field**. Typing "ICD" leaves only
  "ICD-10-GM (34354)", and text that matches nothing leaves no options. After you pick it, the
  select shows the system URL (see "Search filters and reset"); this is intended.
- The found codes are listed in the "Gefunden" tab, for example "Gefunden (3)" and
  "Nicht gefunden (0)" for `E10, E11, E66`. Their rows are **checked by default**, and the table
  has no select-all checkbox.
- **"Gruppenkriterium hinzufügen"** is enabled without selecting anything by hand. Clicking it
  **stays on the bulk page** and shows no message. In the editor's Stage list there is then
  **one** criterium, not one per code. It is **named after the first code** (E10 gives "Diabetes
  mellitus, Typ 1"), has the subtitle "Diagnose, E10, ICD-10-GM", and a filter block
  "Terminologie-Codes" that lists all codes. The codes are combined as "or". This is
  intended.

### The Feasibility Editor: stage, inclusion and exclusion

A criterium you add appears first in the **Stage** list. It is *not* in any group yet.
To use it in the query you **drag** it into the **Inclusion** or the **Exclusion** list.
There is no "move" menu entry; dragging is the only way.

- A criterium in **Exclusion** is not in **Inclusion**, and the other way round.
- Once at least one criterium is in **Inclusion**, the **"Feasibility" button becomes
  enabled**. Clicking it opens the **Feasibility Result** page.
- The action bar has icon buttons for **upload**, **download** and **save**. With a criterium
  only in Stage, upload is enabled, while download, save and Feasibility are disabled. Moving
  it into Inclusion enables all three. Moving it into **Exclusion only** disables them again:
  a cohort needs at least one Inclusion criterium. This is intended.
- From the result, "Edit cohort selection" returns you to the editor.

Each criterium has an **options menu** with exactly three entries:

| Entry | Effect |
|---|---|
| Configure | Opens the criterium editor |
| Duplicate | Creates a second copy with the same name (you then have 2) |
| Delete | Removes the criterium from the editor |

### The result and saving

Clicking "Feasibility" shows a **spinner** while the query runs, then the **result**.

**When the submit fails, nothing tells you.** If the backend answers the submit with an error
(simulated: 429 with `FEAS-10002`, 500, 400, or a network failure), the portal still opens the
result page. It stays on "Machbarkeitsabfrage wird bearbeitet" with all digits at 0 and
"Details (0/3)". No dialog, snackbar or timeout appears; the only trace is a message in the
browser console. The portal has texts for these errors (for example "too many queries, please
wait"), but they are only shown when the *result* comes back with an error. This is listed as a
bug in `bug-reports/bugs.md`; it is described here as it behaves today.

"Save cohort" opens a dialog asking for a **title** and a **comment**. Saving closes the
dialog. The saved cohort can later be found under "Saved data definitions".

*Covered by:* `DataQueryCohort/cohort-definition-empty.feature`,
`CohortSearch/cohort-search.feature`, `BulkSearch/bulk-search.feature`,
`CohortEdit/cohort-edit.feature`, `CohortEdit/cohort-exclusion.feature`,
`CohortEdit/criterium-actions.feature`, `CohorttResult/cohort-result.feature`

---

## 3. Configuring a criterium (filters)

"Configure" opens the criterium editor (page "Query Editor - Criteria"). What you can set
depends on the criterium. The editor shows one tab per filter that the criterium supports.

### A criterium without filters

Some criteria have no filters at all (the example is "BIOMAT erheben", a consent item).
It can be added and dragged into Inclusion without configuring anything, shows **no filter
chips**, and its editor has **no filter tabs**.

### Time restriction

Where a criterium allows it, you can restrict it **before**, **on** or **after** a date
(for example 04.04.2045). After closing the editor the criterium shows a **filter chip**
with that date, and it can go straight into Inclusion and be run.

### Comparison filters (for example age)

A filter panel starts as "No filter". Choosing a comparison such as "greater", a value and
a unit updates the panel summary and shows a **chip** on the criterium, for example
"> 5 a" for age greater than 5 years.

### Which filter types exist

Across all profiles, value filters are of type **concept** (2) or **quantity** (1). There is
no number-type value filter. The only quantity filter is "Current chronological age" (SNOMED
424144002) with the units `a` and `mo`, one decimal place and no minimum or maximum. Attribute
filters are **concept** (21) or **reference** (31); there are no quantity or number attribute
filters.

### Concept filters: attribute filters and value filters

A concept filter lets you pick codes from a value set. There are two kinds:

- **Attribute filters**, for example the ICD-10 code on "Cause of death".
- **Value filters**, for example "female" / "male" / "other" on "Gender".

How a concept filter behaves:

- **Search and select.** Use "Single Search", type a term (for example "pneumoniae"), and
  tick a result such as J13. It appears in the selection together with its code system.
  You can select several, and unticking removes one.
- **The search table shows your selection.** Selected concepts are **ticked** in the
  results, others are not. A new search keeps the ticks for concepts you already selected,
  and reopening the editor pre-ticks them.
- **The "Selected Concepts" tab.** It is **disabled while nothing is selected**, and its
  label **shows the number selected**. Removing a concept there removes it from the
  selection, unticks it in the search results, and leaves the others untouched. You can
  remove them one after another, or all of them (the list is then empty).
- **Persistence.** Selections and removals **survive closing and reopening** the editor.
- **Chips.** After closing the editor, the selected concepts show as **chips** on the
  criterium. A chip shows the concept's **display text**, not its code. If the ontology
  only has a German text, the chip is German even in the English UI.
- **The results table** scrolls inside the editor instead of overflowing it.

### Criteria with several concept filters

Some criteria have **several concept attributes**. The "Fall" encounter criteria, for
example, have four: Type of encounter, Level of encounter, Department key and Extended
department key. Each is **its own tab with its own selection**:

- Selecting in one does not change another, and removing a concept in one leaves the
  others untouched.
- All four selections survive closing and reopening.
- Two criteria of the same profile (for example inpatient "IMP" and ambulatory "AMB")
  **keep separate selections**.

### The same code in two code systems *(not tested yet)*

A concept is identified by **code and system together**. The code J13 exists in both ICD-10
(WHO) and ICD-10-GM; selecting one must not select the other, and removing one must keep
the other. This is written as scenarios but marked pending: no criterium has been found
yet that offers both systems in one table.

*Covered by:* `CohortEdit/cohort-edit.feature`, `Criterion/NoFilter/*`,
`Criterion/AttributeFilter/Concept/*`, `Criterion/ValueFilter/Concept/*`

---

## 4. Data definition and feature selection

### From cohort to features

With a criterium in Inclusion, the **Data Definition** page shows it in the cohort
definition editor. Clicking **"To Feature Selection"** moves you on to the **Data
Selection** step.

A cohort can also be **uploaded** as a file (for example a CRTDL file) and downloaded again.
A file that cannot be used is rejected:

- **Not JSON:** an error dialog shows the raw parser text (for example "Unexpected token 'h',
  "this is not json {" is not valid JSON").
- **JSON with the wrong structure:** the backend answers with a 400, and after a delay a
  "Protokoll" dialog lists the problems (code `VALIDATION-10000`, for example "required
  property 'version' not found"). It has the buttons "Protokoll herunterladen" and
  "Schließen". The cohort stays invalid.

### Searching for features

The data selection search ("Data Selection Search", route `/data-selection/search`) works
like the criteria search, with a search field and a table.

- "Add to Selection" is **disabled while nothing is selected**.
- The header checkbox ("Alles auswählen" / select all) **ticks every loaded row** and
  enables "Add to Selection". Toggling it again **clears the selection** and disables the
  button again. The row ticks update a moment after the header checkbox.
- Ticking a feature (for example "Medication administration") enables both "Add to
  Selection" and "Show Selection". Adding it disables the add button; "Show Selection"
  opens the **Data Selection Editor**, where the feature appears as a **box** labelled with
  its name.

### Editing a feature

The box has an edit button with a "Configure" entry. The editor lets you:

- tick **fields** (for example "Note"), which then appear in the selected fields list;
- use a **Code Filter**: search a concept by its code (for example the ATC code `A10BA02`)
  and select it, and a chip with its display text ("Metformin") appears under
  "Selected Filters";
- open the **References** tab and its **"Part of"** sub-tab, which shows a placeholder until
  you add a reference. Adding one opens a **reference modal**, where you name the reference
  (for example "Procedure") and add it.

There is no "Save" button any more: edits **apply live**.

*(Not tested)*: a **time restriction** set in the profile editor does not appear in the
"Applied filters" header chips. Whether that is intended or a bug needs a product decision.

*Covered by:* `DataQueryCohort/data-query-cohort.feature`,
`DataSelectionSearch/data-selection-search.feature`,
`DataSelectionSearch/data-selection-select-all.feature`

---

## 5. Saved queries

After saving a cohort (title and comment), open **"Saved data definitions"** in the side
navigation.

- The saved query **appears in the list under its title**.
- **Loading** it puts its criteria back into the cohort definition editor.
- **Deleting** it removes it from the list.

*Covered by:* `SavedQueries/saved-queries.feature`

---

## Not described yet

These are still open, so this document does not state them as fact:

- **A real feasibility error from the backend.** The silent failure above is observed with a
  simulated response only. Whether the backend really answers a submit with 429, and whether the
  error texts for `FEAS-10001` to `FEAS-10006` ever show, is not confirmed. The result path
  (a result that arrives with `issues`) is inferred from the code, not run.
- **The 31 reference-type attribute filters.** Nothing covers them and nobody has explored
  them yet.
- **Combining "KDS-Modul" with "Terminologie"** in the search filters.
- **Whether the "Log" menu entry becomes enabled** after an upload error (inferred).
- **Reload on a production build.** The editor reload was confirmed on the dev build only.

Observed but not yet turned into scenarios: search filters and reset, the action bar enabled
states, the failed login, the upload errors, and the bulk search group criterium.
