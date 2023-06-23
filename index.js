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
    if (isTrue(result)) {
      return mapChain(result, globalFailValue);
    } else {
      const failValue = localFailValue ?? globalFailValue;
      return mapChain([
        "fail",
        failValue instanceof Function ? failValue(result) : failValue,
      ]);
    }
  };
