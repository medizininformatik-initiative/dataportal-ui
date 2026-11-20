# Errors and Messages

This page lists the messages the UI shows when something goes wrong, and what you can do.

## Search

| Situation                         | What the UI does                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------- |
| No match for the search term      | Shows *Sorry, we could not find any results for "…"*. Nothing can be added.       |
| Backend answers slowly            | Waits and shows the results when they arrive, without an error                   |
| Backend answers with an error     | Opens an error dialog. Close it with its button.                                  |
| Backend cannot be reached         | Opens an error dialog with *0 Unknown Error*                                      |

The error dialog has a readable title and names:

- the HTTP status, for example `Code: 500`
- the message of the backend, for example *Elasticsearch unavailable*
- the failed request, for example `terminology/entry/search?searchterm=pneumonia`

Every error is also listed in the **Log** in the user menu.

## Upload

See [Invalid files](./data-definition#invalid-files). An invalid file never replaces the current cohort.

## Feasibility result

| Message                                              | Cause                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| *The result could not be determined in time*         | Polling ended without a result. **Details** is disabled.               |
| *The result could not be loaded*                     | The backend accepted the query but returned no result link            |
| *You have made too many queries*                     | The poll answer contains the issue `FEAS-10002`                        |
| *Please wait N seconds*                              | Sending the query or loading details is rate limited. After a rejected send, the send button counts down and is enabled again. |
| *Your account has been locked* + *Please wait N seconds* | Account locked (`FEAS-10001`). The send button counts down.       |
| *Patient number too low for detailed results*        | Result below the privacy threshold (`FEAS-10004`). **Details** is disabled. |
| *The number of responding locations is too small*    | Too few sites answered the detail request (`FEAS-10005`)              |
| (none, details disabled)                             | The result has expired                                                |

A single failed poll does not stop polling. Polls never overlap: the next poll starts only after the previous one answered.

When a detail request fails with `FEAS-10004` or `FEAS-10005`, the UI shows the message instead of the details dialog and no error dialog. A failed detail request is not repeated on further clicks.

## Session

When your session ends, or the backend rejects your token, the UI sends you to the sign-in page.
