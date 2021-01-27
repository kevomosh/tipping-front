import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ParamService} from '../../services/param.service';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {GroupDTO} from '../../../dto/groupDTO';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor(private paramService: ParamService) { }
  @Input() groups: GroupDTO[];
   groupIds: number[] = [];

   @ViewChild('select') select: NgSelectComponent;

  nameFormControl = new FormControl('', [Validators.minLength(2)]);

  nameFilter$ = this.nameFormControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(name => this.paramService.setName(name))
  );

  ngOnInit(): void {
    this.paramService.setGroupIdFilter([]);

  }
  onAdd($event: any): void {
    this.groupIds.push($event.id);
    this.paramService.setGroupIdFilter(this.groupIds);
  }

  onRemove($event: any): void {
    this.groupIds = this.groupIds.filter(g => g !== $event.value.id);
    this.paramService.setGroupIdFilter(this.groupIds);
  }

  onClear(): void {
    this.groupIds = [];
    this.paramService.setGroupIdFilter(this.groupIds);
  }

  clearSelect(): void {
    this.select.handleClearClick();
    this.onClear();
    // this.onClear();
  }

}
