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
import { MapPin, X } from "phosphor-react";
import { normalize } from "../../../lib/utils";

import { fetchCities } from "@/services/ibge";
import { setInfo, getInfo, updateInfo } from "@/services/cities";


export function ManageRoutes() {
  const [showModal, setShowModal] = useState(false);
  // getInfo() ?? setInfo();
  setInfo();

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
        <ModalAddCity open={showModal} onClose={() => setShowModal(false)} />
      </SectionApp>
    </>
  );
}

const getColumns = ({ onCancelClick }) => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
    // (
    {
      return (
        <Button className="bg-transparent h-8 w-8 p-0 hover:cursor-pointer">
          <div className="capitalize"
          // onClick={() => {row.getValue("status") === "ativo" ? "inativo" : "ativo"}} 
          >
            {row.getValue("status")}
          </div>
        </Button>
      );
    },
    // ),
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
        <Button variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'inativo' ? ' hover:cursor-pointer' : 'cursor-default'}`} onClick={() => {
          if (row.getValue("status") == "inativo")
            onCancelClick(row.original)
        }}>
          <X />
        </Button>
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

  const columns = getColumns({
    onCancelClick: setSelectedRow
  })

  const handleCancel = () => {
    if (!selectedRow) return;

    setTableData(updateInfo(selectedRow.id));
    setSelectedRow(null);
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
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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
        <ModalConfirm
          message="Você realmente deseja cancelar esta solicitação?"
          open={!!selectedRow}
          actionWord="Cancelar"
          action={() => handleCancel()}
          onClose={() => setSelectedRow(null)}
        />

      </div>
    </div>
  );
}

function CitySearch() {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
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
    const filteredSuggestions = suggestions.filter(suggestion => (normalize(suggestion).includes(normalize(inputValue)))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    // setClickedSuggestions();
    setInputValue(value);
    // console.log(clickedSuggestions);
    setFilteredSuggestions([]);
    setIsWriting(false);
  };

  return (
    <div className="relative mt-3">
      <InputLabel>Cidade</InputLabel>
      <InputRoot>
        <InputIcon>
          <MapPin className="icon" />
        </InputIcon>
        <InputField value={inputValue} onChange={handleChange} placeholder="Ex: Paranavaí" 
        onFocus={() => { 
          if (normalize(inputValue.toString()) === normalize(filteredSuggestions.toString()))
           setIsWriting(false); 
          else setIsWriting(true) }}
           onBlur={() => { 
            if (normalize(inputValue.toString()) === 
            normalize(filteredSuggestions[0])) 
            { setInputValue(filteredSuggestions[0]); }
             else { setIsWriting(true); } 
             setIsWriting(false) }} />
      </InputRoot>

      {isWriting && <ul className="bg-gray-50 rounded-2xl absolute top-full z-50 w-full">
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onMouseDown={() => handleSelect(suggestion)} onBlur={() => setIsWriting(false)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2 lowercase"> {suggestion}</p>
          </li>
        ))}
      </ul>}
      {/* {<ul className="bg-gray-50 rounded-2xl absolute top-full z-50 w-full">
        {clickedSuggestions.map((clickedSuggestions, index) => (
          <li key={index} onMouseDown={() => handleSelect(clickedSuggestions)} onBlur={() => setIsWriting(false)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2 lowercase"> {clickedSuggestions}</p>
          </li>
        ))}
      </ul>} */}
    </div>
  );
};

function ModalAddCity({ onClose, open }) {
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
      <CitySearch />
      <Button className="bg-red-tx mt-5 w-31 sm:h-12 place-self-end">
        <ButtonText className="text-white">
          Adicionar
        </ButtonText>
      </Button>
    </ModalSm>
  )
}