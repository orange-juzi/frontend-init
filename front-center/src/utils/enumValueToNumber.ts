// 辅助函数，将枚举值转换为对应的数字
// 辅助函数，将枚举值或枚举值数组转换为对应的数字或数字数组
const enumValueToNumber = (enumObj: Record<string, any>, enumValues: any) => {
  const convertToNumber = (value: string) => {
     const keys = Object.keys(enumObj);
     const key = keys.find(k => enumObj[k] === value);
     return key ? parseInt(key, 10) : undefined;
  };

  if (Array.isArray(enumValues)) {
    return enumValues.map(convertToNumber);
  } else {
    return convertToNumber(enumValues);
  }
};

export default enumValueToNumber;
