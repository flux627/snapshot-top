export function findMaxIndices(arr, count) {
  let indices = []
  for (let i = 0; i < arr.length; i++) {
    indices.push(i)
    if (indices.length > count) {
      indices.sort((a, b) => arr[b] - arr[a])
      indices.pop()
    }
  }
  return indices
}
