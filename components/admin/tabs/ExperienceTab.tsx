"use client";

import { Experience, PortfolioData } from "@/lib/types";
import { Card, Field, GhostButton, PrimaryButton, SectionTitle } from "../ui";

export default function ExperienceTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const list = data.experience;

  function update(i: number, patch: Partial<Experience>) {
    const next = list.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, experience: next });
  }
  function remove(i: number) {
    setData({ ...data, experience: list.filter((_, idx) => idx !== i) });
  }
  function add() {
    setData({
      ...data,
      experience: [...list, { period: "2024 — NOW", role: "Role baru", org: "Organisasi", tag: "TAG" }],
    });
  }

  return (
    <div className="flex flex-col gap-4 max-w-[720px]">
      <SectionTitle>EXPERIENCE.LOG</SectionTitle>
      {list.map((job, i) => (
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
