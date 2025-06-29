import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, AppHeader, Modal, Shape, ModalConfirm } from "@/components";
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
import { ArrowLeft, ArrowRight, Check, X } from "phosphor-react";
import { toast, Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile"

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

const getColumns = ({ onCancelClick, onAcceptClick }) => [
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
    // sortingFn: (rowA, rowB, columnId) => {
    //   function parseDate(dateString) {
    //     const parts = dateString.split("/");
    //     const day = parseInt(parts[0], 10);
    //     const month = parseInt(parts[1], 10) - 1;
    //     const year = parseInt(parts[2], 10);

    //     return new Date(year, month, day);
    //   }
    //   rowA = parseDate(rowA.getValue(columnId))
    //   rowB = parseDate(rowB.getValue(columnId))
    //   return rowA > rowB ? 1 : rowA < rowB ? -1 : 0
    // },
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
        <div>
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={() => {
            if (row.getValue("status") == "pendente")
              onCancelClick(row.original)
          }}>
            <X />
          </ButtonShad>
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={() => {
            if (row.getValue("status") == "pendente")
              onAcceptClick(row.original)
          }}>
            <Check />
          </ButtonShad>
        </div>
      );
    },
  },
];

// const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={value => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => (
//       <ButtonShad
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Email
//         <ArrowUpDown />
//       </ButtonShad>
//     ),
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"));
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount);

//       return <div className="text-right font-medium">{formatted}</div>;
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <ButtonShad variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </ButtonShad>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

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

  const columns = getColumns({
    onCancelClick: setSelectedRow,
    onAcceptClick: setSelectedRow,
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
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
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
            onCheckedChange={() => {table.getColumn("status").getFilterValue() == null ? table.getColumn("status").setFilterValue("Aceito") : table.getColumn("status").setFilterValue("")}}
          >
              Aceito
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onCheckedChange={() => {table.getColumn("status").getFilterValue() == null ? table.getColumn("status").setFilterValue("Recusado") : table.getColumn("status").setFilterValue("")}}
            >
              Recusado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onCheckedChange={() => {table.getColumn("status").getFilterValue() == null ? table.getColumn("status").setFilterValue("Pendente") : table.getColumn("status").setFilterValue("")}}
            >
              Pendente
            </DropdownMenuCheckboxItem>

          </DropdownMenuContent>
        </DropdownMenu>

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
