import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Modal, SectionApp, AppHeader, Shape, ModalSm, ModalConfirm } from "@/components";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button as ButtonShad } from "@/components/ui/button"
import { useState } from "react";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, MapPin, X } from "phosphor-react";
import { normalize } from "../../../utils/normalize";
import { useIsMobile } from "@/hooks/use-mobile" 


import { toast, Toaster } from "sonner";
import RouteService from "../../../services/RouteService";
import { fetchCities } from "../../../services/ibge";

export function ManageRoutes() {
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Gerenciar rotas" />
        <RoutesDataTable />
        <Toaster position="top-right" richColors/>
      </SectionApp>
    </>
  );
}

const getColumns = ({ onCancelClick, onStatusClick }) => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <ButtonShad variant="secondary" className={`hover:cursor-pointer w-18 text-black ${row.getValue('status') == 'Inativo' ? '' : 'bg-blue-500 text-white hover:bg-blue-500/90 '}`}
          onClick={() => onStatusClick(row.original.id)}>
          <div className="capitalize">{row.getValue("status")}</div>
        </ButtonShad>
      );
    },
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cidade")}</div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("estado")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Remover",
    cell: ({ row }) => {
      return (
        <ButtonShad variant="secondary" className={`h-8 w-8 p-0 cursor-pointer ${row.getValue('status') == 'inativo' ? '' : ''}`} onClick={() => { onCancelClick(row.original) }}>
          <X />
        </ButtonShad>
      );
    },
  },
];

function RoutesDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

 useEffect(() => {
      setColumnVisibility({
        id: !isMobile,
        estado: !isMobile,
      })
    }, [isMobile])

  const handleStatus = async (id) => {
    setTableData(prevData => 
      prevData.map(city => 
        city.id === id 
          ? { ...city, status: city.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : city
      )
    );

    try {
      await routeService.toggleActive(id);
      toast.success("Status atualizado!");
    } catch (error) {
      setTableData(prevData => 
        prevData.map(city => 
          city.id === id 
            ? { ...city, status: city.status === 'Ativo' ? 'Inativo' : 'Ativo' }
            : city
        )
      );
      toast.error("Erro ao atualizar status, tente denovo.");
    }
  }

  const columns = getColumns({
    onCancelClick: setSelectedRow,
    onStatusClick: handleStatus
  })

  const routeService = new RouteService();


  // const handleCancel = () => {
  //   if (!selectedRow) return;
  //   toast.info(`${selectedRow.cidade} foi removida`);
  //   setTableData(updateInfo(selectedRow.id));
  //   setSelectedRow(null);
  // };

  useEffect(() => {
    loadCities(currentPage)
  }, [])

  const loadCities = async (page) => {
    setLoading(true);
    try {
      const response = await routeService.findAll(page);
      console.log(response);
      
      if (response.data) {
        setCurrentPage(response.data.number || 0);
        setTotalPages(response.data.totalPages || 1);
        
        const mappedData = response.data.content.map(city => ({
          id: city.id,
          cidade: city.nome,
          estado: city.estado?.uf || 'Paraná', 
          status: city.status === 'ATIVO' ? 'Ativo' : 'Inativo' 
        }));
        
        setTableData(mappedData);
      }
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const getUsedCities = () => {
    if (Array.isArray(tableData)) {
      return tableData.map(city => city.cidade);
    }
    return [];
  };

  const handleCancel = async () => {
    if (!selectedRow) return;
    
    try {
      await routeService.softDelete(selectedRow.id);
      toast.success(`${selectedRow.cidade} foi removida`);
      await loadCities(currentPage); 
      setSelectedRow(null);
    } catch (error) {
      console.error("Erro ao remover cidade:", error);
      toast.error("Erro ao remover cidade");
    }
  };

  console.log(tableData)

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [
        {
          id: 'cidade',
          desc: false,
        },
      ],
      manualPagination: true,
      pageCount: totalPages
    },

  });

  return (
    <div className="w-full pt-5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col justify-center">
      <div className="flex flex-row-reverse items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center"
          >
            <ArrowLeft size={20} className="disabled:opacity-50"/>
          </Button>
          <Button
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center "
          >
            <ArrowRight size={20} className="disabled:opacity-50"/>
          </Button>
          <div className="flex justify-end">
          </div>
        </div>
        <Button className="w-auto bg-red-tx" onClick={() => setShowModal(true)}>
          <ButtonText className="text-center text-white shrink-0">
            Adicionar cidade
          </ButtonText>
        </Button>
      </div>
        
      </div>
      <ModalConfirm
        message="Você realmente deseja remover esta cidade?"
        open={!!selectedRow}
        options={["Não", "Sim"]}
        action={handleCancel}
        onClose={() => setSelectedRow(null)}
      />
      <ModalAddCity
        open={showModal}
        onClose={() => setShowModal(false)}
        usedCities={getUsedCities()}
        onCityAdded={() => loadCities(currentPage)}
      />
    </div>
  );
}

