import {prisma} from '../src/server/db';

async function main() {
  const id = '644fe763947cb2c3f1aa2c06';
  await prisma.product.create({
    data: {
      name: 'Кулер для процессора DEEPCOOL GAMMAXX 300 [LGA1700]',
      shortName: 'DEEPCOOL GAMMAXX 300',
      price: 1599,
      rating: 4.85,
      ratingCount: 819,
      category: {
        connect: {
          id: '645014e7157b5cb68c13e5d1'
        }
      },
      quantity: 550,
      ImageURL: 'https://lh3.googleusercontent.com/pw/AJFCJaVsPYHe5rMQdq-E8jVNWL8U3iVLcGHDF6RVGQTSoqVBZYjb80M3kZ9CcGtBRmhEJTJJtmnISr66mvK-7Ad8-ChY_GbdfkdIzmYVZ1y1_8LQsc4QTNz1CoJhBb9mr_hMqHAErRfoP8S6fcpLg4jbcusf=w600-h591-s-no?authuser=0'
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
