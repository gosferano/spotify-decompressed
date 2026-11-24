// One expanded row at a time, remembered by key: changing a filter replaces
// the row objects
export const useExpandedRow = <T extends { Key: string }>(rows: () => T[]) => {
  const expandedKey = ref<string>()

  const expandedRows = computed(() =>
    rows().filter((row) => row.Key === expandedKey.value),
  )

  const isExpanded = (row: T) => row.Key === expandedKey.value

  const toggleRow = (row: T) => {
    expandedKey.value = isExpanded(row) ? undefined : row.Key
  }

  return { expandedRows, isExpanded, toggleRow }
}
