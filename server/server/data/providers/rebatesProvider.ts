/**
 * WA Government Rebates & Concessions Provider
 * Official State Government concessions and utility hardship rebates catalog.
 */

import { createProvenance, type ProvenanceWrapper } from "../provenance";

export interface WARebateItem {
  id: string;
  title: string;
  provider: string;
  category: "electricity" | "water" | "rates" | "family" | "seniors" | "gas";
  maxAnnualValue: number;
  description: string;
  eligibility: string[];
  officialUrl: string;
}

const OFFICIAL_WA_REBATES: WARebateItem[] = [
  {
    id: "wa-energy-assistance",
    title: "WA Energy Assistance Payment (EAP)",
    provider: "Synergy / Horizon Power",
    category: "electricity",
    maxAnnualValue: 326.10,
    description: "Annual credit for eligible concession card holders applied directly to electricity bills.",
    eligibility: ["Centrelink Health Care Card", "Pensioner Concession Card", "DVA Gold Card"],
    officialUrl: "https://www.wa.gov.au/service/community-support/grants-and-subsidies/energy-concessions",
  },
  {
    id: "hugs-grant",
    title: "Hardship Utilities Grant Scheme (HUGS)",
    provider: "WA Department of Communities",
    category: "electricity",
    maxAnnualValue: 580.00,
    description: "Financial assistance for WA households facing financial hardship and utility disconnection.",
    eligibility: ["WA resident", "Facing hardship", "Completed utility financial assessment"],
    officialUrl: "https://www.wa.gov.au/service/community-support/grants-and-subsidies/hardship-utilities-grant-scheme",
  },
  {
    id: "synergy-dependent-child",
    title: "Dependent Child Rebate",
    provider: "Synergy",
    category: "electricity",
    maxAnnualValue: 340.00,
    description: "Additional electricity rebate for families with dependent children holding eligible concession cards.",
    eligibility: ["Health Care Card or Pensioner Card", "Dependent children living at home"],
    officialUrl: "https://www.synergy.net.au/Your-home/Manage-account/Concessions",
  },
  {
    id: "water-corp-concession",
    title: "WA Water Service Concession",
    provider: "Water Corporation WA",
    category: "water",
    maxAnnualValue: 450.00,
    description: "Up to 50% discount on annual water service charges and usage allowances.",
    eligibility: ["WA Seniors Card", "Pensioner Concession Card"],
    officialUrl: "https://www.watercorporation.com.au/Pay-account/Concessions-and-rebates",
  },
  {
    id: "wa-seniors-card-rebate",
    title: "WA Seniors Card Safety & Security Rebate",
    provider: "WA Government",
    category: "seniors",
    maxAnnualValue: 400.00,
    description: "Rebate toward purchasing eligible home security or safety equipment.",
    eligibility: ["WA Seniors Card member"],
    officialUrl: "https://www.seniorscard.wa.gov.au",
  },
];

export async function getWARebatesWithProvenance(): Promise<ProvenanceWrapper<WARebateItem[]>> {
  return {
    data: OFFICIAL_WA_REBATES,
    provenance: createProvenance(
      "WA Department of Communities & Concession Services",
      "official",
      {
        sourceUrl: "https://www.wa.gov.au/service/community-support/grants-and-subsidies",
        maxAgeMs: 30 * 24 * 60 * 60 * 1000, // 30 days TTL
        notes: "Official Western Australian State Government household concession directory",
      }
    ),
  };
}
