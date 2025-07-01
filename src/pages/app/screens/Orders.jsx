import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, AppHeader, Modal, Shape, ModalConfirm } from "@/components";
import * as React from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button as ButtonShad } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, X } from "phosphor-react";
import { toast, Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DayPicker as Calendar } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"

export function Orders() {
  // getInfo() ?? setInfo(); Vai ter que ter algo assim nos services
  // setInfo();
  React.useEffect(() => {
    localStorage.setItem("solicitacoes-admin", JSON.stringify(data));
  })

  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Solicitações" />
        <DataTableDemo />
        <Toaster position="top-right" richColors />
      </SectionApp>
    </>
  );
}

const data = [
  {
    id: 10,
    data: "10/10/2025",
    cliente: "Gerdau",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
    aceitar: "X ✓"
  },
  {
    id: 11,
    data: "10/11/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Pendente",
  },
  {
    id: 12,
    data: "10/12/2025",
    cliente: "Eletrohitiz",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
  },
  {
    id: 13,
    data: "11/12/2025",
    cliente: "Gerdau",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
  },
  {
    id: 14,
    data: "10/12/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
  },
  {
    id: 15,
    data: "11/12/2025",
    cliente: "ViaVerde",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
  },
];

const getColumns = ({ statusFeedback }) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "data",
    header: "Data",
    sortingFn: (rowA, rowB, columnId) => {
      function parseDate(dateString) {
        const parts = dateString.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        return new Date(year, month, day);
      }
      rowA = parseDate(rowA.getValue(columnId))
      rowB = parseDate(rowB.getValue(columnId))
      return rowA > rowB ? 1 : rowA < rowB ? -1 : 0
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("data")}</div>
    ),
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cliente")}</div>
    ),
  },
  {
    accessorKey: "origem",
    header: "Origem/Destino",
    cell: ({ row }) => (
      <div className="capitalize">{
        `${JSON.parse(localStorage.getItem("solicitacoes-admin"))[row.index].origem}/${JSON.parse(localStorage.getItem("solicitacoes-admin"))[row.index].destino}`}</div>
      //   <div className="capitalize">{row.getValue("origem")}</div>
      // (<div className="capitalize">{getOriginDestiny(row.index)}</div>),
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "arrIncludesSome",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Aceitar",
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-3 justify-center">
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={() => {
            if (row.getValue("status") == "Pendente")
              statusFeedback(true, row.id)
          }}>
            <Check />
          </ButtonShad>
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={() => {
            if (row.getValue("status") == "Pendente")
              statusFeedback(false, row.id)
          }}>
            <X />
          </ButtonShad>
        </div>
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
  const [tableData, setTableData] = React.useState([]);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    setColumnVisibility({
      id: !isMobile,
      origem: !isMobile,
      aceitar: !isMobile,
    })
  }, [isMobile])

  React.useEffect(() => {
    setTableData(JSON.parse(localStorage.getItem("solicitacoes-admin")));
  }, [])

  const isChecked = (value) => {
    if (table.getColumn("status").getFilterValue() == null) return false;
    else return table.getColumn("status").getFilterValue().includes(value);
  }

  function filterStatus(value) {
    const statusTable = table.getColumn("status");
    const filteredValue = statusTable.getFilterValue();
    if (filteredValue != null) {
      if (filteredValue.includes(value))
        statusTable.setFilterValue(filteredValue.filter(stat => stat != value));
      else
        statusTable.setFilterValue(prev => [...prev, value]);
    } else statusTable.setFilterValue([value]);
  }

  function statusFeedback(isAccepted, id) {
    const solicitations = JSON.parse(localStorage.getItem("solicitacoes-admin"));
    const solicitation = solicitations[id];
    if (isAccepted) {
      const message = `Solicitação nº ${solicitation.id} de ${solicitation.cliente} foi aceita`;
      solicitation.status = "Aceito";
      toast.success(message);
    }
    else {
      const message = `Solicitação nº ${solicitation.id} de ${solicitation.cliente} foi recusada`;
      solicitation.status = "Recusado";
      toast.info(message);
    }
    localStorage.setItem("solicitacoes-admin", solicitation);
    setTableData(solicitations);
  }

  const columns = getColumns({
    onCancelClick: setSelectedRow,
    onAcceptClick: setSelectedRow,
    statusFeedback: statusFeedback,
  })

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
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20
      },
      sorting: [
        {
          id: 'data',
          desc: true,
        },
      ],
    },
  });

  return (
    <div className="w-full pt-5">
      <div className="flex items-center py-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonShad variant="outline">
              Status <ChevronDown />
            </ButtonShad>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="justify-center px-0">
            <DropdownMenuCheckboxItem
              checked={isChecked("Aceito")}
              onCheckedChange={() => { filterStatus("Aceito") }}
            >
              Aceito
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isChecked("Recusado")}
              onCheckedChange={() => { filterStatus("Recusado") }}
            >
              Recusado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isChecked("Pendente")}
              onCheckedChange={() => { filterStatus("Pendente") }}
            >
              Pendente
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DatePickerDemo></DatePickerDemo>

      </div>
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
                  className="hover:cursor-pointer text-center"
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
        <div className="space-x-2">
          <ButtonShad
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft className="icon" />
          </ButtonShad>
          <ButtonShad
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight className="icon" />
          </ButtonShad>
        </div>
      </div>
      <ModalOrders
        open={!!selectedRow}
        data={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}

function ModalOrders({ open, data, onClose }) {
  if (!open) return null;

  return (
    <Modal open={open} data={data} onClose={onClose}>
      <Shape>
        {data.cliente}
        {data.data}
        {data.origem}
        {data.destino}
      </Shape>

      <Button onClick={onClose}>
        <ButtonText className="text-center">Fechar modal</ButtonText>
      </Button>
    </Modal>
  )
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState([]);
 
  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button
          variant=""
          data-empty={!date.length}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date.length ? date.map(d => d && format(d, "PPP")).join(", ") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-81 p-3 bg-gray-100 z-3">
        <Calendar mode="multiple" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}
