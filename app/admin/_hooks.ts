"use client";

import { useState, useEffect, useCallback } from "react";

export type ContractRow = {
  id: string;
  title: string;
  price: number;
  status: string;
  payment_confirmed: boolean;
  created_at: string;
  expires_at?: string | null;
  memo?: string | null;
  client?: { company?: string | null; name?: string | null; email?: string | null };
};

export type TokenRow = {
  id: string;
  token: string;
  label: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  contract_id: string | null;
};

function getSecret(): string {
  return sessionStorage.getItem("admin_secret") ?? "";
}

export function filterContracts(contracts: ContractRow[]) {
  return {
    prePayment: contracts.filter(
      (c) => c.status === "signed" && !c.payment_confirmed
    ),
    inProgress: contracts.filter(
      (c) => c.payment_confirmed && c.status === "signed"
    ),
    onHold: contracts.filter((c) => c.status === "on_hold"),
    completed: contracts.filter((c) => c.status === "completed"),
    cancelled: contracts.filter((c) => c.status === "cancelled"),
  };
}

export function useAdminContracts() {
  const [contracts, setContracts] = useState<ContractRow[]>([]);

  const load = useCallback((s: string) => {
    fetch("/api/contracts", { headers: { "x-admin-secret": s } })
      .then((r) => r.json())
      .catch(() => ({}))
      .then((data) => {
        if (data.ok) setContracts(data.contracts ?? []);
      });
  }, []);

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (s) load(s);
  }, [load]);

  async function patch(contractId: string, body: Record<string, unknown>) {
    const s = getSecret();
    const res = await fetch(`/api/admin/contracts/${contractId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": s },
      body: JSON.stringify(body),
    });
    if (res.ok) load(s);
    return res.ok;
  }

  return {
    contracts,
    load,
    reload: () => load(getSecret()),
    confirmPayment: (id: string) => patch(id, { payment_confirmed: true }),
    revokePayment: (id: string) =>
      patch(id, { payment_confirmed: false, status: "signed" }),
    markOnHold: (id: string) => patch(id, { status: "on_hold" }),
    unhold: (id: string) => patch(id, { status: "signed" }),
    markCompleted: (id: string) => patch(id, { status: "completed" }),
    reactivate: (id: string) => patch(id, { status: "signed" }),
    cancelContract: (id: string) => patch(id, { status: "cancelled" }),
    restoreContract: (id: string) =>
      patch(id, { status: "signed", payment_confirmed: false }),
    updateMemo: (id: string, memo: string) => patch(id, { memo }),
    updatePrice: (id: string, price: number) => patch(id, { price }),
    setContracts,
    ...filterContracts(contracts),
  };
}
