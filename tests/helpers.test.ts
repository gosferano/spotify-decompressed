import { describe, expect, it } from 'vitest'
import { getPage, msToText } from '~/utils/helpers'

describe('msToText', () => {
  it('uses seconds below a minute', () => {
    expect(msToText(0)).toBe('0s')
    expect(msToText(1500)).toBe('1.5s')
    expect(msToText(59_000)).toBe('59s')
  })

  it('uses minutes below an hour', () => {
    expect(msToText(60_000)).toBe('1min')
    expect(msToText(90_000)).toBe('1.5min')
  })

  it('uses hours from an hour up', () => {
    expect(msToText(3_600_000)).toBe('1h')
    expect(msToText(5_400_000)).toBe('1.5h')
    expect(msToText(48 * 3_600_000)).toBe('48h')
  })

  it('uses days from a day up when asked', () => {
    expect(msToText(12 * 3_600_000, true)).toBe('12h')
    expect(msToText(36 * 3_600_000, true)).toBe('1.5d')
  })
})

describe('getPage', () => {
  const items = [1, 2, 3, 4, 5]

  it('returns the requested 1-based page', () => {
    expect(getPage(items, 1, 2)).toEqual([1, 2])
    expect(getPage(items, 2, 2)).toEqual([3, 4])
  })

  it('returns a short last page and an empty page past the end', () => {
    expect(getPage(items, 3, 2)).toEqual([5])
    expect(getPage(items, 4, 2)).toEqual([])
  })
})
