import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/service/auth.service';

@Component({
  selector: 'app-side-nav-list',
  templateUrl: './side-nav-list.component.html',
  styleUrls: ['./side-nav-list.component.scss']
})
export class SideNavListComponent implements OnInit {

  constructor(public authService: AuthService) { }
  @Output() sideNavClose = new EventEmitter();

  ngOnInit(): void {
  }

  onSideNavClose = () => {
    this.sideNavClose.emit();
  }

  logout = () => {
    this.authService.logout();
    this.onSideNavClose();
  }
}



