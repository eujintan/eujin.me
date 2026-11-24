import {track} from '../lib/analytics';
import {useEffect,useRef,useState,type Dispatch,type SetStateAction,type PointerEvent} from 'react';
import type {Project} from '../data/portfolio';
import {undoLikes,swipeDirection,type HistoryItem} from '../lib/swipe';
type Direction='left'|'right';
export const SWIPE_DURATION_MS=480;
export function useSwipe({projects,liked,setLiked,enabled,setNotice}:{projects:Project[];liked:string[];setLiked:Dispatch<SetStateAction<string[]>>;enabled:boolean;setNotice:(s:string)=>void}){
 const [index,setIndex]=useState(0),[history,setHistory]=useState<HistoryItem[]>([]),[direction,setDirection]=useState<Direction|null>(null),[drag,setDrag]=useState(0);
 const lock=useRef(false),timer=useRef<number|undefined>(undefined),pointer=useRef<{id:number;x:number;y:number}|null>(null);const current=projects[index];
 useEffect(()=>()=>window.clearTimeout(timer.current),[]);
 function swipe(dir:Direction,inputMethod: 'keyboard'|'button'|'gesture'='button'){if(lock.current||!current||!enabled)return;lock.current=true;pointer.current=null;setDirection(dir);const added=dir==='right'&&!liked.includes(current.id);timer.current=window.setTimeout(()=>{track('project_swiped',{project_id:current.id,direction:dir,input_method:inputMethod});if(added)setLiked(prev=>prev.includes(current.id)?prev:[...prev,current.id]);setHistory(prev=>[...prev,{index,projectId:current.id,added}]);setIndex(i=>i+1);setDirection(null);setDrag(0);lock.current=false;},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:SWIPE_DURATION_MS+50)}
 function undo(){if(lock.current||!history.length)return;const last=history[history.length-1];track('swipe_undone',{project_id:last.projectId});setIndex(last.index);setLiked(prev=>undoLikes(prev,last));setHistory(prev=>prev.slice(0,-1));setDrag(0);setNotice('Last swipe undone')}
 function reset(){if(lock.current)return;track('deck_restarted',{});setIndex(0);setHistory([]);setDrag(0);setDirection(null);setNotice('Deck restarted')}
 useEffect(()=>{function keys(e:KeyboardEvent){if(!enabled||e.defaultPrevented||e.repeat||(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable=true]')))return;if((e.ctrlKey||e.metaKey)&&!e.altKey&&e.key.toLowerCase()==='z'){e.preventDefault();undo();return}if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();swipe(e.key==='ArrowLeft'?'left':'right','keyboard')}}document.addEventListener('keydown',keys);return()=>document.removeEventListener('keydown',keys)});
 function pointerDown(e:PointerEvent<HTMLDivElement>){if(!enabled||!current||lock.current||e.button!==0||(e.target as HTMLElement).closest('button,a'))return;pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}
 function pointerMove(e:PointerEvent<HTMLDivElement>){const p=pointer.current;if(!p||p.id!==e.pointerId)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dx)<25)return;setDrag(Math.max(-330,Math.min(330,dx)))}
 function cancelPointer(){pointer.current=null;if(!lock.current)setDrag(0)}
 function pointerUp(e:PointerEvent<HTMLDivElement>){const p=pointer.current;if(!p||p.id!==e.pointerId)return;pointer.current=null;const dir=swipeDirection(e.clientX-p.x,e.clientY-p.y);if(dir)swipe(dir,'gesture');else setDrag(0)}
 return {index,current,history,direction,drag,swipe,undo,reset,pointerDown,pointerMove,pointerUp,cancelPointer};
}
