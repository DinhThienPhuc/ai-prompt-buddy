export const areArraysEqual = (firstArray, secondArray) => {
  const areEqual =
    firstArray.length === secondArray.length &&
    firstArray.every((field) => secondArray.includes(field));

  return areEqual;
};
