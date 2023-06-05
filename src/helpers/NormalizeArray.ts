export function NormalizeArray(array: Array<number>) {
  const ratio = Math.max.apply(Math, array);

  const result = array.map((v) => {
    return v / ratio;
  });

  return result;
}
