"use client";

import { Experience, PortfolioData } from "@/lib/types";
import { Card, Field, GhostButton, PrimaryButton, SectionTitle } from "../ui";

const MONTHS: Record<string, number> = {
  JAN:1,FEB:2,MAR:3,APR:4,MEI:5,MAY:5,JUN:6,
  JUL:7,AGU:8,AUG:8,SEP:9,OKT:10,OCT:10,NOV:11,DES:12,DEC:12,
};
function parsePeriodStart(period: string): number {
  const start = period.split(/\s*[—–-]\s*/)[0].trim();
  const [mon, yr] = start.split(/\s+/);
  const month = MONTHS[mon?.toUpperCase()] ?? 0;
  const year = parseInt((yr ?? "").replace(/\D/g, "").slice(0, 4)) || 0;
  return year * 100 + month;
}
function sortExp(list: { period: string }[]) {
  return [...list].sort((a, b) => {
    const aNow = /now/i.test(a.period) ? 1 : 0;
    const bNow = /now/i.test(b.period) ? 1 : 0;
    if (bNow !== aNow) return bNow - aNow;
    return parsePeriodStart(b.period) - parsePeriodStart(a.period);
  });
}

export default function ExperienceTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const sorted = sortExp(data.experience) as typeof data.experience;

  function update(i: number, patch: Partial<Experience>) {
    const next = sorted.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, experience: next });
  }
  function remove(i: number) {
    setData({ ...data, experience: sorted.filter((_, idx) => idx !== i) });
  }
  function add() {
    setData({
      ...data,
      experience: [...sorted, { period: "2024 — NOW", role: "Role baru", org: "Organisasi", tag: "TAG" }],
    });
  }

  return (
    <div className="flex flex-col gap-4 max-w-[720px]">
      <SectionTitle>EXPERIENCE.LOG</SectionTitle>
      {sorted.map((job, i) => (
        <Card key={i}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="PERIODE" value={job.period} onChange={(v) => update(i, { period: v })} />
            <Field label="TAG" value={job.tag} onChange={(v) => update(i, { tag: v })} />
            <Field label="PERAN" value={job.role} onChange={(v) => update(i, { role: v })} />
            <Field label="ORGANISASI" value={job.org} onChange={(v) => update(i, { org: v })} />
          </div>
          <div className="flex justify-end">
            <GhostButton danger onClick={() => remove(i)}>
              HAPUS
            </GhostButton>
          </div>
        </Card>
      ))}
      <div>
        <PrimaryButton onClick={add}>+ TAMBAH BARIS</PrimaryButton>
      </div>
    </div>
  );
}
