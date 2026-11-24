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

## Fleet status — 2026-11-24 (Wave B)

Canonical control-plane record (S.I.R.E. repo):  
`docs/SYSTEM_UPGRADES_WAVE_B_2026-11-24.md` · `docs/ECOSYSTEM_COMPLETION_WAVE_2026-11-24.md` · `docs/FLEET_STATUS_WAVE_B_2026-11-24.md`

**Phone-merged this wave (exact main SHAs):**
- SIRE Wave B `123c7aa9` (PR #844) — doctor honesty, local verify allowlist, Connections Git Stop, UI soft-lie cleanup
- Aethelgard orphan XP boot fix `ce21b08` (PR #151)
- Fossil.Os autocert `push: main` `fd04200` (PR #98)
- The-Wrong-Refl3ction autocert + unreal `push: main` `c534f91` (PR #35)
- OCEANIS read-only blockout integrity on every main push `cb433cb` (PR #10)

**Still HOLD / NOT_VERIFIED (fleet-wide):**
- LAW-105 fresh screenshots and full-clip videos on exact HEAD
- Horizon game-engine release (no engine source in SIRE)
- KRAIT verified trained model / live inference
- True 24×7 Auto (cloud doctor READY + phone-gated install)
- ChatGPT MCP gateway deploy + OAuth secrets
- Mission dispatch execution (local verify allowlist ≠ mission POST)

**This repo — status note:**
- Completion laws on main. Close release-readiness items with evidence; phone-gate user-facing claims.

