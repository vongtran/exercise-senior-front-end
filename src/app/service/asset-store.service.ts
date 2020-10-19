import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssetStoreService {
  FAVORITE_IDS = 'FAVORITE_IDS';

  constructor() {}

  getFavIs() {
    return JSON.parse(localStorage.getItem(this.FAVORITE_IDS));
  }

  addToFavorites(id: number) {
    let favIds = this.getFavIs();
    if (!favIds) favIds = [];
    favIds.push(id);
    localStorage.setItem(this.FAVORITE_IDS, JSON.stringify(favIds));
  }

  removeFromFavorites(removedId: number) {
    let favIds = this.getFavIs();
    localStorage.setItem(
      this.FAVORITE_IDS,
      JSON.stringify(favIds.filter((id) => id != removedId)),
    );
  }
}
