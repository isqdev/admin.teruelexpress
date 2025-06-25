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
import { MapPin, X } from "phosphor-react";
import { normalize } from "../../../utils/normalize";

import { setInfo, getInfo, updateInfo, updateStatus, addInfo } from "@/services/cities";

export function ManageRoutes() {

  getInfo() ?? setInfo();

  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Gerenciar rotas" />
        <RoutesDataTable />
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
        <ButtonShad variant="secondary" className="hover:cursor-pointer"
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
    header: "Cancelar",
    cell: ({ row }) => {
      return (
        <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'inativo' ? ' hover:cursor-pointer' : 'cursor-default'}`} onClick={() => { onCancelClick(row.original) }}>
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

  const columns = getColumns({
    onCancelClick: setSelectedRow,
    onStatusClick: handleStatus
  })

  const handleCancel = () => {
    if (!selectedRow) return;

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
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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
      <div className="flex flex-row-reverse items-center justify-between space-x-2 py-4">
        <div className="space-x-2">
          <ButtonShad
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </ButtonShad>
          <ButtonShad
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </ButtonShad>
        </div>
        <Button className="w-50" onClick={() => setShowModal(true)}>
          <ButtonText className="text-center">
            Adicionar cidade
          </ButtonText>
        </Button>

      </div>
      <ModalConfirm
        message="Você realmente deseja cancelar esta solicitação?"
        open={!!selectedRow}
        actionWord="Cancelar"
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

function CitySearch({ setNewCity }) {
  const [isCityThere, setIsCityThere] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
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
      setNewCity(value);
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

      {isWriting && <ul className="bg-gray-50 rounded-2xl absolute top-20 z-50 w-full">
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onMouseDown={() => handleSelect(suggestion)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2"> {suggestion}</p>
          </li>
        ))}
      </ul>}
      {<div className="pt-2">
        <span className="font-bold text-xs sm:text-base text-black">Cidades a serem adicionadas</span>
        <ul className=" flex flex-wrap gap-x-1 gap-y-2 mt-1">
          {clickedSuggestions.map((clickedSuggestion, index) => (
            <li className="bg-gray-50 rounded-2xl w-fit h-6 items-center flex hover:cursor-pointer" key={index} onClick={() => setClickedSuggestions(prev => prev.filter(choice => choice !== clickedSuggestion))}>
              <span className="rounded-2xl text-xs text-center px-3 text-black"> {clickedSuggestion}</span>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};

function ModalAddCity({ onClose, open, setTableData, suggestions }) {
  const [newCity, setNewCity] = useState('');

  return (
    <ModalSm onClose={onClose} open={open}>
      <h4 className="pb-4">Adicionar cidade</h4>
      <InputLabel>Estado</InputLabel>
      <InputRoot className="bg-gray-50">
        <InputIcon>
          <MapPin className="icon" />
        </InputIcon>
        <p>Paraná</p>
      </InputRoot>
      <CitySearch setNewCity={setNewCity} suggestions={suggestions} />
      <div className="flex justify-between gap-6">
        <Button className="bg-gray-100 mt-4" onClick={() => { onClose() }}>
          <ButtonText className="text-black text-center">
            Cancelar
          </ButtonText>
        </Button>
        <Button className="bg-red-tx mt-4" onClick={() => {
          if (newCity != "") {
            addInfo(newCity)
            setTableData(getInfo())
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