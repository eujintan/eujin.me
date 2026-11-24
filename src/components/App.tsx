import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Code2, Copy, ExternalLink, Flame, Heart, Info, Mail, MessageCircle, RotateCcw, Search, Send, Settings2, Sparkles, Star, UserRound, X } from 'lucide-react';
import { linkedin, profile, projects, type Project } from '../data/portfolio';
import { buildShareUrl, LIKES_KEY, parseIds, parseShared } from '../lib/likes';
type Tab = 'discover' | 'likes' | 'profile' | 'messages';
type Direction = 'left' | 'right';
type HistoryItem = {index:number; projectId:string; direction:Direction};
const ids=projects.map(p=>p.id);

function Artwork({project,background=false}:{project:Project; background?:boolean}){
 return <div className={`artwork artwork-${project.color} ${background?'artwork-background':''}`} aria-label={`${project.title} stylized placeholder artwork`}>
  <div className="noise"/><div className="art-corners"><span>EST. IN PRODUCTION</span><span>MPG / {project.id.toUpperCase()}</span></div>
  <div className="art-stage"><span className="art-echo">{project.motif}</span><span className="art-hero">{project.motif}</span></div>
  <div className="art-foot"><span className="art-dash"/><span>{project.stamp}</span></div>
 </div>
}
function Dot(){return <span className="live-dot"/>}
function ProjectCard({project,onDetails,drag,stamp}:{project:Project;onDetails:()=>void;drag:number;stamp:Direction|null}){
 return <div className="project-card">
  <Artwork project={project}/>
  <div className="card-cover-gradient"/>
  {stamp&&<div className={`swipe-stamp swipe-stamp-${stamp}`}>{stamp==='right'?'INTERESTED':'NEXT'}</div>}
  {!stamp&&Math.abs(drag)>38&&<div className={`swipe-stamp swipe-stamp-${drag>0?'right':'left'}`} style={{opacity:Math.min(1,Math.abs(drag)/125)}}>{drag>0?'INTERESTED':'NEXT'}</div>}
  <div className="card-content">
   <div className="eyebrow-light">{project.genre}</div>
   <h2>{project.title}<span className="card-spark">✳</span></h2>
   <p>{project.blurb}</p>
   <div className="card-bottom"><span className="role-chip"><BriefcaseBusiness size={13}/>{project.role}</span><button className="detail-dot" aria-label={`Read more about ${project.title}`} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onDetails();}}><Info size={21}/></button></div>
  </div>
 </div>
}

