export const LIKES_KEY='eujin-portfolio-likes-v2';
export function parseIds(value:string|null,allowed:string[]):string[]{
 if(!value)return [];
 try {const data:unknown=JSON.parse(value);return Array.isArray(data)?[...new Set(data.filter((x):x is string=>typeof x==='string'&&allowed.includes(x)))]:[];}catch{return []}
}
export function parseShared(search:string,allowed:string[]):string[]{
 const params=new URLSearchParams(search);return [...new Set((params.get('liked')||'').split(',').filter(id=>allowed.includes(id)))];
}
export function buildShareUrl(base:string,ids:string[]):string{
 const url=new URL(base);url.searchParams.delete('liked');if(ids.length)url.searchParams.set('liked',ids.join(','));return url.toString();
}
