import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Asset } from '../domain/model/asset-model';
import { mockAssets } from './mock';
import { AssetStoreService } from './asset-store.service';
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  assets: Asset[];
  favoritesIds = [];

  constructor(private assetStoreService: AssetStoreService) {
    this.favoritesIds = assetStoreService.getFavIs();
    this.assets = mockAssets.map((asset) => {
      return {
        ...asset,
        isFavorite:
          !this.favoritesIds || !this.favoritesIds.includes(asset.id)
            ? false
            : true,
      };
    });
  }

  getAssets$() {
    return of(this.assets);
  }

  addToFavorites(id: number) {
    this.assetStoreService.addToFavorites(id);
    this.assets.forEach((asset) => {
      if (asset.id === id) {
        asset.isFavorite = true;
      }
    });
  }

  removeFromFavorites(removedId: number) {
    this.assetStoreService.removeFromFavorites(removedId);
    this.assets.forEach((asset) => {
      if (asset.id === removedId) {
        asset.isFavorite = false;
      }
    });
  }
}
