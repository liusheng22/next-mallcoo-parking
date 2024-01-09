function toAsyncAwait(fn: Promise<any>, defaultResult = null) {
  return fn
    .then((res) => [true, res])
    .catch((err) => [false, defaultResult || err])
}

export default toAsyncAwait
