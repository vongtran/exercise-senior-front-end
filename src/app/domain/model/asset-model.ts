export interface Asset {
    id: number;
    assetName: string; // "USD", Samsung Electronics Co Ltd : "SSNLF"
    price: number; // asset current price relative to USD
    lastUpdate: Date; // unix timestamp
    type: 'Currency' | 'Stock'; // asset type Currency (e.g. USD, EUR...) or Stock (Samsung, Google)
    isFavorite?: boolean;
}
  