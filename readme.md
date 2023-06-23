# Map Chain

## Description
This function allows you to perform a chain of transformations on a given value using the provided functions.

### Arguments
- `initialValue` <any> - The value on which the transformations will be performed (set during function initialization).
- `globalFailValue` <any | function> - the value to be set in case the computations end in failure and there is no `localFailValue` in a particular transformation segment (set during function initialization). It is also possible to pass a function that takes the transformed value as an argument and returns a new value.
- `transformFn` <function> - The transformation function applied to the current value in the chain. It takes the current value as an argument and returns a new value.
- `localFailValue` <any | function> - The value to be set in case the computations end in failure. It takes precedence over `globalFailValue` and is set for each transformation segment. It is also possible to pass a function that takes the transformed value as an argument and returns a new value.
- `truthCondition` <function> - The truth condition that determines whether the chain should continue after a transformation. This is an optional argument that can be a function. If provided, it takes the result of `transformFn` applied to the current `initialValue` and returns `true` or `false`. If truthCondition is not a function, the transformation will continue if the result is not equal to `null` or `undefined`.

To obtain the resulting value, simply call the function without any arguments `()`.

### Usage Examples:
```
mapChain(10, 30)((x) => x * 2)(() => null, "fail")(() => null, 1008)(); // 'fail'
mapChain(10, 30)((x) => x * 2)(() => null)(() => null, 1008)(); // 30
mapChain(10)((x) => x * 2)(() => null)(() => null, 1008)(); // null
mapChain(10)((x) => x * 2)((x) => x + 2)((x) => x / 4)(); // 5.5
mapChain(10)((x) => x * 2)((x) => x + 2)((x) => x / 4); // expression () => {}

const flatterer = (persone) => {
  return mapChain(persone)(
    ({ firstName, lastName, age }) => `${firstName} ${lastName}, ${age - 5}`,
    (string) => {
      const persone = string.split(" ");
      persone[1] = persone[1][0] + ".,";
      return persone.join(" ");
    },
    (result) => result.length < 15
  )();
};

const sergeiVasilenko = flatterer({
  firstName: "Sergei",
  lastName: "Valilenko",
  age: 36,
}); // 'Sergei V., 31'

const joeSmith = flatterer({
  firstName: "Joe",
  lastName: "Smith",
  age: 30,
}); // 'Joe Smith, 25'
```

P.S.: I couldn't come up with an elegant solution for passing the value of a failed computation through all the function calls, so my solution looks like `["fail", failValue]`. If anyone has any insights on how to improve this, please let me know. I'm also open to any constructive criticism.