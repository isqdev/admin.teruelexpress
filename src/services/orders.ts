
export const data = [
  {
    id: 10,
    data: "10/10/2025",
    cliente: "Gerdau",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Pendente",
    pacotes: [
      {
        loadType: "envelope",
        width: 0,
        height: 1,
        length: 0,
        weight: 0,
        amount: 5,
      },
      {
        loadType: "caixa",
        width: 2,
        height: 0,
        length: 0,
        weight: 4,
        amount: 1,
      },
      {
        loadType: "sacola",
        width: 0,
        height: 0,
        length: 3,
        weight: 0,
        amount: 1,
      }
    ],
    aceitar: "X ✓"
  },
  {
    id: 11,
    data: "10/11/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Pendente",
    pacotes: [],
  },
  {
    id: 12,
    data: "10/12/2025",
    cliente: "Eletrohitiz",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
    pacotes: [],
  },
  {
    id: 13,
    data: "11/12/2025",
    cliente: "Gerdau",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
    pacotes: [],
  },
  {
    id: 14,
    data: "13/12/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
    pacotes: [],
  },
  {
    id: 15,
    data: "11/12/2025",
    cliente: "ViaVerde",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
    pacotes: [],
  },
];

export const addresses = [
  // "origem":
  {
    cep: "87701050",
    estado: "pr",
    cidade: "paranavaí",
    bairro: "Jardim Nakamura",
    rua: "Rua Professora Enira Braga de Moraes",
    numero: "56"
  },
  // "destino":
  {
    cep: "87701050",
    estado: "pr",
    cidade: "paranavaí",
    bairro: "Jardim Nakamura",
    rua: "Rua Professora Enira Braga de Moraes",
    numero: "57"
  },
];
