export interface IbgeResponse {
  nome: string[];
}

export async function fetchCities(): Promise<IbgeResponse> {
  const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/PR?providers=dados-abertos-br,gov,wikipedia`);
  if (!response.ok) throw new Error("Erro ao buscar as cidades");
  const data = await response.json().then(info => info.map((c: { nome: string; }) => c.nome));
  return data;
}