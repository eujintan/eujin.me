import { track } from '../lib/analytics';
import { useState } from "react";
import { BriefcaseBusiness, Info } from 'lucide-react';
import type { Project } from "../data/portfolio";
export type Tab = "discover" | "likes" | "profile" | "messages";
export type Direction = "left" | "right";
export function Portrait() { return <div className="portrait" aria-hidden="true"><span>ej<span className="portrait-period">.</span></span></div> }
function PlaceholderArtwork({ project, background = false }: { project: Project; background?: boolean }) {
    return <div className={`artwork artwork-${project.color} ${background ? 'artwork-background' : ''}`} aria-label={`${project.title} stylized placeholder artwork`}>
        <div className="noise" /><div className="art-corners"><span>EST. IN PRODUCTION</span><span>MPG / {project.id.toUpperCase()}</span></div>
        <div className="art-stage"><span className="art-echo">{project.motif}</span><span className="art-hero">{project.motif}</span></div>
        <div className="art-foot"><span className="art-dash" /><span>{project.stamp}</span></div>
    </div>
}
export function Dot() { return <span className="live-dot" /> }
export function ProjectCard({ project, onDetails, drag, stamp }: { project: Project; onDetails: () => void; drag: number; stamp: Direction | null }) {
    return <div className="project-card">
        <Gallery project={project} />
        <div className="card-cover-gradient" />
        {stamp && <div className={`swipe-stamp swipe-stamp-${stamp}`}>{stamp === 'right' ? 'LIKE' : 'NEXT'}</div>}
        {!stamp && Math.abs(drag) > 38 && <div className={`swipe-stamp swipe-stamp-${drag > 0 ? 'right' : 'left'}`} style={{ opacity: Math.min(1, Math.abs(drag) / 125) }}>{drag > 0 ? 'LIKE' : 'NEXT'}</div>}
        <div className="card-content">
            <div className="eyebrow-light">{project.genre}</div>
            <h2>{project.title}<span className="card-spark">✳</span></h2>
            <p>{project.blurb}</p>
            <div className="card-bottom"><span className="role-chip"><BriefcaseBusiness size={13} />{project.role}</span><button className="detail-dot" aria-label={`Read more about ${project.title}`} onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onDetails(); }}><Info size={21} /></button></div>
        </div>
    </div>
}

export function NavButton({ tab, current, onClick, children, count }: { tab: Tab; current: Tab; onClick: (tab: Tab) => void; children: React.ReactNode; count?: number }) { return <button className={`nav-item ${current === tab ? 'active' : ''}`} onClick={() => onClick(tab)} aria-current={current === tab ? 'page' : undefined}>{children}{count !== undefined && count > 0 && <span className="nav-count">{count}</span>}</button> }

export function Artwork({ project }: { project: Project }) { return <Gallery project={project} interactive={false} />; }
export function Gallery({ project, interactive = true }: { project: Project; interactive?: boolean }) {
    const [index, setIndex] = useState(0); const [failed, setFailed] = useState<string[]>([]); const images = (project.images ?? []).filter(i => !failed.includes(i.src));
    if (!images.length) return <PlaceholderArtwork project={project} />;
    const item = images[index % images.length];
    return <div className="game-gallery"><img src={item.src} alt={item.alt} draggable={false} onError={() => setFailed(prev => [...prev, item.src])} />{interactive && images.length > 1 && <div className="gallery-nav" onPointerDown={e => e.stopPropagation()}><button aria-label="Previous screenshot" onClick={() => { track('screenshot_browsed', { project_id: project.id, direction: 'previous' }); setIndex(i => (i + images.length - 1) % images.length); }}>‹</button><span>{index % images.length + 1} / {images.length}</span><button aria-label="Next screenshot" onClick={() => { track('screenshot_browsed', { project_id: project.id, direction: 'next' }); setIndex(i => (i + 1) % images.length); }}>›</button></div>}</div>
}
