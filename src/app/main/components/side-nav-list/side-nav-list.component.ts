import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-side-nav-list',
  templateUrl: './side-nav-list.component.html',
  styleUrls: ['./side-nav-list.component.scss']
})
export class SideNavListComponent implements OnInit {

  constructor() { }
  @Output() sideNavClose = new EventEmitter();

  ngOnInit(): void {
  }

  onSideNavClose = () => {
    this.sideNavClose.emit();
  }
}



