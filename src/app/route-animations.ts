import {
  AnimationMetadata,
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations'

/**
 * Constrains the host element so that absolutely-positioned entering/leaving
 * views are clipped and don't cause scrollbars during the transition.
 */
const CONTAINER_SETUP = style({ position: 'relative', overflow: 'hidden' })

/**
 * Stacks every entering and leaving view flush inside the container so they
 * can slide over each other without affecting document layout.
 */
const ABSOLUTE_FILL = query(
  ':enter, :leave',
  [style({ position: 'absolute', height: '100%', top: 0, left: 0, right: 0, width: '100%' })],
  { optional: true }
)

/**
 * Any navigation that opens an editor from a search or list view.
 * */
const TO_EDITOR = [
  'Feasibility_Search => Feasibility_Editor',
  'Data_Selection_Search => Data_Selection_Editor',
  'Cohort => DataSelection',
  'Feasibility_Bulk_Search => Feasibility_Editor',
].join(', ')

/**
 * Any navigation that returns from an editor back to a search or list view.
 * */
const FROM_EDITOR = [
  'Feasibility_Editor => Feasibility_Search',
  'Data_Selection_Editor => Data_Selection_Search',
  'DataSelection => Cohort',
  'Feasibility_Editor => Feasibility_Bulk_Search',
].join(', ')

/** Switching from the single-search panel to the bulk-search panel. */
const TO_BULK_SEARCH = 'Feasibility_Search => Feasibility_Bulk_Search'

/** Switching back from the bulk-search panel to the single-search panel. */
const FROM_BULK_SEARCH = 'Feasibility_Bulk_Search => Feasibility_Search'

/** Default animation duration and easing for all route transitions. */
const DEFAULT_DURATION = '600ms ease-in-out'

/**
 * Builds the step list for a slide-and-fade transition.
 *
 * @param {string} leaveTransform
 * @param {string} enterStartTransform
 * @param {string} duration
 */
function slideAnimation(
  leaveTransform: string,
  enterStartTransform: string,
  duration = DEFAULT_DURATION
): AnimationMetadata[] {
  return [
    CONTAINER_SETUP,
    ABSOLUTE_FILL,
    group([
      query(':leave', [animate(duration, style({ transform: leaveTransform, opacity: 0 }))], {
        optional: true,
      }),
      query(
        ':enter',
        [
          style({ transform: enterStartTransform, opacity: 0 }),
          animate(duration, style({ transform: 'translate(0, 0)', opacity: 1 })),
        ],
        { optional: true }
      ),
    ]),
  ]
}

/**
 * Root animation trigger applied to the router outlet host.
 *
 * Transitions:
 * - Search/list → editor: leaving page slides up, editor rises from below.
 * - Editor → search/list: editor drops down, previous page descends from above.
 * - Single-search → bulk-search: page slides left, bulk-search arrives from the right.
 * - Bulk-search → single-search: page slides right, single-search arrives from the left.
 */
export const routeAnimations = trigger('routeAnimations', [
  transition(TO_EDITOR, slideAnimation('translateY(-100%)', 'translateY(100%)')),
  transition(FROM_EDITOR, slideAnimation('translateY(100%)', 'translateY(-100%)')),
  transition(TO_BULK_SEARCH, slideAnimation('translateX(-100%)', 'translateX(100%)')),
  transition(FROM_BULK_SEARCH, slideAnimation('translateX(100%)', 'translateX(-100%)')),
])
