export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchCep(cep: string): Promise<CepResponse> {
  const cleanedCep = cep.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
  if (!response.ok) throw new Error("Erro ao buscar o CEP");
  const data = await response.json();
  return data;
}