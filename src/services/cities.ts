

export interface CidadesAtendidasResponse {
  id: number;
  cidade: string;
  estado: string;
  status: string;
}

async function data(): Promise<CidadesAtendidasResponse[]> {
    return fetch("https://raw.githubusercontent.com/CS-PI-2025-Delinquentes/json-end/refs/heads/main/serviced-cities.json").then(infos => infos.json());
}

export async function setInfo(info?: any): Promise<void> {
    info ? localStorage.setItem("cidades-atendidas", JSON.stringify(info)) : localStorage.setItem("cidades-atendidas", JSON.stringify(await data()));
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
    const newInfo = {
        id: stored ? stored.length + 1 : 1,
        cidade: cidade,
        estado: "PR",
        status: "ativo",
    }
    stored?.push(newInfo);
    const updated = stored ? stored : newInfo;
    setInfo(updated);
}

