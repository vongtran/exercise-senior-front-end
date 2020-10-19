import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFiltersComponent } from './asset-filters.component';

describe('AssetFiltersComponent', () => {
  let component: AssetFiltersComponent;
  let fixture: ComponentFixture<AssetFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
