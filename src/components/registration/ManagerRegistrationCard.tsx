"use client";

import { useEffect, useState } from "react";
import {
  cleanEmployeeCode,
  validateManagerRegistrationInput,
} from "@/domain/registration";
import { nextuberMutationBridge } from "@/services/admin-mutations-client";
import { nextuberReadBridge } from "@/services/read-client";

type ManagerItem = {
  id: string;
  nome: string;
  funcional: string;
  agencia: string;
  regional_id?: string | null;
  tipo_gestor: "ga" | "gga" | "facilitador" | "tutor";
  permissoes?: Record<string, boolean>;
};

type Props = {
  onManagerCreated?: (newManager: ManagerItem) => void;
  canEdit?: boolean;
};

export function ManagerRegistrationCard({ onManagerCreated, canEdit = true }: Props) {
  const [nome, setNome] = useState("");
  const [funcional, setFuncional] = useState("");
  const [agencia, setAgencia] = useState("");
  const [regionalId, setRegionalId] = useState("");
  const [regionais, setRegionais] = useState<Array<{ id: string; nome: string }>>([]);
  const [tipoGestor, setTipoGestor] = useState<"ga" | "gga" | "facilitador" | "tutor">("ga");
  const [permTrilhas, setPermTrilhas] = useState(true);
  const [permAgendamentos, setPermAgendamentos] = useState(true);
  const [permProducao, setPermProducao] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    nextuberReadBridge
      .bootstrap()
      .then((data) => {
        if (!active) return;
        const list = (data.regionais || []) as Array<{ id: string; nome: string }>;
        setRegionais(list);
        if (list.length > 0) setRegionalId((previous) => previous || list[0].id);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit || saving) return;

    const validation = validateManagerRegistrationInput({
      nome,
      funcional,
      agencia,
      regional_id: regionalId,
      tipo_gestor: tipoGestor,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      const res = await nextuberMutationBridge.createManager({
        name: nome.trim(),
        employeeCode: cleanEmployeeCode(funcional),
        agency: agencia.trim(),
        regionalId,
        managerType: tipoGestor,
        permissions: {
          trilhas: permTrilhas,
          agendamentos: permAgendamentos,
          producao: permProducao,
        },
      });

      if (res.manager) {
        setSavedSuccess(true);
        if (onManagerCreated) onManagerCreated(res.manager as unknown as ManagerItem);
        // Clear Form
        setNome("");
        setFuncional("");
        setAgencia("");
        setTipoGestor("ga");
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar gestor.";
      setErrors({ global: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #eee)",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingBottom: "14px",
          borderBottom: "1px solid var(--border, #eee)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "var(--ink, #111)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          G
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink, #111)" }}>
            Novo Gestor / Administrador
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink3, #666)" }}>
            A senha inicial será os 4 primeiros dígitos do funcional
          </div>
        </div>
      </div>

      {errors.global && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            marginBottom: "14px",
          }}
        >
          {errors.global}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Nome completo do gestor *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Mariana Costa"
              maxLength={60}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: `1px solid ${errors.nome ? "#DC2626" : "var(--border, #ccc)"}`,
                fontSize: "13px",
              }}
            />
            {errors.nome && <span style={{ color: "#DC2626", fontSize: "11px" }}>{errors.nome}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Funcional (9 dígitos) *
            </label>
            <input
              type="text"
              required
              value={funcional}
              onChange={(e) => setFuncional(cleanEmployeeCode(e.target.value))}
              placeholder="000000000"
              maxLength={9}
              inputMode="numeric"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: `1px solid ${errors.funcional ? "#DC2626" : "var(--border, #ccc)"}`,
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            />
            {errors.funcional && <span style={{ color: "#DC2626", fontSize: "11px" }}>{errors.funcional}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Agência *
            </label>
            <input
              type="text"
              required
              value={agencia}
              onChange={(e) => setAgencia(e.target.value)}
              placeholder="Ex.: 4563"
              maxLength={60}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: `1px solid ${errors.agencia ? "#DC2626" : "var(--border, #ccc)"}`,
                fontSize: "13px",
              }}
            />
            {errors.agencia && <span style={{ color: "#DC2626", fontSize: "11px" }}>{errors.agencia}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Regional *
            </label>
            <select
              required
              value={regionalId}
              onChange={(e) => setRegionalId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: `1px solid ${errors.regional_id ? "#DC2626" : "var(--border, #ccc)"}`,
                fontSize: "13px",
                background: "var(--surface, #fff)",
              }}
            >
              <option value="">Selecione a regional</option>
              {regionais.map((regional) => (
                <option key={regional.id} value={regional.id}>
                  {regional.nome}
                </option>
              ))}
            </select>
            {errors.regional_id && (
              <span style={{ color: "#DC2626", fontSize: "11px" }}>{errors.regional_id}</span>
            )}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Perfil / Função *
            </label>
            <select
              value={tipoGestor}
              onChange={(e) => setTipoGestor(e.target.value as typeof tipoGestor)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border, #ccc)",
                fontSize: "13px",
                background: "var(--surface, #fff)",
              }}
            >
              <option value="ga">Gestor de Agência (GA)</option>
              <option value="gga">Gestor Geral de Agência (GGA)</option>
              <option value="facilitador">Facilitador</option>
              <option value="tutor">Tutora / Administradora Regional</option>
            </select>
          </div>
        </div>

        {/* Permissões Granulares */}
        <div style={{ marginTop: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px", color: "var(--ink2, #444)" }}>
            Permissões de Acesso:
          </label>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={permTrilhas}
                onChange={(e) => setPermTrilhas(e.target.checked)}
              />
              <span>Acompanhar Trilhas</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={permAgendamentos}
                onChange={(e) => setPermAgendamentos(e.target.checked)}
              />
              <span>Gerenciar Agendamentos</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={permProducao}
                onChange={(e) => setPermProducao(e.target.checked)}
              />
              <span>Lançar Produção</span>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
          <button
            type="submit"
            disabled={!canEdit || saving}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              background: "var(--ink, #111)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {saving ? "Adicionando..." : "+ Adicionar Gestor"}
          </button>
          {savedSuccess && (
            <span style={{ color: "#166534", fontSize: "12px", fontWeight: 600 }}>
              ✓ Gestor cadastrado com sucesso!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
