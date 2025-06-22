const data = [
  {
    id: 1,
    cidade: "Maringá",
    estado: "PR",
    status: "ativo",
    cancelar: "X"
  },
  {
    id: 2,
    cidade: "Londrina",
    estado: "PR",
    status: "inativo",
  },
  {
    id: 3,
    cidade: "Paranavaí",
    estado: "PR",
    status: "ativo",
  },
  {
    id: 4,
    cidade: "Apucarana",
    estado: "PR",
    status: "inativo",
  },
  {
    id: 5,
    cidade: "Sarandi",
    estado: "PR",
    status: "ativo",
  },
];

export interface CidadesAtendidasResponse {
  id: number;
  cidade: string;
  estado: string;
  status: string;
}

export function setInfo(info?: any): void {
    info ? localStorage.setItem("cidades-atendidas", JSON.stringify(info)) : localStorage.setItem("cidades-atendidas", JSON.stringify(data));
}

export function getInfo(): CidadesAtendidasResponse[] | null {
    const cidades = localStorage.getItem("cidades-atendidas");
    return cidades ? JSON.parse(cidades) : null;
}

export function updateInfo(id: number): CidadesAtendidasResponse[] | null {
    const stored = getInfo();
    const updated = stored ? stored.filter(item => item.id !== id) : null; 
    setInfo(updated);
    return updated;
}

export function updateStatus(id: number): CidadesAtendidasResponse[] | null {
    const stored = getInfo();
    const updated = stored ? stored.map(item => {
        if(item.id === id){
            item.status === "ativo" ? item.status = "inativo" : item.status = "ativo"
        }
        return item
    }) : null; 
    setInfo(updated);
    return updated;
}

export function addInfo(cidade: string): void {
    const stored = getInfo();
    console.log(stored);
    const newInfo = {
        id: stored ? stored.length + 1 : 1,
        cidade: cidade.toLowerCase(),
        estado: "PR",
        status: "ativo",
    }
    console.log(newInfo);
    stored?.push(newInfo);
    const updated = stored ? stored : newInfo;
    console.log(updated);
    setInfo(updated);
}

