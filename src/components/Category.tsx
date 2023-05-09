import {Product} from '@prisma/client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {IComponents} from '~/pages';
import {api} from '~/utils/api';
import RecomendedProduct from './RecomendedProduct';

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

  const handleCategoryClick = (): void => {
    setActiveList((prev) => !prev);

    if (!products) {
      refetch();
    }
    console.log(products);
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

    console.log(selectedComponents);
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
        let predictedGPUProducts;
        if (!products) return null;
        // Создаем копию массива товаров
        predictedGPUProducts = [...products];
        // Добавляем товару атрибут веса, который вычисляется на разнице между ожидаемым числом товара и реальным
        predictedGPUProducts.map((product) => {
          //@ts-ignore
          product.weight =
            product.price > predictedGPUPrice ? predictedGPUPrice / product.price : product.price / predictedGPUPrice;
        });
        //@ts-ignore
        predictedGPUProducts.sort((a, b) => b.weight - a.weight);
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
        const predictedMotherboardPrice = 19.875 * Math.pow(selectedComponents['CPU'].price, 0.6481);
        let predictedMotherboardProducts;
        if (!products) return null;
        predictedMotherboardProducts = [...products];
        predictedMotherboardProducts.map((product) => {
          //@ts-ignore
          product.weight =
            product.price > predictedMotherboardPrice
              ? predictedMotherboardPrice / product.price
              : product.price / predictedMotherboardPrice;
        });
        //@ts-ignore
        predictedMotherboardProducts.sort((a, b) => b.weight - a.weight);
        return predictedMotherboardProducts
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
        if (!selectedComponents['CPU'] || !selectedComponents['GPU']) return null;
        const xDram = selectedComponents['CPU'].price + selectedComponents['GPU'].price;
        const predictedDRAMPrice = 2e-11 * Math.pow(xDram, 3) - 2e-6 * Math.pow(xDram, 2) + 0.1503 * xDram + 804.67;
        let predictedDRAMProducts;
        if (!products) return null;
        predictedDRAMProducts = [...products];
        predictedDRAMProducts.map((product) => {
          //@ts-ignore
          product.weight =
            product.price > predictedDRAMPrice
              ? predictedDRAMPrice / product.price
              : product.price / predictedDRAMPrice;
        });
        //@ts-ignore
        predictedDRAMProducts.sort((a, b) => b.weight - a.weight);
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
        let predictedPowerProducts;
        if (!products) return null;
        predictedPowerProducts = [...products];
        predictedPowerProducts.map((product) => {
          //@ts-ignore
          product.weight =
            product.price > predictedPowerPrice
              ? predictedPowerPrice / product.price
              : product.price / predictedPowerPrice;
        });
        //@ts-ignore
        predictedPowerProducts.sort((a, b) => b.weight - a.weight);
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
        let predictedCoolerProducts;
        if (!products) return null;
        predictedCoolerProducts = [...products];
        predictedCoolerProducts.map((product) => {
          //@ts-ignore
          product.weight =
            product.price > predictedCoolerPrice
              ? predictedCoolerPrice / product.price
              : product.price / predictedCoolerPrice;
        });
        //@ts-ignore
        predictedCoolerProducts.sort((a, b) => b.weight - a.weight);
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
      default:
        return null;
    }
  };

  console.log(Recomendations());

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
