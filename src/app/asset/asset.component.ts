import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, from } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { AssetService } from '../service/asset.service';
import { Asset } from '../domain/model/asset-model';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export const compareAsset = (
  a: Asset,
  b: Asset,
  column: string,
  direction: SortDirection,
) => {
  const sorted = direction === 'asc' ? 1 : -1;
  var o1 = a.isFavorite;
  var o2 = b.isFavorite;
  var p1 = a[column];
  var p2 = b[column];
  if (o1 < o2) return 1;
  if (o1 > o2) return -1;
  if (p1 < p2) return -1 * sorted;
  if (p1 > p2) return 1 * sorted;
  return 0;
};

export interface SortEvent {
  column: string;
  direction: SortDirection;
}
@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class SortableHeader {
  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

  title = 'exercise-senior-frontend';

  assets$: Observable<Asset[]>;
  currentSort: SortEvent = {
    column: '',
    direction: '',
  };
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader>;
  sortDirection$ = new BehaviorSubject<SortEvent>(this.currentSort);

  filter$ = new BehaviorSubject<Asset>(null);
  constructor(private service: AssetService) {}

  ngOnInit() {
    this.assets$ = combineLatest(
      this.service.getAssets$(),
      this.sortDirection$,
      this.filter$,
    ).pipe(
      map(([assets, sortDirection, filterAsset]) => {
        return assets
          .sort((a, b) => {
            return compareAsset(
              a,
              b,
              sortDirection.column,
              sortDirection.direction,
            );
          })
          .filter((asset) => this.isMatchConditons(asset, filterAsset, 'id'))
          .filter((asset) =>
            this.isMatchConditons(asset, filterAsset, 'assetName'),
          )
          .filter((asset) => this.isMatchConditons(asset, filterAsset, 'price'))
          .filter((asset) => this.isMatchDate(asset, filterAsset))
          .filter((asset) => this.isMatchConditons(asset, filterAsset, 'type'));
      }),
    );
  }

  isMatchConditons(asset: Asset, filterAsset: Asset, field: string) {
    let result: boolean;
    if (filterAsset === null || filterAsset[field] === '') {
      result = true;
    } else {
      if (asset[field])
        result =
          asset[field]
            .toString()
            .toLowerCase()
            .search(filterAsset[field].toString().toLowerCase()) > -1;
    }
    return result;
  }

  isMatchDate(asset: Asset, filterAsset: Asset) {
    if (filterAsset === null || !filterAsset.lastUpdate) {
      return true;
    } else {
      return (
        this.formatDate(asset.lastUpdate) === filterAsset.lastUpdate.toString()
      );
    }
  }

  trackById(asset: Asset) {
    return asset.id;
  }

  onSort(sortEvent: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== sortEvent.column) {
        header.direction = '';
      }
    });
    this.sortDirection$.next(sortEvent);
    this.currentSort = sortEvent;
  }

  filterChange(asset: Asset) {
    console.log(asset);
    this.filter$.next(asset);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  addToFavorite(id: number) {
    this.service.addToFavorites(id);
    this.onSort(this.currentSort);
  }

  removeFromFavorites(id: number) {
    this.service.removeFromFavorites(id);
    this.onSort(this.currentSort);
  }
}
