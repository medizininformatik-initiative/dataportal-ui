import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'num-display-data-selection',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayDataSelectionComponent implements OnInit {
  @Input()
  isEditable: boolean;

  constructor() {}

  ngOnInit(): void {}
}
