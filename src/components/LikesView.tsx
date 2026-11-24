import { track } from '../lib/analytics';

import { ArrowUpRight, Copy, Flame, Heart, X } from 'lucide-react';
import { type Project } from "../data/portfolio";
import { Artwork, type Tab } from "./shared";
export function LikesView({ liked, likedProjects, share, setDetail, setLiked, switchTab, openContact }: { liked: string[]; likedProjects: Project[]; share: () => void; setDetail: (p: Project) => void; setLiked: React.Dispatch<React.SetStateAction<string[]>>; switchTab: (t: Tab) => void; openContact: () => void }) {
    return <div className="inner-page"><div className="view-heading"><span className="small-overline"><Heart size={14} /> THE ONES THAT CLICKED</span><h1>Your <em>likes.</em></h1><p>Those projects caught your eye. Keep them here, share your selection, or take a closer look.</p></div>
        <div className="likes-toolbar"><b>{liked.length} {liked.length === 1 ? 'project' : 'projects'} saved</b><button onClick={share} className="outline-btn" disabled={!liked.length}><Copy size={16} /> Copy shortlist link</button></div>
        {likedProjects.length ? <div className="likes-grid">{likedProjects.map(p => <article className="liked-card" key={p.id}><div className="liked-cover" onClick={() => setDetail(p)}><Artwork project={p} /></div><div className="liked-body"><small>{p.genre}</small><h3>{p.title}</h3><p>{p.blurb}</p><div className="liked-bottom"><button onClick={() => setDetail(p)}>View project <ArrowUpRight size={15} /></button><button className="remove-btn" onClick={() => { track('project_removed', { project_id: p.id }); setLiked(prev => prev.filter(id => id !== p.id)) }} aria-label={`Remove ${p.title} from likes`}><X size={16} /></button></div></div></article>)}</div>
            : <div className="empty-state"><div className="empty-icon"><Heart size={36} /></div><h2>No sparks yet.</h2><p>Hit the heart on anything that catches your eye. Your picks will show up here.</p><button className="primary-btn" onClick={() => switchTab('discover')}><Flame size={17} /> Start swiping</button></div>}
        {liked.length > 0 && <div className="likes-cta"><div><span className="small-overline">SOMETHING IN COMMON?</span><h3>Maybe we should talk.</h3></div><button className="primary-btn" onClick={openContact}>Say hello <ArrowUpRight size={18} /></button></div>}
    </div>;
}
