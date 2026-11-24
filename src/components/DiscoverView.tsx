
import {ArrowRight, Heart, RotateCcw, Sparkles, Star, X} from 'lucide-react';
import {projects, type Project} from "../data/portfolio";
import {ProjectCard, type Tab, type Direction} from "./shared";
import {SWIPE_DURATION_MS} from "../hooks/useSwipe";
export function DiscoverView({index,current,history,direction,drag,swipe,undo,reset,pointerDown,pointerMove,pointerUp,cancelPointer,setDetail,switchTab}:{index:number;current:Project|undefined;history:unknown[];direction:Direction|null;drag:number;swipe:(d:Direction)=>void;undo:()=>void;reset:()=>void;pointerDown:React.PointerEventHandler<HTMLDivElement>;pointerMove:React.PointerEventHandler<HTMLDivElement>;pointerUp:React.PointerEventHandler<HTMLDivElement>;cancelPointer:()=>void;setDetail:(p:Project)=>void;switchTab:(t:Tab)=>void}){return <div className="discover-page">
    <div className="section-intro"><div><span className="small-overline"><Sparkles size={13}/> NICE TO MEET YOU, I'M EU JIN</span><h1>Let's make <span>something click.</span></h1><p>Games. Engineering. A little bit of chaos. Swipe through my portfolio and see if we match.</p></div><div className="intro-counter"><span>0{Math.min(index+1,projects.length)}</span><span className="divider-mark">/</span><span>0{projects.length}</span><small>PROFILES TO EXPLORE</small></div></div>
    <div className="deck-zone">
     <div className="deck-column">
      <div className="deck-topline"><div><span className="pink-dot"/> DISCOVER MODE</div><span>{index<projects.length?'SWIPE TO EXPLORE':'YOU SAW IT ALL'}</span></div>
      <div className="card-stack" data-testid="card-stack">
       {current? projects.slice(index,index+3).map((project,depth)=>{
        const active=depth===0;
        const exiting=active&&direction!==null;
        const stackDepth=Math.max(0,depth-(direction?1:0));
        const sign=direction==='right'?1:-1;
        const transform=exiting
          ? `translateX(${sign*110}vw) rotate(${sign*22}deg)`
          : active ? `translateX(${drag}px) rotate(${drag/24}deg)`
          : `translateY(${stackDepth*10}px) scale(${1-stackDepth*.055})`;
        return <div key={project.id}
          className={`card-interactive ${exiting?'card-exiting':''} ${!active?'card-underneath':''} ${active&&drag!==0&&!direction?'is-dragging':''}`}
          data-project-id={project.id} data-card-depth={depth}
          aria-hidden={!active?true:undefined}
          ref={node=>{if(node)node.inert=!active;}}
          style={{transform,opacity:exiting?0:1,zIndex:3-depth,
            transition:exiting?`transform ${SWIPE_DURATION_MS}ms cubic-bezier(.42,0,.85,.75), opacity ${SWIPE_DURATION_MS}ms cubic-bezier(.42,0,.85,.75)`
              :!active?`transform ${SWIPE_DURATION_MS}ms cubic-bezier(.25,.1,.25,1)`
              :drag!==0?'none':'transform 280ms cubic-bezier(.22,.7,.25,1)'}}
          onPointerDown={active?pointerDown:undefined} onPointerMove={active?pointerMove:undefined}
          onPointerUp={active?pointerUp:undefined} onPointerCancel={active?cancelPointer:undefined}>
          <ProjectCard project={project} drag={active?drag:0} stamp={active?direction:null} onDetails={()=>{if(active&&!direction)setDetail(project);}}/>
        </div>;
       })
       :<div className="deck-finished"><span className="finish-emoji">✳</span><h2>That's everyone!</h2><p>Made it through the whole lineup. Want another look, or ready to see your matches?</p><button className="primary-btn" onClick={reset}><RotateCcw size={17}/> Replay deck</button><button className="plain-link" onClick={()=>switchTab('likes')}>See your likes <ArrowRight size={16}/></button></div>}
      </div>
      <div className="deck-controls"><button aria-label="Undo previous swipe" className="control-btn control-rewind" onClick={undo} disabled={history.length===0||!!direction} title="Undo"><RotateCcw size={22}/></button><button aria-label="Skip to next project" className="control-btn control-pass" onClick={()=>swipe('left')} disabled={!current||!!direction} title="Skip"><X size={30} strokeWidth={2.8}/></button><button aria-label="Like this project" className="control-btn control-like" onClick={()=>swipe('right')} disabled={!current||!!direction} title="Like"><Heart size={29} fill="currentColor"/></button><button aria-label="Read project details" className="control-btn control-info" onClick={()=>current&&setDetail(current)} disabled={!current||!!direction} title="More info"><Star size={21}/></button></div>
      <div className="keyboard-tip"><span><kbd>←</kbd> skip</span><span><kbd>→</kbd> interested</span><span className="tip-mobile">or drag the card</span></div>
     </div>
    </div>
   </div>;}
