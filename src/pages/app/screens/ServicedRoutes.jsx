import React, { useEffect, useState } from "react";
import { ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Modal, SectionApp, AppHeader, Shape } from "@/components";
import { CaretDown, CaretUp, MapPin, Package } from "phosphor-react";
import { normalize } from "../../../lib/utils.ts";

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

import { Button } from "@/components/ui/button"

export function MyShipments() {
  return (
    <>
    </>
  );
}

const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DataTableDemo() {
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
      <div className="flex items-center py-4">
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
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
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
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
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
                  className="hover:cursor-pointer"
                  onClick={() => setSelectedRow(row.original)}
                  data-state={row.getIsSelected() && "selected"}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Modal
        open={!!selectedRow}
        data={selectedRow}
        onClose={() => setSelectedRow(null)}
      >
      </Modal>
    </div>
  );
}

export function ServicedRoutes() {
  const [open, setOpen] = React.useState(false);
  const [cities, setCities] = useState([]);

  // useEffect(() => {
    
  //   fetch('./src/assets/cities.json').
  //     then(data => data.json()).
  //     then(data => setCities(data))
  // }, []);
  useEffect(() => {
    setCities([
    "Alto Paraná",
    "Apucarana",
    "Arapongas",
    "Cambé",
    "Castelo Branco",
    "Jandaia do Sul",
    "Londrina",
    "Mandaguaçu",
    "Mandaguari",
    "Marialva",
    "Maringá",
    "Nova Esperança",
    "Paranavaí",
    "Paraíso do Norte",
    "Rolandia",
    "Sarandi",
    "Tamboara"
    ])
  }, []);  
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Gerenciar rotas"/>
        <DataTableDemo />
        <div className="relative">
          <div className="place-self-end">
            <CitySearch suggestions={cities}/>
          </div>
        </div>
        <Modal classname="bg-gray-600" open={open} onClose={() => setOpen(false)}>Teste</Modal>
      </SectionApp>
    </>
  );
}

function CitySearch({ suggestions }) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (isWriting === false) setIsWriting(true);

    const filteredSuggestions = suggestions.filter(suggestion =>
      normalize(suggestion).includes(normalize(inputValue))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setFilteredSuggestions([]);
    setIsWriting(false);
  };

  return (
    <div className="relative w-80">
      <InputLabel>Adicionar cidade</InputLabel>
      <InputRoot>
        <InputIcon>
          <MapPin className="icon"/>
        </InputIcon>
        <InputField value={inputValue} onChange={handleChange} placeholder="Ex: Paranavaí" onFocus={() => { if (normalize(inputValue) === normalize(filteredSuggestions[0])) setIsWriting(false); else setIsWriting(true) }} onBlur={() => { if (normalize(inputValue) === normalize(filteredSuggestions[0])) { setInputValue(filteredSuggestions[0]); } else { setIsWriting(true); } setIsWriting(false) }} />
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
