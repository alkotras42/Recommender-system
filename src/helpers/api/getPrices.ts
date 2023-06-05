import axios from 'axios';

export async function getCPUPriceByGPU(price: number) {
  const url = `http://localhost:5000/getCPUPriceByGPU?price=${price}`;  // Замените ваш_хост на фактический хост вашего Flask API

  const response = await axios.get(url);  // Используем axios для выполнения GET-запроса

  return response.data.cpu_price;  // Возвращаем предсказанную цену компонента CPU
}
