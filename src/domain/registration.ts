export type StudentRegistrationInput = {
  nome: string;
  funcional: string;
  agencia: string;
  inicio: string;
  ga_funcional?: string;
  gga_funcional?: string;
  certificacao?: string;
  dia_aniversario?: string | number;
  mes_aniversario?: string | number;
};

export type ManagerRegistrationInput = {
  nome: string;
  funcional: string;
  agencia: string;
  regional_id: string;
  tipo_gestor: "ga" | "gga" | "facilitador" | "tutor";
  permissoes?: {
    trilhas?: boolean;
    agendamentos?: boolean;
    producao?: boolean;
  };
};

export function cleanEmployeeCode(code: string | null | undefined): string {
  if (!code) return "";
  return code.replace(/\D/g, "").slice(0, 9);
}

export function validateStudentRegistrationInput(input: Partial<StudentRegistrationInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.nome || input.nome.trim().length < 3) {
    errors.nome = "Nome deve ter pelo menos 3 caracteres.";
  }

  const func = cleanEmployeeCode(input.funcional);
  if (!func || func.length !== 9) {
    errors.funcional = "Funcional deve conter exatamente 9 dígitos numéricos.";
  }

  if (!input.agencia || input.agencia.trim().length === 0) {
    errors.agencia = "Informe o número da agência.";
  }

  if (input.ga_funcional) {
    const gaFunc = cleanEmployeeCode(input.ga_funcional);
    if (gaFunc && gaFunc.length !== 9) {
      errors.ga_funcional = "Funcional do GA deve ter 9 dígitos numéricos.";
    }
  }

  if (input.gga_funcional) {
    const ggaFunc = cleanEmployeeCode(input.gga_funcional);
    if (ggaFunc && ggaFunc.length !== 9) {
      errors.gga_funcional = "Funcional do GGA deve ter 9 dígitos numéricos.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateManagerRegistrationInput(input: Partial<ManagerRegistrationInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.nome || input.nome.trim().length < 3) {
    errors.nome = "Nome do gestor deve ter pelo menos 3 caracteres.";
  }

  const func = cleanEmployeeCode(input.funcional);
  if (!func || func.length !== 9) {
    errors.funcional = "Funcional deve conter exatamente 9 dígitos numéricos.";
  }

  if (!input.agencia || input.agencia.trim().length === 0) {
    errors.agencia = "Informe a agência do gestor.";
  }

  if (!input.regional_id || input.regional_id.trim().length === 0) {
    errors.regional_id = "Selecione a regional do gestor.";
  }

  if (!input.tipo_gestor || !["ga", "gga", "facilitador", "tutor"].includes(input.tipo_gestor)) {
    errors.tipo_gestor = "Selecione o tipo de perfil do gestor (GA, GGA, Facilitador ou Tutor).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
