const mapChain =
  (initialValue, globalFailValue = null) =>
  (transformFn, localFailValue = null, truthCondition) => {
    const isFailValue =
      Array.isArray(initialValue) && initialValue[0] === "fail";
    if (!transformFn) {
      return isFailValue ? initialValue[1] : initialValue;
    }
    if (isFailValue) {
      return mapChain(initialValue);
    }
    const result = transformFn(initialValue);
    const isTrue = (result) =>
      truthCondition instanceof Function
        ? truthCondition(result)
        : result !== null && result !== undefined;
    return isTrue(result)
      ? mapChain(result, globalFailValue)
      : mapChain(["fail", localFailValue ?? globalFailValue]);
  };

mapChain(10, 30)((x) => x * 2)(() => null, "fail")(() => null, 1008)(); // 'fail'
mapChain(10, 30)((x) => x * 2)(() => null)(() => null, 1008)(); // 30
mapChain(10)((x) => x * 2)(() => null)(() => null, 1008)(); // null
mapChain(10)((x) => x * 2)((x) => x + 2)((x) => x / 4)(); // 5.5
mapChain(10)((x) => x * 2)((x) => x + 2)((x) => x / 4); // expression () => {}
