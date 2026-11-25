type Project = {
  id: string; name: string; slug: string; category: string; summary: string;
  stack: string[]; language: string; stars: number; commitDate: string; commit: string;
  result: string; context: string; docs: string; proof?: string;
};
type Credential = {
  id: string; name: string; result: string; context: string; date: string; role: string;
  source: string; url?: string; serial?: string; hash?: string; icon: string;
};
type FeedEntry = {
  group: 'git' | 'wins' | 'social'; title: string; detail: string; source: string;
  date: string; icon: string; url?: string; proof?: string;
};

const githubUsername = 'cByteRun';
const github = 'https://github.com/' + githubUsername;
const profile = {
  name: 'Daniil Tkachev', handle: '@' + githubUsername, role: 'Full-Stack Software Engineer',
  location: 'Pavlodar, KZ', timezone: 'Asia/Almaty', email: '191118724+cByteRun@users.noreply.github.com',
  stack: ['TypeScript', 'React / Next.js', 'Node.js', 'Python', 'Solana / Web3', 'AI Agents'],
};
const links = {
  github, repos: github + '?tab=repositories',
  linkedin: 'https://www.linkedin.com/in/daniil-tkachev-2b2970363/',
  superteam: 'https://superteam.fun/earn/t/protective-fuchsia-78',
  astana: 'https://astanahub.com/account/v2/user/688521/profile/activity/',
  instagram: 'https://www.instagram.com/tkachevd228/', x: 'https://x.com/Den4kD77967',
  lichess: 'https://lichess.org', chatgpt: 'https://chatgpt.com/', claude: 'https://claude.ai/new',
};
const cityCom: Project =
  {
    id:'city', name:'CityCom', slug:'city-com', category:'Civic technology',
    summary:'Turns public reports from Pavlodar into a bilingual issues dashboard. City staff review urgency, assign a department and track each case.',
    stack:['Next.js','TypeScript','Recharts'], language:'TypeScript', stars:0, commitDate:'2026-10-31', commit:'f652d16c3af75e696c6f3e680d5007c6dd1c5090',
    result:'1st place', context:'AI Fest · Data Visualization & Analysis', docs:'/blob/main/README.md', proof:'city',
  };
const recorda: Project = {
    id:'sol', name:'Recorda', slug:'recorda-solana', category:'Financial infrastructure',
    summary:'Fixes bondholder rights at the record date, then handles coupon payments, votes and redemptions on Solana with an auditable receipt.',
    stack:['Solana','Anchor / Rust','TypeScript'], language:'TypeScript', stars:0, commitDate:'2026-10-13', commit:'8c9dbda557ff13d0da49c985b18dc7a103407109',
    result:'4th place', context:'Superteam KZ × KASE track', docs:'/blob/main/docs/BONDOPS-OPERATIONS.md', proof:'sol',
  };
const tomorrowTOU: Project = {
    id:'tou', name:'TomorrowTOU', slug:'tomorrow-tou', category:'Education software',
    summary:'A desktop workspace for university staff, lecturers and students. Role-based access connects schedules, attendance, grades and reports.',
    stack:['JavaFX','Spring Boot','PostgreSQL'], language:'Java', stars:0, commitDate:'2026-10-11', commit:'b4df289940aebb63065ea74febf75db095747042',
    result:'Runnable build', context:'Java desktop client + REST API', docs:'/blob/main/README.md',
  };
// Pin or reorder projects here. Milestones keep their original source.
const projects: Project[] = [cityCom, recorda, tomorrowTOU];
const repoUrl = (p: Project) => github + '/' + p.slug;
const credentials: Credential[] = [
  {id:'city',name:'AI Fest · CityCom',result:'1st place',context:'Data Visualization & Analysis track at Toraighyrov University, Pavlodar. Placement reported by Daniil.',date:'2026',role:'CityCom builder',source:'Project repository',url:repoUrl(cityCom),icon:'trophy'},
  {id:'sol',name:'Colosseum × KASE',result:'4th place',context:'Recorda / BondOps in the Superteam KZ × KASE track. Placement reported by Daniil.',date:'2026',role:'Recorda builder',source:'Project repository',url:repoUrl(recorda),icon:'layers'},
  {id:'hack',name:'HackAlem AI',result:'Guinness World Record participant',context:'Joined 2,415 builders at the Astana Hub gathering.',date:'14 Oct 2026',role:'Participant',serial:'CERT-20261014-AAD5ABF3',source:'Astana Hub profile',url:links.astana,icon:'globe'},
  {id:'earn',name:'Superteam Earn',result:'$250+ earned',context:'Solana ecosystem contributions under @protective-fuchsia-78.',date:'As of Nov 2026',role:'Solana builder',source:'Earn profile',url:links.superteam,icon:'layers'},
  {id:'decent',name:'Decentrathon 6.0',result:'19-city event',context:'Astana Hub × BAITC. The event spanned 19 cities in Kazakhstan.',date:'2026',role:'Participant',source:'Astana Hub profile',url:links.astana,icon:'bolt'},
  {id:'sana',name:'AI-SANA',result:'Stage 2',context:'Intelligent Tech & Entrepreneurial Thinking.',date:'Date not supplied',role:'Program participant',serial:'f42775b5-d32a-4dde-bb8e-f5b3d892738f',source:'Credential ID supplied by Daniil',icon:'chip'},
  {id:'icpc',name:'ICPC Kazakhstan 2025',result:'Regional contestant',context:'2025–ICPC Kazakhstan RC · Regional programming contest.',date:'2025',role:'Contestant',source:'Professional profile',url:links.linkedin,icon:'terminal'},
];
const feedPosts: FeedEntry[] = [
  {group:'wins',title:'CityCom takes first in data visualization',detail:'AI Fest · Toraighyrov University',source:'AI Fest',date:'2026',proof:'city',icon:'trophy'},
  {group:'git',title:'CityCom adds social source connections',detail:'CityCom · f652d16',source:'GitHub',date:'31 Oct 2026',url:repoUrl(cityCom)+'/commit/'+cityCom.commit,icon:'branch'},
  {group:'wins',title:'Joined the HackAlem AI record gathering',detail:'2,415 builders · Astana Hub',source:'Astana Hub',date:'14 Oct 2026',proof:'hack',icon:'globe'},
  {group:'git',title:'Recorda merges a fix for deep links',detail:'Recorda · Pull request #3',source:'GitHub',date:'13 Oct 2026',url:repoUrl(recorda)+'/commit/'+recorda.commit,icon:'branch'},
  {group:'git',title:'TomorrowTOU publishes its university workspace',detail:'TomorrowTOU · b4df289',source:'GitHub',date:'11 Oct 2026',url:repoUrl(tomorrowTOU)+'/commit/'+tomorrowTOU.commit,icon:'terminal'},
  {group:'wins',title:'Recorda places fourth in the KASE track',detail:'Tokenized bond servicing · Superteam KZ',source:'Superteam KZ',date:'2026',proof:'sol',icon:'layers'},
];
const stickers = [
  {id:'hack',label:'HackAlem AI',angle:-11},{id:'sol',label:'Colosseum × KASE',angle:9},
  {id:'city',label:'AI Fest · CityCom',angle:-8},{id:'icpc',label:'ICPC Kazakhstan',angle:9},{id:'ship',label:'Ship it!',angle:-12}
];
export const builderData = {profile, links, projects, credentials, feedPosts, stickers};
