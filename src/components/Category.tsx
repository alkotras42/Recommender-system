import {Product} from '@prisma/client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {IComponents} from '~/pages';
import {api} from '~/utils/api';
import RecomendedProduct from './RecomendedProduct';
import {NormalizeArray} from '~/helpers/NormalizeArray';
import {addWeightToProductststs} from '~/helpers/addWeightToProducts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getCPUPriceByGPU} from '~/helpers/api/getPrices';

interface ICategory extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  categoryName: string;
  selectedComponents: IComponents;
  setSelectedComponents: React.Dispatch<React.SetStateAction<IComponents>>;
}

const Category = ({categoryName, selectedComponents, setSelectedComponents}: ICategory) => {
  const [activeList, setActiveList] = useState<boolean>(false);

  const {data: category} = api.category.findCategoryByName.useQuery({name: categoryName});

  const {data: products, refetch} = api.product.getProductsByCategoryId.useQuery(
    {
      categoryId: category?.id || '',
      compatibility: {socket: selectedComponents.CPU?.socket || selectedComponents.Motherboard?.socket || ''},
    },
    {enabled: false}
  );

  const queryClient = useQueryClient();

  const handleCategoryClick = (): void => {
    setActiveList((prev) => !prev);

    if (!products) {
      refetch();
    }
  };

  const handleAddProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: Product): void => {
    setSelectedComponents(() => {
      if (category?.slug) {
        return {
          ...selectedComponents,
          [category.slug]: product,
        };
      }
      return selectedComponents;
    });
  };

  function handleRemoveProduct(event: React.MouseEvent<HTMLParagraphElement, MouseEvent>): void {
    setSelectedComponents(() => {
      if (category?.slug) {
        return {
          ...selectedComponents,
          [category.slug]: undefined,
        };
      }
      return selectedComponents;
    });
  }

  const Recomendations = () => {
    switch (categoryName) {
      case 'Видеокарты':
        // Проверяем что компонент CPU выбран
        if (!selectedComponents['CPU']) return null;
        // Высчитываем ожидаемую цену видеокарты на основе цены выбранного процессора
        const predictedGPUPrice = 6.0975 * Math.pow(selectedComponents['CPU'].price, 0.9117);

        if (!products) return null;
        const predictedGPUProducts = addWeightToProductststs(products, predictedGPUPrice);

        return predictedGPUProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      case 'Материнские платы':
        if (!selectedComponents['CPU']) return null;
        const predictedMotherBoardPrice = 19.875 * Math.pow(selectedComponents['CPU'].price, 0.6481);
        if (!products) return null;
        const predictedMotherBoardProducts = addWeightToProductststs(products, predictedMotherBoardPrice);
        return predictedMotherBoardProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      case 'Оперативная память':
        let predictedDRAMPrice = 0;
        let xDram = 0;
        if (!selectedComponents['CPU'] && !selectedComponents['GPU']) return null;
        else if (selectedComponents['CPU'] && selectedComponents['GPU']) {
          xDram = selectedComponents['CPU'].price + selectedComponents['GPU'].price;
          predictedDRAMPrice = 2e-11 * Math.pow(xDram, 3) - 2e-6 * Math.pow(xDram, 2) + 0.1503 * xDram + 804.67;
        } else if (selectedComponents['CPU']) {
          xDram = selectedComponents['CPU'].price;
          predictedDRAMPrice = 5e-7 * Math.pow(xDram, 2) + 0.2652 * xDram + 1491;
        } else if (selectedComponents['GPU']) {
          xDram = selectedComponents['GPU'].price;
          predictedDRAMPrice = 4e-7 * Math.pow(xDram, 2) + 0.0677 * xDram + 2602;
        }

        if (!products) return null;
        const predictedDRAMProducts = addWeightToProductststs(products, predictedDRAMPrice);
        return predictedDRAMProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      case 'Блоки питания':
        if (!selectedComponents['GPU']) return null;
        const xPower = selectedComponents['GPU'].price;
        const predictedPowerPrice = 2.3901 * Math.pow(xPower, 0.7414);
        if (!products) return null;
        const predictedPowerProducts = addWeightToProductststs(products, predictedPowerPrice);
        return predictedPowerProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      case 'Охлаждение':
        if (!selectedComponents['CPU']) return null;
        const xCooler = selectedComponents['CPU'].price;
        const predictedCoolerPrice = 0.1134 * Math.pow(xCooler, 1.0512);
        if (!products) return null;
        const predictedCoolerProducts = addWeightToProductststs(products, predictedCoolerPrice);
        return predictedCoolerProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      case 'Корпуса':
        if (!selectedComponents['CPU'] || !selectedComponents['GPU']) return null;
        const xCase = selectedComponents['CPU'].price + selectedComponents['GPU'].price;
        const predictedCasePrice = 30.61 * Math.pow(xCase, 0.4666);
        if (!products) return null;
        const predictedCaseProducts = addWeightToProductststs(products, predictedCasePrice);
        return predictedCaseProducts
          .slice(0, 4)
          .map((product) => (
            <RecomendedProduct
              categoryName={categoryName}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              product={product}
            />
          ));
      default:
        return null;
    }
  };

  return (
    <div className='relative grid hover:shadow-md'>
      <div className='pointer flex justify-between px-3 py-4'>
        <div className='w-40'>
          <p>{categoryName}</p>
        </div>
        {selectedComponents[category?.slug as keyof IComponents] ? (
          <div className='flex gap-3 min-w-[65%]'>
            <div className='w-[100px] h-[55px] relative'>
              <Image
                className='object-contain'
                fill={true}
                src={selectedComponents[category?.slug as keyof IComponents]?.ImageURL || ''}
                alt=''
              />
            </div>
            <div>
              <p className='w-[400px]'>{selectedComponents[category?.slug as keyof IComponents]?.name}</p>
            </div>
            <div>
              <p className='text-3xl'>{selectedComponents[category?.slug as keyof IComponents]?.price} ₽</p>
            </div>
            <div className='self-end text-sm cursor-pointer hover:underline'>
              <p onClick={handleRemoveProduct}>Удалить x</p>
            </div>
          </div>
        ) : (
          <div className='min-w-[65%] grid gap-2'>
            <div className='bg-gray-600 min-h-[20%] w-[65%]'></div>
            <div className='bg-gray-600 min-h-[20%] w-[40%]'></div>
          </div>
        )}
        <div className='w-20'>
          <button onClick={handleCategoryClick} className='button-main hover:bg-slate-700 w-32'>
            {activeList ? 'Свернуть' : 'Добавить'}
          </button>
        </div>
      </div>
      {activeList && products ? (
        <>
          <div className='my-2'>
            <p className='text-3xl mb-2'>Рекомендации</p>
            <div className='flex gap-2'>{Recomendations()}</div>
          </div>
          <div>
            <p className='text-3xl mb-2'>Все товары</p>
            <div className='grid gap-2 bg-slate-950 max-h-[600px] overflow-x-hidden overflow-y-scroll'>
              {products.map((product) => (
                <div className='flex justify-between items-center gap-3 bg-slate-900 rounded p-3 m-3 '>
                  <div className='w-[85px] h-[85px] relative'>
                    {product.ImageURL && <Image className='object-contain' fill={true} src={product.ImageURL} alt='' />}
                  </div>
                  <div className='w-[600px]'>
                    <p>{product.name}</p>
                  </div>
                  <div>
                    <p className='text-3xl'>{product.price} ₽</p>
                  </div>
                  <div>
                    <button className='button-main hover:bg-slate-700' onClick={(e) => handleAddProduct(e, product)}>
                      В комплект
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Category;
