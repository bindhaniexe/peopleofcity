
import { expect, it } from 'vitest'
import { normCode } from './inviteCode'

it('formats local invite codes and preserves existing invite links', () => {
  expect(normCode('4k7q9m')).toBe('BBS-4K7Q9M')
  expect(normCode('https://example.test/?invite=bbs-4k7q9m')).toBe('BBS-4K7Q9M')
  expect(normCode('https://example.test/?invite=blr-4k7q9m')).toBe('BLR-4K7Q9M')
  expect(normCode(' blr4k7q9m ')).toBe('BLR-4K7Q9M')
  expect(normCode('BBS123')).toBe('BBS-BBS123')
})
