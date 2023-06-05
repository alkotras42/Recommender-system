import {Product} from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import {hslToHex} from '~/helpers/HSVtoHEX';
import {IComponents} from '~/pages';
import {api} from '~/utils/api';
import {Tooltip} from 'react-tooltip';
import {renderToStaticMarkup} from 'react-dom/server';

interface RecomendedProduct {
  product: Product;
  categoryName: string;
  selectedComponents: IComponents;
  setSelectedComponents: React.Dispatch<React.SetStateAction<IComponents>>;
}

const RecomendedProduct = ({product, categoryName, selectedComponents, setSelectedComponents}: RecomendedProduct) => {
  const {data: category} = api.category.findCategoryByName.useQuery({name: categoryName});

  const color = hslToHex(product.weight * 127, 69, 55);

  console.log(product);

  const RecomendationInfo = () => {
    return (
      <div className='grid gap-2'>
        {/* <div>{product.priceWeight > 0.7 && 'Выгодная цена'}</div> */}
        {/* <div>{product.ratingWeight > 0.7 && 'Высокий рейтинг'}</div> */}
        {/* <div>Выгодная цена</div> */}
        {/* <div>Высокий рейтинг</div> */}

        {product.ratingWeight > 0.7 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/approve-icon.svg' alt='' />
            <p>Высокий рейтинг</p>
          </div>
        )}
        {product.priceWeight > 0.7 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/approve-icon.svg' alt='' />
            <p>Подходящая ценовая категория</p>
          </div>
        )}
        {product.ratingCountWeight > 0.7 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/approve-icon.svg' alt='' />
            <p>Большое количество отзывов</p>
          </div>
        )}
        {product.ratingWeight < 0.3 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/error-icon.svg' alt='' />
            <p>Низкий рейтинг</p>
          </div>
        )}
        {product.priceWeight < 0.5 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/error-icon.svg' alt='' />
            <p>Не подходящая ценовая категория</p>
          </div>
        )}
        {product.ratingCountWeight < 0.3 && (
          <div className='flex gap-1'>
            <Image width={15} height={15} src='/error-icon.svg' alt='' />
            <p>Низкое количество отзывов</p>
          </div>
        )}
      </div>
    );
  };

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
    <div
      onClick={handleAddProduct}
      style={{borderColor: color}}
      className='border-4 p-4 flex-1 cursor-pointer hover:bg-slate-800'>
      <div className='relative h-16 w-full'>
        <Image className='object-contain' fill={true} src={product.ImageURL || ''} alt='' />
      </div>
      <div>
        <div>{product.shortName}</div>
        <p className='text-2xl'>{product.price} ₽</p>
        <div
          data-tooltip-id='my-tooltip'
          data-tooltip-html={renderToStaticMarkup(<RecomendationInfo />)}
          // data-tooltip-place='top'
          className='relative w-6 h-6'>
          <Image src='/info-icon.svg' fill={true} alt='' />
          <Tooltip id='my-tooltip'>{/* <RecomendationInfo /> */}</Tooltip>
        </div>
        {/* @ts-ignore */}
        <div>{product.weight}</div>
      </div>
    </div>
  );
};

export default RecomendedProduct;
