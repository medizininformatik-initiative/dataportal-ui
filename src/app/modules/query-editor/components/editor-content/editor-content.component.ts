import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data } from '@angular/router';
import { DataSelection } from 'src/app/model/DataSelection/DataSelection';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';

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

  constructor() {}

  ngOnInit() {}
}