function CitySearch({clickedSuggestions, setClickedSuggestions, usedCities = []}) {
  const [isCityThere, setIsCityThere] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      try {
        const cities = await fetchCities();
        setSuggestions(cities);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        setError("Erro ao carregar cidades do IBGE");
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (isWriting === false) setIsWriting(true);
    const filteredSuggestions = suggestions.filter(suggestion => (normalize(suggestion).includes(normalize(inputValue)))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    const normalizedValue = value.toLowerCase();
    const normalizedUsedCities = usedCities.map(city => city.toLowerCase());
    const normalizedClickedSuggestions = clickedSuggestions.map(city => city.toLowerCase());
    
    if (!normalizedUsedCities.includes(normalizedValue) && !normalizedClickedSuggestions.includes(normalizedValue)) {
      setClickedSuggestions(prev => [...prev, value]);
      setFilteredSuggestions([]);
      setIsWriting(false);
    } else setIsCityThere(true);
    setInputValue("");
  };

  if (loading) {
    return (
      <div className="relative mt-3">
        <InputLabel>Cidade</InputLabel>
        <InputRoot>
          <InputIcon>
            <MapPin className="icon" />
          </InputIcon>
          <InputField 
            disabled 
            placeholder="Carregando cidades..." 
          />
        </InputRoot>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative mt-3">
        <InputLabel>Cidade</InputLabel>
        <InputRoot data-status="error">
          <InputIcon>
            <MapPin className="icon text-danger-base" />
          </InputIcon>
          <InputField 
            disabled 
            placeholder="Erro ao carregar cidades" 
          />
        </InputRoot>
        <InputMessage className="text-danger-base pt-1">
          {error}
        </InputMessage>
      </div>
    );
  }

  return (
    <div className="relative mt-3">
      <InputLabel>Cidade</InputLabel>
      <InputRoot data-status={isCityThere ? "error" : "default"}>
        <InputIcon>
          <MapPin className={`icon ${isCityThere ? "text-danger-base" : ""}`} />
        </InputIcon>
        <InputField value={inputValue} onChange={handleChange} placeholder="Ex: Paranavaí"
          onFocus={() => {
            setIsCityThere(false)
            setIsWriting(true)
          }}
          onBlur={() => {setIsWriting(false)}}/>
      </InputRoot>
      {isCityThere && <InputMessage className="text-danger-base pt-1">
        Cidade já adicionada!
      </InputMessage>}

      {isWriting && (
        <ul className="bg-gray-50 rounded-2xl absolute top-20 z-50 w-full max-h-55 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <li key={index} onMouseDown={() => handleSelect(suggestion)}>
                <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2">
                  {suggestion}
                </p>
              </li>
            ))
          ) : (
            <li>
              <p className="pl-5 py-2 text-gray-500">
                {inputValue ? "Nenhuma cidade encontrada" : "Digite para buscar"}
              </p>
            </li>
          )}
        </ul>
      )}
      {<div className="pt-2">
        <span className="font-bold text-xs sm:text-base text-black">Cidades a serem adicionadas</span>
        <ul className=" flex flex-wrap gap-x-1 gap-y-2 mt-1">
          {clickedSuggestions.length !== 0 ? clickedSuggestions.map((clickedSuggestion, index) => (
            <li className="bg-gray-50 hover:bg-danger-base hover:border rounded-2xl w-fit h-6 items-center flex hover:cursor-pointer" key={index} onClick={() => setClickedSuggestions(prev => prev.filter(choice => choice != clickedSuggestion))}>
              <div className="group relative">
              <span className="rounded-2xl text-xs text-center px-3 text-black group-hover:opacity-0"> {clickedSuggestion}
              </span>
              <span className="absolute top-1 left-1/2 -translate-x-1/2 rounded-2xl text-xs text-center px-3 text-white font-bold hidden group-hover:inline"> 
                Remover
              </span>
              </div>
            </li>
          )) : <span className="text-gray-600 text-xs sm:text-base">Nenhuma cidade foi selecionada</span>}
        </ul>
      </div>}
    </div>
  );
};

function ModalAddCity({ onClose, open, usedCities = [], onCityAdded }) {
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const routeService = new RouteService();

  const handleAddCities = async () => {
    if (clickedSuggestions.length === 0) return;
    
    try {
      setIsAdding(true);
      
      for (const cityName of clickedSuggestions) {
        const formattedCityName = cityName
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        await routeService.save({
          nome: formattedCityName,
          estadoId: 1,
          status: "ATIVO"
        });
      }
      
      toast.success("Adicionado: " + clickedSuggestions.join(", "));
      setClickedSuggestions([]);
      onClose();
      
      if (onCityAdded) {
        onCityAdded();
      }
    } catch (error) {
      console.error("Erro ao adicionar cidades:", error);
      toast.error("Erro ao adicionar cidades");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <ModalSm onClose={() => {onClose(); setClickedSuggestions([])}} open={open}>
      <h4 className="pb-4">Adicionar cidade</h4>
      <InputLabel>Estado</InputLabel>
      <InputRoot className="bg-gray-50">
        <InputIcon>
          <MapPin className="icon" />
        </InputIcon>
        <p>Paraná</p>
      </InputRoot>
      <CitySearch 
        clickedSuggestions={clickedSuggestions} 
        setClickedSuggestions={setClickedSuggestions}
        usedCities={usedCities}
      />
      <div className="flex justify-between gap-6">
        <Button 
          className="bg-gray-50 mt-4" 
          onClick={() => { onClose(); setClickedSuggestions([]) }}
          disabled={isAdding}
        >
          <ButtonText className="text-black text-center">
            Cancelar
          </ButtonText>
        </Button>
        <Button 
          className="bg-red-tx mt-4" 
          onClick={handleAddCities}
          disabled={clickedSuggestions.length === 0 || isAdding}
        >
          <ButtonText className="text-white text-center">
            {isAdding ? "Adicionando..." : "Adicionar"}
          </ButtonText>
        </Button>
      </div>
    </ModalSm>
  )
}