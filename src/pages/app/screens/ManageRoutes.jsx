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


import { setInfo, getInfo, updateInfo, updateStatus, addInfo } from "@/services/cities";
import { toast, Toaster } from "sonner";

export function ManageRoutes() {

  getInfo() ?? setInfo();

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
        <ButtonShad variant="secondary" className={`hover:cursor-pointer w-18 text-black ${row.getValue('status') == 'inativo' ? '' : 'bg-blue-500 text-white hover:bg-blue-500/90 '}`}
          onClick={() => onStatusClick(row.original)}>
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
  const [tableData, setTableData] = React.useState(getInfo());
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const isMobile = useIsMobile();

 React.useEffect(() => {
      setColumnVisibility({
        id: !isMobile,
        estado: !isMobile,
      })
    }, [isMobile])

  const columns = getColumns({
    onCancelClick: setSelectedRow,
    onStatusClick: handleStatus
  })

  const handleCancel = () => {
    if (!selectedRow) return;
    toast.info(`${selectedRow.cidade} foi removida`);
    setTableData(updateInfo(selectedRow.id));
    setSelectedRow(null);
  };

  function handleStatus(row) {
    setTableData(updateStatus(row.id));
  };

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
      pagination: {
        pageSize: 20
      }
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
        action={() => handleCancel()}
        onClose={() => setSelectedRow(null)}
      />
      <ModalAddCity
        open={showModal}
        onClose={() => setShowModal(false)}
        setTableData={setTableData}
      />
    </div>
  );
}

function CitySearch({clickedSuggestions, setClickedSuggestions}) {
  const [isCityThere, setIsCityThere] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/CS-PI-2025-Delinquentes/json-end/refs/heads/main/parana-cities.json")
      .then(data => data.json()).then(data => setSuggestions(data))
  }, []);

  const usedCities = getInfo().map(city => city.cidade);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (isWriting === false) setIsWriting(true);
    const filteredSuggestions = suggestions.filter(suggestion => (normalize(suggestion).includes(normalize(inputValue)))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    if (!usedCities.includes(value) && !clickedSuggestions.includes(value)) {
      setClickedSuggestions(prev => [...prev, value]);
      setFilteredSuggestions([]);
      setIsWriting(false);
    } else setIsCityThere(true);
    setInputValue("");
  };

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

      {isWriting && <ul className="bg-gray-50 rounded-2xl absolute top-20 z-50 w-full max-h-55 overflow-y-auto">
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onMouseDown={() => handleSelect(suggestion)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2"> {suggestion}</p>
          </li>
        ))}
      </ul>}
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

function ModalAddCity({ onClose, open, setTableData, suggestions }) {
  const [clickedSuggestions, setClickedSuggestions] = useState([]);

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
      <CitySearch clickedSuggestions={clickedSuggestions} setClickedSuggestions={setClickedSuggestions} suggestions={suggestions} tabindex="-1" />
      <div className="flex justify-between gap-6">
        <Button className="bg-gray-50 mt-4" onClick={() => { onClose(); setClickedSuggestions([]) }}>
          <ButtonText className="text-black text-center">
            Cancelar
          </ButtonText>
        </Button>
        <Button className="bg-red-tx mt-4" onClick={() => {
          if (clickedSuggestions.length != 0) {
            clickedSuggestions.forEach(sug => addInfo(sug))
            setTableData(getInfo())
            setClickedSuggestions([])
            toast.success("Adicionado: " + clickedSuggestions.join(", "))
            onClose()
          }
        }}>
          <ButtonText className="text-white text-center">
            Adicionar
          </ButtonText>
        </Button>
      </div>
    </ModalSm>
  )
}