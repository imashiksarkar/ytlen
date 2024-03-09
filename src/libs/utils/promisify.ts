const promisify =
  (fn: Function) =>
  /**
   * @returns [ [args to promisified function], [callback args] ]
   */
  (...args: any[]): Promise<any[][]> =>
    new Promise((resolve) =>
      fn((...cbArgs: any[]) => {
        resolve([args, cbArgs])
      })
    )

export default promisify
