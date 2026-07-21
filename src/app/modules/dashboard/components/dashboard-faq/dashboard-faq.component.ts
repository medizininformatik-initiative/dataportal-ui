import { Component } from '@angular/core'
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion'
import { TranslateModule } from '@ngx-translate/core'

export interface FaqItem {
  questionKey: string
  answerKey: string
}

@Component({
  selector: 'num-dashboard-faq',
  templateUrl: './dashboard-faq.component.html',
  styleUrls: ['./dashboard-faq.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
})
export class DashboardFaqComponent {
  faqItems: FaqItem[] = [
    {
      questionKey: 'FAQ.COHORT_DEFINITION.QUESTION',
      answerKey: 'FAQ.COHORT_DEFINITION.ANSWER',
    },
    {
      questionKey: 'FAQ.DATA_SELECTION.QUESTION',
      answerKey: 'FAQ.DATA_SELECTION.ANSWER',
    },
    {
      questionKey: 'FAQ.APPLIED_FILTER.QUESTION',
      answerKey: 'FAQ.APPLIED_FILTER.ANSWER',
    },
    {
      questionKey: 'FAQ.APPLIED_REFERENCES.QUESTION',
      answerKey: 'FAQ.APPLIED_REFERENCES.ANSWER',
    },
    {
      questionKey: 'FAQ.ONLY_IF_REFERENCED.QUESTION',
      answerKey: 'FAQ.ONLY_IF_REFERENCED.ANSWER',
    },
    {
      questionKey: 'FAQ.SELECTED_FIELDS.QUESTION',
      answerKey: 'FAQ.SELECTED_FIELDS.ANSWER',
    },
  ]
}