function NavButton({tab,current,onClick,children,count}:{tab:Tab;current:Tab;onClick:(tab:Tab)=>void;children:React.ReactNode;count?:number}){return <button className={`nav-item ${current===tab?'active':''}`} onClick={()=>onClick(tab)} aria-current={current===tab?'page':undefined}>{children}{count!==undefined&&count>0&&<span className="nav-count">{count}</span>}</button>}
export default function App(){
 const [tab,setTab]=useState<Tab>('discover');
 const [index,setIndex]=useState(0);
 const [liked,setLiked]=useState<string[]>([]);
 const [history,setHistory]=useState<HistoryItem[]>([]);
 const [direction,setDirection]=useState<Direction|null>(null);
 const [drag,setDrag]=useState(0);
 const [detail,setDetail]=useState<Project|null>(null);
 const [resume,setResume]=useState<'production'|'engineering'>('production');
 const [notice,setNotice]=useState('');
 const [ready,setReady]=useState(false);
 const pointer=useRef<{id:number;startX:number;startY:number;active:boolean}|null>(null);
 const lock=useRef(false);
 const cardRef=useRef<HTMLDivElement>(null);
 const current=projects[index];
 useEffect(()=>{
  const stored=parseIds(localStorage.getItem(LIKES_KEY),ids);
  const shared=parseShared(window.location.search,ids);
  setLiked(shared.length?shared:stored);
  setReady(true);
 },[]);
 useEffect(()=>{if(ready)localStorage.setItem(LIKES_KEY,JSON.stringify(liked));},[liked,ready]);
 useEffect(()=>{if(!notice)return;const t=window.setTimeout(()=>setNotice(''),2600);return()=>window.clearTimeout(t)},[notice]);
 function switchTab(next:Tab){setTab(next);setDetail(null);window.scrollTo({top:0,behavior:'smooth'});}
 function swipe(dir:Direction){
  if(lock.current||!current||detail||tab!=='discover')return;
  lock.current=true;setDirection(dir);setDrag(dir==='right'?420:-420);
  const selected=current;
  window.setTimeout(()=>{
   if(dir==='right')setLiked(prev=>prev.includes(selected.id)?prev:[...prev,selected.id]);
   setHistory(prev=>[...prev,{index,projectId:selected.id,direction:dir}]);
   setIndex(prev=>prev+1);setDirection(null);setDrag(0);lock.current=false;
  },265);
 }
 function undo(){if(lock.current)return;const last=history[history.length-1];if(!last)return;setIndex(last.index);if(last.direction==='right')setLiked(prev=>prev.filter(id=>id!==last.projectId));setHistory(prev=>prev.slice(0,-1));setDrag(0);setNotice('Last swipe undone');}
 function reset(){setIndex(0);setHistory([]);setDrag(0);setDirection(null);lock.current=false;setNotice('Deck restarted');}
 useEffect(()=>{
  function keys(e:KeyboardEvent){
   if(tab!=='discover'||detail)return;
   if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName))return;
   if(e.key==='ArrowLeft'){e.preventDefault();swipe('left')}
   if(e.key==='ArrowRight'){e.preventDefault();swipe('right')}
   if(e.key.toLowerCase()==='z'&&(e.ctrlKey||e.metaKey)){e.preventDefault();undo()}
  }
  document.addEventListener('keydown',keys);return()=>document.removeEventListener('keydown',keys)
 });
 function pointerDown(e:React.PointerEvent<HTMLDivElement>){if(!current||lock.current||e.button!==0||((e.target as HTMLElement).closest('button')))return;pointer.current={id:e.pointerId,startX:e.clientX,startY:e.clientY,active:true};e.currentTarget.setPointerCapture(e.pointerId);}
 function pointerMove(e:React.PointerEvent<HTMLDivElement>){if(!pointer.current||pointer.current.id!==e.pointerId||!pointer.current.active)return;const delta=e.clientX-pointer.current.startX;const vertical=Math.abs(e.clientY-pointer.current.startY);if(vertical>Math.abs(delta)*1.35&&Math.abs(delta)<25)return;setDrag(Math.max(-330,Math.min(330,delta)));}
 function pointerUp(e:React.PointerEvent<HTMLDivElement>){if(!pointer.current||pointer.current.id!==e.pointerId)return;const distance=e.clientX-pointer.current.startX;pointer.current=null;if(Math.abs(distance)>95)swipe(distance>0?'right':'left');else setDrag(0)}
 function share(){const url=buildShareUrl(`${window.location.origin}${window.location.pathname}`,liked);if(!liked.length){setNotice('Like a project first');return;}navigator.clipboard?.writeText(url).then(()=>setNotice('Share link copied')).catch(()=>setNotice('Select and copy the URL from the address bar'));window.history.replaceState(null,'',new URL(url).search);}
 function openContact(){switchTab('messages')}
 const likedProjects=liked.map(id=>projects.find(p=>p.id===id)).filter((p):p is Project=>!!p);
 return <div className="app-shell">
  <aside className="sidebar">
   <div className="sidebar-top">
    <button className="brand" onClick={()=>switchTab('discover')}><span className="brand-icon"><Flame size={25} strokeWidth={2.9} fill="currentColor"/></span><span>eujin<span className="brand-period">.</span></span></button>
    <div className="sidebar-caption">THE INTERACTIVE PORTFOLIO</div>
   </div>
   <div className="sidebar-profile"><div><b>Eu Jin Tan <span className="verified">✦</span></b><small>Producer × Engineer</small></div><button aria-label="Visit profile" onClick={()=>switchTab('profile')}><ArrowUpRight size={17}/></button></div>
   <div className="sidebar-label">YOUR EXPERIENCE</div>
   <nav className="sidebar-nav" aria-label="App navigation">
    <NavButton tab="discover" current={tab} onClick={switchTab}><Flame size={21}/> Discover</NavButton>
    <NavButton tab="likes" current={tab} onClick={switchTab} count={liked.length}><Heart size={21}/> Your likes</NavButton>
    <NavButton tab="profile" current={tab} onClick={switchTab}><UserRound size={21}/> The profile</NavButton>
    <NavButton tab="messages" current={tab} onClick={switchTab}><MessageCircle size={21}/> Messages</NavButton>
   </nav>
   <div className="sidebar-extras"><div className="mini-status"><Dot/> Open to the right opportunities</div><div className="sidebar-note">Swipe through my work.<br/>Stay for the experience.</div></div>
   <div className="sidebar-footer"><span>DESIGNED TO BE SWIPED</span><span>© 2026 EU JIN</span></div>
  </aside>

  <main className="main-area">
   <header className="topbar"><div className="page-heading"><span className="topbar-mark">✳</span> {tab==='discover'?'Discover':tab==='likes'?'Your likes':tab==='profile'?'The profile':'Messages'}</div><div className="top-actions"><span className="online"><Dot/> AVAILABLE FOR PROJECTS</span><button className="top-avatar" onClick={()=>switchTab('profile')} aria-label="View profile">ej.</button></div></header>
   <div className="mobile-head"><button className="mobile-logo" onClick={()=>switchTab('discover')}><Flame size={25} fill="currentColor"/>eujin.</button><button className="top-avatar" onClick={()=>switchTab('profile')}>ej.</button></div>

   {tab==='discover'&&<div className="discover-page">
    <div className="section-intro"><div><span className="small-overline"><Sparkles size={13}/> NICE TO MEET YOU, I'M EU JIN</span><h1>Let's make <span>something click.</span></h1><p>Games. Engineering. A little bit of chaos. Swipe through my portfolio and see if we match.</p></div><div className="intro-counter"><span>0{Math.min(index+1,projects.length)}</span><span className="divider-mark">/</span><span>0{projects.length}</span><small>PROFILES TO EXPLORE</small></div></div>
    <div className="deck-zone">
     <div className="deck-column">
      <div className="deck-topline"><div><span className="pink-dot"/> DISCOVER MODE</div><span>{index<projects.length?'SWIPE TO EXPLORE':'YOU SAW IT ALL'}</span></div>
      <div className="card-stack" data-testid="card-stack">
       {current? <><div className="stack-back back-two"/><div className="stack-back back-one"/>
        <div ref={cardRef} className={`card-interactive ${direction?'card-exiting':''} ${drag!==0?'is-dragging':''}`} style={{transform:`translateX(${drag}px) rotate(${drag/24}deg)`,transition:drag!==0&&!direction?'none':'transform 280ms cubic-bezier(.22,.7,.25,1)'}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={()=>{pointer.current=null;setDrag(0)}}><ProjectCard project={current} drag={drag} stamp={direction} onDetails={()=>setDetail(current)}/></div></>
       :<div className="deck-finished"><span className="finish-emoji">✳</span><h2>That's everyone!</h2><p>Made it through the whole lineup. Want another look, or ready to see your matches?</p><button className="primary-btn" onClick={reset}><RotateCcw size={17}/> Replay deck</button><button className="plain-link" onClick={()=>switchTab('likes')}>See your likes <ArrowRight size={16}/></button></div>}
      </div>
      <div className="deck-controls"><button aria-label="Undo previous swipe" className="control-btn control-rewind" onClick={undo} disabled={history.length===0} title="Undo"><RotateCcw size={22}/></button><button aria-label="Skip to next project" className="control-btn control-pass" onClick={()=>swipe('left')} disabled={!current} title="Skip"><X size={30} strokeWidth={2.8}/></button><button aria-label="Like this project" className="control-btn control-like" onClick={()=>swipe('right')} disabled={!current} title="Like"><Heart size={29} fill="currentColor"/></button><button aria-label="Read project details" className="control-btn control-info" onClick={()=>current&&setDetail(current)} disabled={!current} title="More info"><Star size={21}/></button></div>
      <div className="keyboard-tip"><span><kbd>←</kbd> skip</span><span><kbd>→</kbd> interested</span><span className="tip-mobile">or drag the card</span></div>
     </div>
    </div>
   </div>}

   {tab==='likes'&&<div className="inner-page"><div className="view-heading"><span className="small-overline"><Heart size={14}/> THE ONES THAT CLICKED</span><h1>Your <em>likes.</em></h1><p>Those projects caught your eye. Keep them here, share your selection, or take a closer look.</p></div>
    <div className="likes-toolbar"><b>{liked.length} {liked.length===1?'project':'projects'} saved</b><button onClick={share} className="outline-btn" disabled={!liked.length}><Copy size={16}/> Copy shortlist link</button></div>
    {likedProjects.length?<div className="likes-grid">{likedProjects.map(p=><article className="liked-card" key={p.id}><div className="liked-cover" onClick={()=>setDetail(p)}><Artwork project={p}/></div><div className="liked-body"><small>{p.genre}</small><h3>{p.title}</h3><p>{p.blurb}</p><div className="liked-bottom"><button onClick={()=>setDetail(p)}>View project <ArrowUpRight size={15}/></button><button className="remove-btn" onClick={()=>setLiked(prev=>prev.filter(id=>id!==p.id))} aria-label={`Remove ${p.title} from likes`}><X size={16}/></button></div></div></article>)}</div>
    :<div className="empty-state"><div className="empty-icon"><Heart size={36}/></div><h2>No sparks yet.</h2><p>Hit the heart on anything that catches your eye. Your picks will show up here.</p><button className="primary-btn" onClick={()=>switchTab('discover')}><Flame size={17}/> Start swiping</button></div>}
    {liked.length>0&&<div className="likes-cta"><div><span className="small-overline">SOMETHING IN COMMON?</span><h3>Maybe we should talk.</h3></div><button className="primary-btn" onClick={openContact}>Say hello <ArrowUpRight size={18}/></button></div>}
   </div>}

   {tab==='profile'&&<div className="inner-page"><div className="view-heading"><span className="small-overline"><UserRound size={14}/> VERIFIED HUMAN, NOT A BOT</span><h1>The <em>profile.</em></h1><p>Everything you'd usually stalk on LinkedIn, but considerably more fun.</p></div>
    <div className="profile-layout"><div className="profile-primary"><div className="profile-banner"><div className="banner-grid"/><div className="floating-sticker">GOOD AT SHIPPING THINGS ✳</div><Portrait/></div><div className="profile-body"><div className="profile-name-row"><div><h2>{profile.name} <span className="verified">✦</span></h2><strong>{profile.role}</strong></div><span className="match-percent">98% MATCH*</span></div><div className="profile-loc">⌖ &nbsp;{profile.location}</div><p>{profile.about}</p><div className="profile-divider"/><h3>My green flags <span>(figuratively)</span></h3><div className="flag-grid"><div>✳ <span>Ships things</span></div><div>✳ <span>Understands engineers</span></div><div>✳ <span>Leads teams</span></div><div>✳ <span>Still loves games</span></div></div><small className="asterisk">*The match percentage is a design joke, not a calculated score.</small></div></div>
    <div className="profile-secondary"><div className="profile-panel"><div className="panel-heading"><BriefcaseBusiness size={18}/><h3>Career mode</h3></div><p>Producer who can talk tech. Engineer who can talk people. Choose a track:</p><div className="track-switch"><button onClick={()=>setResume('production')} className={resume==='production'?'selected':''}><BriefcaseBusiness size={16}/> Production</button><button onClick={()=>setResume('engineering')} className={resume==='engineering'?'selected':''}><Code2 size={16}/> Engineering</button></div><div className="track-content"><div className="track-head">{resume==='production'?'GAME PRODUCTION':'SOFTWARE ENGINEERING'}</div><h4>{resume==='production'?'From idea to playable.':'From systems to scale.'}</h4><p>{resume==='production'?'Game Producer at Metropolice Games, coordinating several titles, delivery schedules, technical architecture and cross-functional teams.':'Software and backend engineering background spanning architecture, infrastructure, automation, tooling and developer experience.'}</p><ul>{(resume==='production'?profile.production:profile.engineering).map(x=><li key={x}><Check size={15}/>{x}</li>)}</ul><span className="resume-note">Resume PDFs: add verified files before publishing.</span></div></div><div className="profile-panel prompt-panel"><span>THE QUESTION EVERYONE ASKS</span><h3>So, what do you actually do?</h3><p>I keep good ideas from getting lost between the design document and the build.</p><button onClick={()=>switchTab('messages')}>Ask me something <ArrowUpRight size={16}/></button></div></div></div>
   </div>}

   {tab==='messages'&&<div className="inner-page messages-page"><div className="view-heading"><span className="small-overline"><MessageCircle size={14}/> SLIDE INTO MY INBOX</span><h1>It's a <em>match.</em></h1><p>No awkward openers necessary. Let's build something interesting.</p></div><div className="chat-card"><div className="chat-header"><Portrait/><div><b>Eu Jin Tan <span className="verified">✦</span></b><small><Dot/> Typically open to good conversations</small></div><span className="chat-menu"><Settings2 size={20}/></span></div><div className="chat-messages"><div className="date-label">TODAY · THE BEGINNING OF SOMETHING GOOD</div><div className="chat-bubble incoming">Hey! Thanks for checking out my work <span>✳</span></div><div className="chat-bubble incoming">Whether it's a game, a product, or a tricky technical problem — I'd love to hear what you're building.</div><div className="chat-bubble outgoing">I think we should talk about a project!</div><div className="typing-row"><span/><span/><span/></div></div><div className="chat-compose"><div className="compose-placeholder">Have an idea? Let's talk about it...</div><button onClick={()=>{if(liked.length)share();else setNotice('Like projects to create a shareable shortlist')}} title="Copy your project shortlist"><Heart size={18}/></button><a href={linkedin} target="_blank" rel="noopener noreferrer" className="send-button" title="Open LinkedIn profile" aria-label="Connect on LinkedIn"><Send size={18}/></a></div><div className="contact-links"><a href={linkedin} target="_blank" rel="noopener noreferrer"><ExternalLink size={17}/> Continue on LinkedIn</a><span>Public email to be confirmed before launch</span></div></div></div>}
  </main>
  <nav className="mobile-nav" aria-label="Mobile app navigation"><NavButton tab="discover" current={tab} onClick={switchTab}><Flame size={24}/><span>Explore</span></NavButton><NavButton tab="likes" current={tab} onClick={switchTab} count={liked.length}><Heart size={24}/><span>Likes</span></NavButton><NavButton tab="profile" current={tab} onClick={switchTab}><UserRound size={24}/><span>Profile</span></NavButton><NavButton tab="messages" current={tab} onClick={switchTab}><MessageCircle size={24}/><span>Chat</span></NavButton></nav>
  {detail&&<div className="modal-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)setDetail(null)}}><section role="dialog" aria-modal="true" aria-label={`${detail.title} project details`} className="detail-modal"><button className="modal-close" aria-label="Close project details" onClick={()=>setDetail(null)}><X size={21}/></button><div className="modal-cover"><Artwork project={detail}/></div><div className="modal-content"><span className="small-overline">{detail.genre}</span><h2>{detail.title}</h2><div className="modal-tags">{detail.tags.map(t=><span key={t}>{t}</span>)}</div><p>{detail.about}</p><div className="modal-stat"><b>Project note</b><span>{detail.fact}</span></div><div className="modal-buttons">{detail.link&&<a className="outline-btn" href={detail.link} target="_blank" rel="noopener noreferrer">Steam page <ExternalLink size={17}/></a>}<button className="primary-btn" onClick={()=>{setLiked(prev=>prev.includes(detail.id)?prev:[...prev,detail.id]);setNotice(`${detail.title} saved`);setDetail(null)}}><Heart size={17}/> Save project</button></div><small className="authenticity-note">Visual: designed placeholder; genuine screenshots to be added. Project information pending final editorial review.</small></div></section></div>}
  {notice&&<div className="toast" role="status"><Check size={17}/>{notice}</div>}
 </div>
}
