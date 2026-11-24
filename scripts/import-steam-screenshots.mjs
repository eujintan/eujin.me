// Run locally with Node 22+ and network access. Review image rights and crops before publishing.
import {mkdir,writeFile} from 'node:fs/promises';
const apps={'train-404':4539710,wam:4603550,'last-draft':4536290,ramen:4331050};
const result={};
for(const [id,app] of Object.entries(apps)){
 const response=await fetch(`https://store.steampowered.com/api/appdetails?appids=${app}`,{signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error(`${id}: Steam returned ${response.status}`);
 const data=(await response.json())[app];if(!data?.success||!data.data?.screenshots?.length)throw Error(`${id}: no screenshots available`);
 const dir=`public/images/${id}`;await mkdir(dir,{recursive:true});result[id]=[];
 for(const [index,shot] of data.data.screenshots.slice(0,4).entries()){
  const url=new URL(shot.path_full);if(url.protocol!=='https:'||!url.hostname.endsWith('.steamstatic.com'))throw Error('Unexpected image host');
  const img=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!img.ok||!img.headers.get('content-type')?.startsWith('image/jpeg'))throw Error(`Invalid screenshot ${id}/${index}`);
  const file=`${dir}/${index+1}.jpg`;await writeFile(file,Buffer.from(await img.arrayBuffer()));result[id].push({src:`/images/${id}/${index+1}.jpg`,alt:`${data.data.name} official Steam screenshot ${index+1}`});
 }
}
await writeFile('src/data/screenshots.json',JSON.stringify(result,null,2)+'\n');console.log('Imported Steam screenshots. Review before publishing.');
