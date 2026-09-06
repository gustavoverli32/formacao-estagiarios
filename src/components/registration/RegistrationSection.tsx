"use client";

import { useState } from "react";
import { cleanEmployeeCode } from "@/domain/registration";
import { getStudentProfile, type StudentItem } from "@/domain/student-monitoring";
import { nextuberMutationBridge } from "@/services/admin-mutations-client";
import { ManagerRegistrationCard } from "./ManagerRegistrationCard";
import { StudentRegistrationCard } from "./StudentRegistrationCard";

type ManagerItem = {
  id: string;
  nome: string;
  funcional: string;
  agencia?: string;
  regional_id?: string | null;
  tipo_gestor: "ga" | "gga" | "facilitador" | "tutor";
  permissoes?: Record<string, boolean>;
};

type Props = {
  initialStudents?: StudentItem[];
  initialManagers?: ManagerItem[];
  canEdit?: boolean;
  isTutorOrGga?: boolean;
  isAuthorized?: boolean;
  onLoginClick?: () => void;
};

export function RegistrationSection({
  initialStudents = [],
  initialManagers = [],
  canEdit = true,
  isTutorOrGga = true,
  isAuthorized = true,
  onLoginClick,
}: Props) {
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [managers, setManagers] = useState<ManagerItem[]>(initialManagers);
  const [searchStudent, setSearchStudent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleStudentCreated(newStudent: StudentItem) {
    setStudents((prev) => [newStudent, ...prev]);
  }

  function handleManagerCreated(newManager: ManagerItem) {
    setManagers((prev) => [newManager, ...prev]);
  }

  async function handleDeleteStudent(id: string, name: string) {
    if (!canEdit || deletingId) return;
    if (!confirm(`Tem certeza que deseja excluir o cadastro do estagiário "${name}"?`)) return;

    try {
      setDeletingId(id);
      await nextuberMutationBridge.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir estagiário.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteManager(id: string, name: string) {
    if (!canEdit || deletingId) return;
    if (!confirm(`Tem certeza que deseja excluir o gestor "${name}"?`)) return;

    try {
      setDeletingId(id);
      await nextuberMutationBridge.deleteManager(id);
      setManagers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir gestor.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredStudents = students.filter((s) => {
    const prof = getStudentProfile(s);
    const query = searchStudent.toLowerCase().trim();
    return (
      !query ||
      s.nome.toLowerCase().includes(query) ||
      (prof.funcional || "").toLowerCase().includes(query) ||
      (prof.agencia || "").toLowerCase().includes(query)
    );
  });

  if (!isAuthorized) {
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "var(--surface, #fff)",
          borderRadius: "16px",
          margin: "20px 0",
          border: "1px solid var(--border, #eee)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔒</div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px 0" }}>Acesso restrito</h2>
        <p style={{ color: "var(--ink3, #666)", fontSize: "14px", margin: "0 0 20px 0" }}>
          Esta área de cadastro é exclusiva para tutoras e gestores autorizados.
        </p>
        {onLoginClick && (
          <button
            onClick={onLoginClick}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: "var(--or, #EC7000)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Fazer login
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Section Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0, color: "var(--ink, #111)" }}>
          Cadastro de <em>estagiários e gestores</em>
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--ink3, #666)" }}>
          Preencha os dados abaixo. O cadastro fica imediatamente disponível no sistema.
        </p>
      </div>

      {/* 1. Form de Cadastro de Estagiário */}
      <StudentRegistrationCard onStudentCreated={handleStudentCreated} canEdit={canEdit} />

      {/* 2. Lista de Estagiários Cadastrados */}
      <div
        style={{
          background: "var(--surface, #fff)",
          border: "1px solid var(--border, #eee)",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink, #111)" }}>
            Estagiários Cadastrados ({students.length})
          </div>

          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Buscar por nome ou funcional..."
            style={{
              padding: "6px 12px",
              fontSize: "12.5px",
              borderRadius: "6px",
              border: "1px solid var(--border, #ccc)",
              width: "240px",
            }}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div style={{ fontSize: "13px", color: "var(--ink3, #666)", padding: "16px 0", textAlign: "center" }}>
            Nenhum estagiário cadastrado.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            {filteredStudents.map((s) => {
              const prof = getStudentProfile(s);
              return (
                <div
                  key={s.id}
                  style={{
                    border: "1px solid var(--border, #eee)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    background: "var(--bg, #f9f9f9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink, #111)" }}>{s.nome}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--ink3, #666)", fontFamily: "monospace" }}>
                      Funcional: {prof.funcional || "—"} | Agência: {prof.agencia || "—"}
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleDeleteStudent(s.id, s.nome)}
                      disabled={deletingId === s.id}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        fontSize: "16px",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      title="Excluir estagiário"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Área de Gestores (Visível para Tutora ou GGA) */}
      {isTutorOrGga && (
        <>
          <ManagerRegistrationCard onManagerCreated={handleManagerCreated} canEdit={canEdit} />

          <div
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #eee)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink, #111)", marginBottom: "16px" }}>
              Gestores & Administradores Cadastrados ({managers.length})
            </div>

            {managers.length === 0 ? (
              <div style={{ fontSize: "13px", color: "var(--ink3, #666)", padding: "12px 0", textAlign: "center" }}>
                Nenhum gestor adicional cadastrado.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "12px",
                }}
              >
                {managers.map((m) => {
                  const roleLabel =
                    m.tipo_gestor === "tutor" ? "Tutora Regional" : m.tipo_gestor === "gga" ? "GGA" : m.tipo_gestor === "facilitador" ? "Facilitador" : "GA";

                  return (
                    <div
                      key={m.id}
                      style={{
                        border: "1px solid var(--border, #eee)",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        background: "var(--bg, #f9f9f9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink, #111)" }}>
                          {m.nome}{" "}
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: m.tipo_gestor === "tutor" ? "#EC7000" : "#1D4ED8",
                              color: "#fff",
                              fontWeight: 700,
                              marginLeft: "4px",
                            }}
                          >
                            {roleLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--ink3, #666)", fontFamily: "monospace" }}>
                          Funcional: {cleanEmployeeCode(m.funcional)} | Agência: {m.agencia || "—"}
                        </div>
                      </div>

                      {canEdit && (
                        <button
                          onClick={() => handleDeleteManager(m.id, m.nome)}
                          disabled={deletingId === m.id}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#DC2626",
                            fontSize: "16px",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Excluir gestor"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
