import { describe,it,expect } from 'vitest';
import { parseIds,parseShared,buildShareUrl } from '../src/lib/likes';
const allowed=['train-404','wam','ramen'];
describe('shortlist utilities',()=>{
 it('validates and deduplicates saved ids',()=>expect(parseIds('["wam","wam","bad"]',allowed)).toEqual(['wam']));
 it('handles corrupted browser storage',()=>expect(parseIds('not json',allowed)).toEqual([]));
 it('parses shared interests',()=>expect(parseShared('?liked=wam,ramen,bad',allowed)).toEqual(['wam','ramen']));
 it('builds a share link',()=>expect(buildShareUrl('https://eujin.me/', ['wam'])).toBe('https://eujin.me/?liked=wam'));
});
