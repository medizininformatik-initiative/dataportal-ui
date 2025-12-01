import { trigger, transition, style, query, animate, group } from '@angular/animations';

/**
 * Route animations for page transitions.
 * Provides smooth slide animations between routes without flickering or scrollbars.
 */
export const routeAnimations = trigger('routeAnimations', [
  transition(
    'Feasibility_Search => Feasibility_Editor, Data_Selection_Search => Data_Selection_Editor, Cohort => DataSelection',
    [
      style({ position: 'relative', overflow: 'hidden' }),
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
          }),
        ],
        { optional: true }
      ),

      group([
        query(
          ':leave',
          [animate('600ms ease-in-out', style({ transform: 'translateY(-100%)', opacity: 0 }))],
          {
            optional: true,
          }
        ),

        query(
          ':enter',
          [
            style({ transform: 'translateY(100%)', opacity: 0 }),
            animate('600ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
    ]
  ),

  transition(
    'Feasibility_Editor => Feasibility_Search, Data_Selection_Editor => Data_Selection_Search, DataSelection => Cohort',
    [
      style({ position: 'relative', overflow: 'hidden' }),
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
          }),
        ],
        { optional: true }
      ),

      group([
        query(
          ':leave',
          [animate('600ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))],
          {
            optional: true,
          }
        ),

        query(
          ':enter',
          [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('600ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
    ]
  ),

  transition('Feasibility_Bulk_Search => Feasibility_Search', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    group([
      query(
        ':leave',
        [animate('600ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))],
        {
          optional: true,
        }
      ),

      query(
        ':enter',
        [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          animate('600ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 })),
        ],
        { optional: true }
      ),
    ]),
  ]),

  transition('Feasibility_Search => Feasibility_Bulk_Search', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    group([
      query(
        ':leave',
        [animate('600ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))],
        {
          optional: true,
        }
      ),

      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('600ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 })),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
