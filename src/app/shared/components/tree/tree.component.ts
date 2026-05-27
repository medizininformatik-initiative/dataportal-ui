import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TreeNode } from '../../models/TreeNode/TreeNodeInterface'
import { NgTemplateOutlet } from '@angular/common'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CheckboxComponent,
    FontAwesomeModule,
    MatTooltip,
    DisplayTranslationPipe,
  ],
})
export class TreeComponent implements OnInit {
  @Input()
  treeData: TreeNode

  @Output()
  selectedCheckbox: EventEmitter<TreeNode> = new EventEmitter()

  expandedNodes: Set<any> = new Set()

  showFullDescription = false

  constructor() {}

  ngOnInit() {}

  public toggleExpand(node: any) {
    if (this.expandedNodes.has(node)) {
      this.expandedNodes.delete(node)
    } else {
      this.expandedNodes.add(node)
    }
  }

  public isExpanded(node: any): boolean {
    return this.expandedNodes.has(node)
  }

  public calcMarginLeft(level: number): string {
    return `calc(${level} * -20px)`
  }

  public calcMarginLeftCheckbox(level: number): string {
    if (level === 0) {
      return '-10px'
    } else {
      if (level > 1) {
        return `calc(${level} * 35px)`
      } else {
        return `calc(${level} * 38px)`
      }
    }
  }
  public calcMarginLeftTreeNode(level: number, isCheckbox: boolean): string {
    if (isCheckbox) {
      return '10px'
    } else {
      return `calc(${level} * 29px)`
    }
  }
  public checkboxSelected(node: TreeNode): void {
    if (node.data.selectable && node.data.isDisabled) {
      node.data.isCheckboxSelected = !node.data.isCheckboxSelected
      this.selectedCheckbox.emit(node)
    }
  }

  public toggleDescription() {
    this.showFullDescription = !this.showFullDescription // toggles the state
  }
}
