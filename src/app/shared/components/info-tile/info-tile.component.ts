import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'num-info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.scss'],
})
export class InfoTileComponent implements OnInit {
  @Input() value = '';
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {}
}
