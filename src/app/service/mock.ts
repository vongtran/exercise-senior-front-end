import { Asset } from '../domain/model/asset-model'

const createAsset = (assetId, assetType): Asset => {
  return {
    id: assetId,
    assetName:
      assetType === 'Stock'
        ? ['AAPL', 'GOOGL', 'FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)]
        : ['EUR', 'USD', 'GBP', 'NIS', 'AUD'][Math.floor(Math.random() * 4)],
    price: Math.random() * 10,
    lastUpdate: new Date(),
    type: assetType,
  };
};

const getAllAssets = (n): Asset[] => {
  const result: Asset[] = [];
  for (let i = 0; i < n; i++) {
    result.push(createAsset(i, 'Stock'));
    result.push(createAsset(i + n, 'Currency'));
  }
  return result;
};

export const mockAssets = getAllAssets(200).map((asset) => {
  const random = Math.random();
  return {
    ...asset,
    price: random >= 0.5 ? asset.price + random : asset.price - random,
    lastUpdate: new Date(),
  };
});
