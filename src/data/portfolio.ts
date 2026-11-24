export type Project = {
  id: string; title: string; genre: string; role: string; blurb: string; about: string;
  tags: string[]; color: string; motif: string; stamp: string; link?: string; fact: string;
};
export const projects: Project[] = [
 {id:'train-404',title:'Train 404',genre:'CO-OP SURVIVAL HORROR',role:'GAME PRODUCER',blurb:'Last train out. First-class nightmare.',about:'A co-operative survival-horror runner developed by Metropolice Games. I coordinated cross-functional production planning, technical dependencies and development priorities.',tags:['Co-op','Survival Horror','Production'],color:'train',motif:'404',stamp:'NEXT STOP: UNKNOWN',fact:'Team-driven survival experience',link:'https://store.steampowered.com/app/4539710/'},
 {id:'wam',title:'W.A.M',genre:'SURVEILLANCE HORROR SHOOTER',role:'GAME PRODUCER',blurb:'Keep watching. Something is watching back.',about:'A surveillance-based horror shooter combining observation mechanics, tactical combat and atmospheric tension. I oversaw production planning and technical coordination across disciplines.',tags:['Surveillance','Shooter','Horror'],color:'wam',motif:'REC',stamp:'YOU ARE BEING WATCHED',fact:'~10-month production (confirm)' ,link:'https://store.steampowered.com/app/4603550/'},
 {id:'last-draft',title:'Last Draft',genre:'TYPING PSYCHOLOGICAL HORROR',role:'GAME PRODUCER',blurb:'Every keystroke is a bad decision.',about:'A typing-driven psychological horror project. I supported production planning, technical architecture and cross-functional development around its unusual core interaction.',tags:['Typing','Psychological','Experimental'],color:'draft',motif:'_ |',stamp:'THE END? NOT YET',fact:'Typing as the central mechanic',link:'https://store.steampowered.com/app/4536290/'},
 {id:'ramen',title:'Totally Normal Ramen',genre:'SCI-FI COOKING SIM',role:'GAME PRODUCER',blurb:'The noodles are normal. Probably.',about:'An unconventional sci-fi cooking simulation. Alongside production and technical coordination, I led two interns who later continued on the project as contractors.',tags:['Cooking Sim','Sci-fi','Mentorship'],color:'ramen',motif:'🍜',stamp:'100% NORMAL. TRUST US.',fact:'Led and mentored 2 interns'}
];
export const linkedin='https://www.linkedin.com/in/eujin-tan/';
export const profile = {
 name:'Eu Jin Tan', role:'Game Producer × Engineer', location:'Malaysia · Open to global opportunities',
 intro:'I build games, unblock teams, and make complex systems behave. 8+ years across software engineering and game production.',
 about:'Engineer by foundation. Producer by profession. I work at the intersection of technical architecture, production planning, and creative delivery — turning ambitious ideas into things people can actually play.',
 production:['Production planning & milestone ownership','Cross-discipline development coordination','Team leadership and mentorship','Technical production and architecture'],
 engineering:['Backend and web engineering','Developer experience and tooling','Infrastructure: AWS, Perforce and automation','Technical leadership and systems design']
};
