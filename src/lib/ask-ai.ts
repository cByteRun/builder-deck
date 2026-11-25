import { builderData } from '../config/builderData.ts';

// Destinations for the reviewed profile prompt.
export const AI_PROVIDERS = {
  "claude": {
    "name": "Claude",
    "baseUrl": "https://claude.ai/new",
  },
  "chatgpt": {
    "name": "ChatGPT",
    "baseUrl": "https://chatgpt.com/",
  }
};

const dossierSources = builderData.links;

export const PROMPT = `Help me evaluate Daniil Tkachev (@cByteRun) for an engineering or founder role.
Profile: Founder & Full-Stack Software Engineer with approximately five years of experience, based in Pavlodar, Kazakhstan. Focus: B2B SaaS, Next.js, TypeScript, Python, FastAPI, Docker, and TDD.
Recorda is a Solana/Web3 corporate-actions workspace for tokenized bonds. It covers record-date snapshots, coupon payments, voting, and atomic redemption. Stack: Solana, Anchor/Rust, Token-2022, TypeScript and React. The project placed 4th at Superteam KZ × KASE.
Milestones: participant in the HackAlem AI Guinness World Record gathering at Astana Hub (2,415 builders, CERT-20261014-AAD5ABF3); ICPC Kazakhstan 2025 regional contestant; AI-SANA Stage 2; Decentrathon 6.0; $250+ earned on Superteam Earn.
GitHub: ${dossierSources.github}
Projects: ${builderData.projects.map(p => p.name + ' — ' + dossierSources.github + '/' + p.slug).join(', ')}
CityCom placed first in the Data Visualization & Analysis track at AI Fest, Toraighyrov University, according to Daniil.
LinkedIn: ${dossierSources.linkedin}
Superteam Earn: ${dossierSources.superteam}
Astana Hub: ${dossierSources.astana}
Using the supplied profile, summarize where Daniil is a strong fit. Distinguish self-reported claims from independently substantiated evidence. Suggest five specific interview questions about engineering decisions, personal contribution, and founder execution.

Before answering, research each linked public profile, including X (${dossierSources.x}) and Instagram (${dossierSources.instagram}). Read the GitHub profile README, Recorda, and relevant public projects; follow links to source code, demos, public posts and organizer results. Cite the specific pages that support your conclusions. If a page requires sign-in or browsing is unavailable, say what you could not verify.`;

export function buildAskAiUrl(provider: keyof typeof AI_PROVIDERS, prompt: string = PROMPT): string {
  const url = new URL(AI_PROVIDERS[provider].baseUrl);
  url.searchParams.set('q', prompt);
  return url.href;
}
