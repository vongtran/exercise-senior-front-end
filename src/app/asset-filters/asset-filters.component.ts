import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Asset } from '../domain/model/asset-model';

@Component({
  selector: 'app-asset-filters',
  templateUrl: './asset-filters.component.html',
  styleUrls: ['./asset-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetFiltersComponent implements OnInit, AfterViewInit, OnDestroy {
  filterForm: FormGroup;
  unsubscribe$: Subject<void> = new Subject();
  @Output() filterChanges = new EventEmitter<Asset>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      id: [''],
      assetName: [''],
      price: [''],
      lastUpdate: [''],
      type: [''],
    });
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.unsubscribe$))
      .subscribe((values) => this.filterChanges.emit(values));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
