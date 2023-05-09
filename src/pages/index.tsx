import {Product} from '@prisma/client';
import styles from './index.module.css';
import {type NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useState} from 'react';
import Category from '~/components/Category';

import {api} from '~/utils/api';

export interface IComponents {
  GPU: Product | undefined;
  Motherboard: Product | undefined;
  CPU: Product | undefined;
  DRAM: Product | undefined;
  Case: Product | undefined;
  Power: Product | undefined;
  Storage: Product | undefined;
  Cooler: Product | undefined;
}

const Home: NextPage = () => {
  const [categoryInput, setCategoryInput] = useState<string>('');

  const [currentCategory, setCurrentCategory] = useState<string>('');

  const [selectedComponents, setSelectedComponents] = useState<IComponents>({
    GPU: undefined,
    Motherboard: undefined,
    CPU: undefined,
    DRAM: undefined,
    Case: undefined,
    Power: undefined,
    Storage: undefined,
    Cooler: undefined,
  });

  const categoryMutation = api.category.createCategory.useMutation();

  const categories = api.category.getAllCategories.useQuery();

  const getCategoryByName = api.category.findCategoryByName.useQuery({name: currentCategory});

  const addCategory = (e: any) => {
    e.preventDefault();
    categoryMutation.mutate({
      name: categoryInput,
    });
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    setCurrentCategory(e.currentTarget.innerText);

    console.log(getCategoryByName.data?.id);
  };

  return (
    <div className='bg-slate-900 max-w-screen min-w-screen max-h-screen min-h-screen text-white overflow-scroll '>
      <div className='max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8'>
        <div>
          <div className='mt-10 divide-y divide-slate-700  h-auto rounded-xl flex flex-col gap-2'>
            {categories.data &&
              categories.data.map((category) => (
                <Category
                  selectedComponents={selectedComponents}
                  setSelectedComponents={setSelectedComponents}
                  categoryName={category.name}
                  onClick={handleCategoryClick}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
