import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService) {
  }

  @Output() sidenavtoggle = new EventEmitter();

  ngOnInit(): void {
  }

  onToggleSidenav(): void {
    this.sidenavtoggle.emit();
  }
}
