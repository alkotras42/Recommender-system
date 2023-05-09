import {Product} from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import {hslToHex} from '~/helpers/HSVtoHEX';
import {IComponents} from '~/pages';
import {api} from '~/utils/api';

interface RecomendedProduct {
  product: Product;
  categoryName: string;
  selectedComponents: IComponents;
  setSelectedComponents: React.Dispatch<React.SetStateAction<IComponents>>;
}

const RecomendedProduct = ({product, categoryName, selectedComponents, setSelectedComponents}: RecomendedProduct) => {
  const {data: category} = api.category.findCategoryByName.useQuery({name: categoryName});

  const color = hslToHex(product.weight * 127, 69, 55);

  const handleAddProduct = (): void => {
    setSelectedComponents(() => {
      if (category?.slug) {
        return {
          ...selectedComponents,
          [category.slug]: product,
        };
      }
      return selectedComponents;
    });

    console.log(selectedComponents);
  };

  return (
    <div onClick={handleAddProduct} style={{borderColor: color}} className='border-4 p-4 flex-1 cursor-pointer hover:bg-slate-800'>
      <div className='relative h-16 w-full'>
        <Image className='object-contain' fill={true} src={product.ImageURL || ''} alt='' />
      </div>
      <div>
        <div>{product.shortName}</div>
        <p className='text-2xl'>{product.price} ₽</p>
        {/* @ts-ignore */}
        <div>{product.weight}</div>
      </div>
    </div>
  );
};

export default RecomendedProduct;
