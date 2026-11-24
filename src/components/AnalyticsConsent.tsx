import {useEffect,useState} from 'react';
import {available,readConsent,setConsent,type Consent} from '../lib/analytics';
export function AnalyticsConsent({onChoice}:{onChoice:(value:Consent)=>void}){
 const [ready,setReady]=useState(false),[choice,setChoice]=useState<Consent>(null),[open,setOpen]=useState(false);
 useEffect(()=>{if(!available())return;const saved=readConsent();setReady(true);setChoice(saved);setOpen(saved===null);setConsent(saved);onChoice(saved);},[]);
 function choose(value:Consent){setConsent(value);setChoice(value);setOpen(false);onChoice(value);}
 if(!ready)return null;
 return <div className="analytics-settings"><button className="analytics-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>Privacy settings</button>{open&&<section className="analytics-panel" aria-label="Analytics preferences"><strong>Help improve this portfolio</strong><p>Optional PostHog analytics measure project swipes, navigation and contact clicks using a browser identifier. Message drafts are not included. Cloudflare may separately measure site traffic and performance. You can change your choice here at any time.</p><a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">PostHog privacy policy</a><div><button onClick={()=>choose('declined')}>Decline</button><button onClick={()=>choose('accepted')}>Allow analytics</button></div>{choice&&<small>Current choice: {choice}</small>}</section>}</div>;
}
