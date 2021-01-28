import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminService} from './services/admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  newWeekForm = this.fb.group({
    deadLine: ['', Validators.required]
  });


  ngOnInit(): void {
    // this.adminService.getGamesToUpdate('nrl').subscribe(x => console.log(x));
  }

  onSubmit = () => {

  }
}
