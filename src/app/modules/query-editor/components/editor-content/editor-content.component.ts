import { Component, Input, OnInit } from '@angular/core';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';

@Component({
  selector: 'num-editor-content',
  templateUrl: './editor-content.component.html',
  styleUrls: ['./editor-content.component.scss'],
})
export class EditorContentComponent implements OnInit {
  @Input()
  criterion: Criterion;

  @Input()
  dataSelectionProfile: DataSelectionProfile;

  @Input()
  referenceCriterion: ReferenceCriterion;

  constructor() {}

  ngOnInit() {}
}
