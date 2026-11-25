export const links = {
  github: 'https://github.com/cByteRun',
  avatar: 'https://avatars.githubusercontent.com/u/191118724?v=4&s=96',
  x: 'https://x.com/Den4kD77967',
  linkedin: 'https://www.linkedin.com/in/daniil-tkachev-2b2970363/',
  superteam: 'https://superteam.fun/earn/t/protective-fuchsia-78',
  astana: 'https://astanahub.com/account/v2/user/688521/profile/activity/',
  instagram: 'https://www.instagram.com/tkachevd228/',
  repos: 'https://github.com/cByteRun?tab=repositories', builds: 'https://github.com/search?q=user%3AcByteRun+hackathon&type=repositories',
  chatgpt: 'https://chatgpt.com/', claude: 'https://claude.ai/new',
  lichess: 'https://lichess.org', publicProjects: 'https://api.github.com/users/cByteRun/repos?type=owner&sort=created&direction=desc&per_page=100'
};
const project = {
  name: 'Recorda', category: 'Corporate actions infrastructure', repo: 'https://github.com/cByteRun/recorda-solana',
  demo: 'https://recorda-solana.vercel.app/',
  docs: 'https://github.com/cByteRun/recorda-solana/blob/main/docs/BONDOPS-OPERATIONS.md',
  summary: 'A servicing workspace for tokenized bonds on Solana. Automates record-date snapshots, coupon payments, bondholder voting and atomic redemption with verifiable on-chain receipts.',
  stack: ['Solana','Anchor / Rust','Token-2022','TypeScript','React'],
  pipeline: ['Record Date','Entitlements','Phantom Auth','On-Chain Proof']
};

export const products = [
  { ...project, id:'recorda', tab:'Recorda', badge:'4th Place · Superteam KZ × KASE', icons:['camera','calc','key','receipt'], secondary:'Deployment notes', accent:'copper' },
  { id:'city', name:'city-com', tab:'city-com', category:'AI-native urban & data platform', badge:'Top 1 Visualization · AI Fest (Toraighyrov University)',
    summary:'A TypeScript workspace for city feedback in Pavlodar. Explore public reports in Kazakh and Russian, trace priority scores to their sources, and see which department owns each case.',
    stack:['Next.js','TypeScript','Recharts','SQLite'],pipeline:['Public reports','RU / KZ analysis','Priority scores','City dashboards'],icons:['globe','chip','calc','grid'],
    repo:links.github+'/city-com',docs:links.github+'/city-com#сценарий-демонстрации',secondary:'Demo walkthrough',accent:'jade' },
  { id:'wallet', name:'wooppay-wallet-web',tab:'Wooppay Wallet',category:'AI-search-ready web wallet',badge:'FinTech & Web3 Concept',
    summary:'A search-ready concept for Wooppay Wallet. Next.js and TypeScript deliver localized wallet pages with structured metadata, canonical URLs and indexing controls.',
    stack:['Next.js','TypeScript','App Router','SEO'],pipeline:['Wallet pages','Localization','Structured data','SEO checks'],icons:['layers','globe','chip','receipt'],
    repo:links.github+'/wooppay-wallet-web',demo:'https://wooppay-wallet-web.vercel.app/',docs:links.github+'/wooppay-wallet-web#readme',secondary:'Run locally',accent:'violet' }
];

export const achievements = [
  {title:'AI Fest · city-com',category:'Wins',platform:'astana',label:'AI Fest',metric:'Top 1 visualization',summary:'Data visualization track at Toraighyrov University. Explore the project repository.',url:products[1].repo},
  {title:'Recorda · Superteam KZ × KASE',category:'Wins',platform:'superteam',label:'Superteam KZ',metric:'4th place',summary:'Tokenized bond servicing on Solana. Open the Recorda repository.',url:project.repo},
  {title:'Superteam Earn bounties',category:'Wins',platform:'superteam',metric:'$250+ earned',summary:'Public builder profile and bounty earnings.',url:links.superteam},
  {title:'HackAlem AI · Guinness gathering',category:'Wins',platform:'astana',metric:'2,415 builders',summary:'Participant at Astana Hub. Credential CERT-20261014-AAD5ABF3.',url:links.astana},
  {title:'Decentrathon 4.0',category:'Wins',platform:'astana',metric:'19 cities',summary:'National hackathon across Kazakhstan. Astana Hub activity profile.',url:links.astana},
  {title:'ICPC Kazakhstan',category:'Wins',platform:'linkedin',metric:'2025 regional contestant',summary:'Competitive programming participation. Career profile.',url:links.linkedin},
  {title:'AI-SANA',category:'Wins',platform:'astana',metric:'Stage 2',summary:'Credential f42775b5-d32a-4dde-bb8e-f5b3d892738f. Astana Hub profile.',url:links.astana},
  {title:'Build in public',category:'Media',platform:'x',metric:'@Den4kD77967',summary:'Public profile for project notes and builder updates.',url:links.x},
  {title:'Engineering & career',category:'Media',platform:'linkedin',metric:'5y experience',summary:'Career history and public professional updates.',url:links.linkedin},
  {title:'Hackathons & life',category:'Media',platform:'instagram',metric:'@tkachevd228',summary:'Personal profile for events and behind-the-scenes photos.',url:links.instagram}
];
