import {Product} from '@prisma/client';
import {NormalizeArray} from './NormalizeArray';

export function addWeightToProductststs(products: Product[], predictedPrice: number) {
  let predictedProducts = [...products];
  let Weights: {
    priceWeight: Array<number>;
    ratingWeight: Array<number>;
    ratingCountWeight: Array<number>;
    quantityWeight: Array<number>;
  } = {
    priceWeight: [],
    ratingWeight: [],
    ratingCountWeight: [],
    quantityWeight: [],
  };
  predictedProducts.map((product) => {
    Weights.priceWeight.push(
      product.price > predictedPrice ? predictedPrice / product.price : product.price / predictedPrice
    );
    Weights.ratingWeight.push(product.rating * Math.min(0.5 * Math.sqrt(product.ratingCount / 20), 1));
    Weights.ratingCountWeight.push(product.ratingCount);
    Weights.quantityWeight.push(product.quantity);
  });
  Weights.priceWeight = NormalizeArray(Weights.priceWeight);
  Weights.ratingWeight = NormalizeArray(Weights.ratingWeight);
  Weights.ratingCountWeight = NormalizeArray(Weights.ratingCountWeight);
  Weights.quantityWeight = NormalizeArray(Weights.quantityWeight);
  const totalWeight = Weights.priceWeight.map((w, i) => {
    return (
      Weights.priceWeight[i] * 0.8 +
      Weights.ratingWeight[i] * 0.1 +
      Weights.ratingCountWeight[i] * 0.05 +
      Weights.quantityWeight[i] * 0.05
    );
  });
  predictedProducts.map((product, i) => {
    product.weight = totalWeight[i];
    product.priceWeight = Weights.priceWeight[i];
    product.ratingWeight = Weights.ratingWeight[i];
    product.ratingCountWeight = Weights.ratingCountWeight[i];
    product.quantityWeight = Weights.quantityWeight[i];
  });
  predictedProducts.sort((a, b) => b.weight - a.weight);
  return predictedProducts;
}
