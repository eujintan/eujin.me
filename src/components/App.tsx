import { track, type Consent } from '../lib/analytics';
import { AnalyticsConsent } from './AnalyticsConsent';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Flame, Heart, MessageCircle, UserRound } from 'lucide-react';
import { projects, type Project } from '../data/portfolio';
import { buildShareUrl } from '../lib/likes';
import { Dot, NavButton, type Tab } from './shared';
import { useLikes } from '../hooks/useLikes';
import { useSwipe } from '../hooks/useSwipe';
import { ProjectProfile } from './ProjectProfile';
import { ProfileView } from './ProfileView';
import { MessagesView } from './MessagesView';
import { DiscoverView } from './DiscoverView';
import { LikesView } from './LikesView';
const ids = projects.map(p => p.id);
export default function App() {
    const [tab, setTab] = useState<Tab>('discover');
    const [detail, setDetail] = useState<Project | null>(null);
    const [notice, setNotice] = useState('');
    const [analyticsConsent, setAnalyticsConsent] = useState<Consent>(null);
    useEffect(() => { if (analyticsConsent === 'accepted') track('$pageview', {}); }, [analyticsConsent]);
    useEffect(() => { if (analyticsConsent === 'accepted') track('screen_viewed', { screen: tab }); }, [tab, analyticsConsent]);
    useEffect(() => { if (analyticsConsent === 'accepted' && detail) track('project_opened', { project_id: detail.id }); }, [detail, analyticsConsent]);
    const { liked, setLiked } = useLikes(ids);
    const { index, current, history, direction, drag, swipe, undo, reset, pointerDown, pointerMove, pointerUp, cancelPointer } = useSwipe({ projects, liked, setLiked, enabled: tab === 'discover' && !detail, setNotice });
    useEffect(() => { if (analyticsConsent === 'accepted' && tab === 'discover' && current && !detail) track('project_impression', { project_id: current.id }); }, [analyticsConsent, tab, current, detail]);
    useEffect(() => { if (!notice) return; const t = window.setTimeout(() => setNotice(''), 2600); return () => window.clearTimeout(t) }, [notice]);
    function switchTab(next: Tab) { setTab(next); setDetail(null); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
    useEffect(() => { const id = new URLSearchParams(window.location.search).get('project'); const found = projects.find(p => p.id === id); if (found) setDetail(found); if (new URLSearchParams(window.location.search).has('liked')) setTab('likes'); }, []);
    function share() { const url = buildShareUrl(`${window.location.origin}${window.location.pathname}`, liked); if (!liked.length) { setNotice('Like a project first'); return; } track('shortlist_share_requested', { count: liked.length }); if (!navigator.clipboard) { window.history.replaceState(null, '', url); setNotice('Copy the URL from your address bar'); return; } navigator.clipboard.writeText(url).then(() => setNotice('Share link copied')).catch(() => setNotice('Select and copy the URL from the address bar')); window.history.replaceState(null, '', new URL(url).search); }
    function openContact() { switchTab('messages') }
    const likedProjects = liked.map(id => projects.find(p => p.id === id)).filter((p): p is Project => !!p);
    return <div className="app-shell">
        <aside className="sidebar">
            <div className="sidebar-top">
                <button className="brand" onClick={() => switchTab('discover')}><span className="brand-icon"><Flame size={25} strokeWidth={2.9} fill="currentColor" /></span><span>eujin<span className="brand-period">.</span>me</span></button>
                <div className="sidebar-caption">THE INTERACTIVE PORTFOLIO</div>
            </div>
            <div className="sidebar-profile"><div><b>Eu Jin Tan <span className="verified">✦</span></b><small>Producer × Engineer</small></div><button aria-label="Visit profile" onClick={() => switchTab('profile')}><ArrowUpRight size={17} /></button></div>
            <div className="sidebar-label">YOUR EXPERIENCE</div>
            <nav className="sidebar-nav" aria-label="App navigation">
                <NavButton tab="discover" current={tab} onClick={switchTab}><Flame size={21} /> Discover</NavButton>
                <NavButton tab="likes" current={tab} onClick={switchTab} count={liked.length}><Heart size={21} /> Your likes</NavButton>
                <NavButton tab="profile" current={tab} onClick={switchTab}><UserRound size={21} /> The profile</NavButton>
                <NavButton tab="messages" current={tab} onClick={switchTab}><MessageCircle size={21} /> Messages</NavButton>
            </nav>
            <div className="sidebar-extras"><div className="mini-status"><Dot /> Open to the right opportunities</div><div className="sidebar-note">Swipe through my work.<br />Stay for the experience.</div></div>
            <div className="sidebar-footer"><span>DESIGNED TO BE SWIPED</span><span>© 2026 EU JIN</span></div>
        </aside>

        <main className="main-area">
            <header className="topbar"><div className="page-heading"><span className="topbar-mark">✳</span> {tab === 'discover' ? 'Discover' : tab === 'likes' ? 'Your likes' : tab === 'profile' ? 'The profile' : 'Messages'}</div><div className="top-actions"><span className="online"><Dot /> AVAILABLE FOR PROJECTS</span><button className="top-avatar" onClick={() => switchTab('profile')} aria-label="View profile">ej.</button></div></header>
            <div className="mobile-head"><button className="mobile-logo" onClick={() => switchTab('discover')}><Flame size={25} fill="currentColor" />eujin.</button><button className="top-avatar" onClick={() => switchTab('profile')}>ej.</button></div>

            {tab === 'discover' && <DiscoverView index={index} current={current} history={history} direction={direction} drag={drag} swipe={swipe} undo={undo} reset={reset} pointerDown={pointerDown} pointerMove={pointerMove} pointerUp={pointerUp} cancelPointer={cancelPointer} setDetail={setDetail} switchTab={switchTab} />}
            {tab === 'likes' && <LikesView liked={liked} likedProjects={likedProjects} share={share} setDetail={setDetail} setLiked={setLiked} switchTab={switchTab} openContact={openContact} />}
            {tab === 'profile' && <ProfileView switchTab={switchTab} />}
            {tab === 'messages' && <MessagesView liked={liked} share={share} setNotice={setNotice} />}
        </main>
        <nav className="mobile-nav" aria-label="Mobile app navigation"><NavButton tab="discover" current={tab} onClick={switchTab}><Flame size={24} /><span>Explore</span></NavButton><NavButton tab="likes" current={tab} onClick={switchTab} count={liked.length}><Heart size={24} /><span>Likes</span></NavButton><NavButton tab="profile" current={tab} onClick={switchTab}><UserRound size={24} /><span>Profile</span></NavButton><NavButton tab="messages" current={tab} onClick={switchTab}><MessageCircle size={24} /><span>Chat</span></NavButton></nav>
        {detail && <ProjectProfile key={detail.id} project={detail} close={() => setDetail(null)} save={() => { track('project_saved', { project_id: detail.id }); setLiked(prev => prev.includes(detail.id) ? prev : [...prev, detail.id]); setNotice(`${detail.title} saved`); setDetail(null) }} />}
        <AnalyticsConsent onChoice={setAnalyticsConsent} />
        {notice && <div className="toast" role="status"><Check size={17} />{notice}</div>}
    </div>
}
