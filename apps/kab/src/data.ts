import type { Skripta } from './types'
import { chap00 } from './chapters/chap00'
import { chapMath } from './chapters/chapMath'
import { chap01 } from './chapters/chap01'
import { chap02 } from './chapters/chap02'
import { chap03 } from './chapters/chap03'
import { chap04 } from './chapters/chap04'
import { chap05 } from './chapters/chap05'
import { chap06 } from './chapters/chap06'
import { chap07 } from './chapters/chap07'
import { chap08 } from './chapters/chap08'
import { chap09 } from './chapters/chap09'
import { chap10 } from './chapters/chap10'
import { chap11 } from './chapters/chap11'
import { chap12 } from './chapters/chap12'

export const skripta: Skripta = {
  subtitle: 'Kryptografie a bezpečnost',
  chapters: [
    chapMath,
    chap01,
    chap02,
    chap03,
    chap04,
    chap05,
    chap06,
    chap07,
    chap08,
    chap09,
    chap10,
    chap11,
    chap12,
    chap00,
  ],
}
