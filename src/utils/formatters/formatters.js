export function formatCpfCnpj(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    // CPF
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return value;
}

export function formatCep(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  return value;
}

export function formatCelular(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function formatTelefone(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "";

  let cleanValue = String(value).replace(/\D/g, '');

  if (cleanValue === "") {
    return "R$ 0,00";
  }

  let numericValue = parseInt(cleanValue, 10);

  let finalValue = numericValue / 100;

  return finalValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatPercentage(value) {
  let text = String(value).replace(/%/g, '');
  return `${text}%`;
}