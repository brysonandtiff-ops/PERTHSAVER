# PerthSaver — Completion Plan & Build Laws

This repository follows the S.I.R.E. canonical eight-step build laws:

**FIND → PLAN → BUILD → TEST → SHOW → HARDEN → PROVE → FINISH**

Canonical reference (external):  
[SIRE-CANONICAL_STEP_BUILDING_LAWS.md](https://github.com/brysonandtiff-ops/SIRE/blob/main/docs/engineering-laws/SIRE-CANONICAL_STEP_BUILDING_LAWS.md)

Read this file in **FIND** before mutating. Prefer `README.md` and current audits over older “READY FOR RELEASE” prose when they disagree.

---

## Product (plain language)

**PerthSaver** is a Perth-first household savings, price intelligence, budgeting, and local-deals platform. It combines grocery/store comparison, fuel prices, WA rebates, bills, budgets, family features, rewards, and monetisation foundations in one full-stack app (React + Express + Drizzle/Postgres).

A wide schema and many routes prove serious product design. They do **not** by themselves prove every feed, payment path, or AI response is live and production-safe.

---

## Completion north star

1. Release-readiness items that still matter on **current HEAD** are closed with fresh evidence — not historical report text alone.
2. Live data provenance (FuelWatch, grocery, rebates) stays labelled honestly in UI.
3. Auth, household isolation, and payment verification are proven for production paths.
4. Automated release evidence pack is complete and SHA-bound.
5. Never invent **GREEN**; ops/perf follow-through stays visible until done.

---

## The eight steps (every change)

| Step | Name | What you do here |
| :---: | :--- | :--- |
| **1** | **FIND** | Exact HEAD SHA; README status; `RELEASE_READINESS_REPORT.md` age vs reality; open ops gaps |
| **2** | **PLAN** | Smallest trustworthy slice (data truth, auth, payments, or evidence) |
| **3** | **BUILD** | Feature branch only; preserve provenance badges and tenant isolation |
| **4** | **TEST** | `npm run check` / `build` and targeted domain tests; do not skip financial integrity cases |
| **5** | **SHOW** | Runtime proof for user-facing savings/deals surfaces when UI changes |
| **6** | **HARDEN** | Session/IDOR boundaries; secrets off tree; payment paths fail closed |
| **7** | **PROVE** | LAW-101 disclosure; release evidence tied to SHA |
| **8** | **FINISH** | Commit/push on feature branch; PASS / FAIL / BLOCKED / NOT RUN |

Merge, production deploy, and spend-related releases stay **owner phone-gated**.

---

## Ordered next steps

1. Reconcile README “candidate” honesty with any older release-readiness claims — current HEAD wins.
2. Close remaining production gaps: live data provenance verification, production authentication, payment verification, compliance, and automated release evidence.
3. Keep FuelWatch / grocery / rebates providers labelled with freshness and confidence — no silent fake “live” badges.
4. Re-run typecheck + production build after material server/client changes.
5. Owner phone acceptance before calling the product release-ready.

---

## Honest blockers

From `README.md` and release docs — **release readiness is not finished**:

- Broad full-stack candidate: many routes/models exist, but **live data provenance**, **production authentication**, **payment verification**, **compliance**, and **complete automated release evidence** are still required.
- Historical `RELEASE_READINESS_REPORT.md` language (“READY FOR RELEASE”) is **not** automatic proof of the current SHA — re-verify or mark UNKNOWN.
- Ops/perf follow-through called out in the S.I.R.E. ecosystem plan remains open until evidenced.
- Monetisation (Stripe/PayPal) and AI coach providers are dependencies — configured ≠ production-proven.

---

## Software-building AI autonomy

Authorised cloud agents may run **24/7** on feature branches through FIND→FINISH.

- Merge, release, and payment go-lives remain **phone-gated**.
- Never invent **GREEN**. `UNKNOWN` = fail-closed.


---

## Dev GO / Lightning / Own model (2026-11-24)

After the ecosystem completion wave merged, every game and software repo keeps these operator commands (run from the S.I.R.E. checkout):

| Command | Purpose |
| :--- | :--- |
| `python -m sire audit-go` | Fleet clean-tree + sync + Git Stop GO audit |
| `python -m sire lightning-team` | Fastest build team + agent roster (DEFINED, not live spawn) |
| `python -m sire axiom train\|status\|exam\|judge` | S.I.R.E. owned AXIOM-1 law model |
| `python -m sire git-stop check` | Merge/hazard stop authority |

Docs in S.I.R.E.: `docs/DEV_GO_CLEAN_AUDIT.md`, `docs/LIGHTNING_FASTEST_BUILD_TEAM.md`, `docs/SIRE_OWN_MODEL_TRAIN.md`.

Status honesty: clean git ≠ Horizon/KRAIT/ChatGPT certified. AXIOM may be `TRAINED_NOT_SEALED` until final exam thresholds PASS.

