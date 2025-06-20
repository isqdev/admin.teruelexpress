import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Modal, SectionApp, AppHeader, Shape, ModalSm } from "@/components";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { MapPin } from "phosphor-react";
import { normalize } from "../../../lib/utils";

import { fetchCities } from "@/services/ibge";


export function ManageRoutes() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Gerenciar rotas" />
        <RoutesDataTable />
        <Button onClick={() => setShowModal(true)}>
          <ButtonText>
            Adicionar cidade
          </ButtonText>
        </Button>
        <ModalAddCity open={showModal} onClose={() => setShowModal(false)}/>
      </SectionApp>
    </>
  );
}

const data = [
  {
    id: "m5gr84i9",
    cidade: "Maringá",
    estado: "PR",
    status: "ativo",
    fakeid: 1,
  },
  {
    id: "3u1reuv4",
    cidade: "Londrina",
    estado: "PR",
    status: "inativo",
    fakeid: 2,
  },
  {
    id: "derv1ws0",
    cidade: "Paranavaí",
    estado: "PR",
    status: "ativo",
    fakeid: 3,
  },
  {
    id: "5kma53ae",
    cidade: "Apucarana",
    estado: "PR",
    status: "inativo",
    fakeid: 4,
  },
  {
    id: "bhqecj4p",
    cidade: "Sarandi",
    estado: "PR",
    status: "ativo",
    fakeid: 5,
  },
];

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
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
    accessorKey: "fakeid",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fakeid")}</div>
    ),
  },
];

function RoutesDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRow, setSelectedRow] = React.useState(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={event =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonShad variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </ButtonShad>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-left font-bold">
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
                  onClick={() => setSelectedRow(row.original)}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-left"
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
      </div>
    </div>
  );
}

function CitySearch( ) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    const fetchCitiesApi = async () => {
        const data = await fetchCities();
        return data;
        };
        fetchCitiesApi().then(data => setSuggestions(data));
    }, []);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (isWriting === false) setIsWriting(true);
    console.log(suggestions);
    console.log(typeof(suggestions));
    const filteredSuggestions = suggestions.filter(suggestion => (normalize(suggestion).includes(normalize(inputValue)))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setFilteredSuggestions([]);
    setIsWriting(false);
  };

  return (
    <div className="relative ">
      <InputLabel>Cidade</InputLabel>
      <InputRoot>
        <InputIcon>
          <MapPin className="icon" />
        </InputIcon>
        <InputField value={inputValue} onChange={handleChange} placeholder="Ex: Paranavaí" onFocus={() => { if (normalize(inputValue) === normalize(filteredSuggestions)) setIsWriting(false); else setIsWriting(true) }} onBlur={() => { if (normalize(inputValue) === normalize(filteredSuggestions[0])) { setInputValue(filteredSuggestions[0]); } else { setIsWriting(true); } setIsWriting(false) }} />
      </InputRoot>

      {isWriting && <ul className="bg-gray-50 rounded-2xl absolute top-full z-50 w-full">
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onMouseDown={() => handleSelect(suggestion)} onBlur={() => setIsWriting(false)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2 "> {suggestion}</p>
          </li>
        ))}
      </ul>}
    </div>
  );
};

function ModalAddCity({ onClose, open }) {
  return (
    <ModalSm onClose={onClose} open={open}>
      <h4>Adicionar cidade</h4>
      <InputLabel>Estado</InputLabel>
      <InputRoot className="bg-gray-50">
        <InputIcon>
          <MapPin className="icon" />
        </InputIcon>
        <p>Paraná</p>
      </InputRoot>

      <CitySearch/>
    </ModalSm>
  )
}