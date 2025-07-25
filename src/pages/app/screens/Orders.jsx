import { Button, ButtonText, InputLabel, SectionApp, AppHeader, Modal, Shape, ModalConfirm } from "@/components";
import * as React from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Button as ButtonShad } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, File, Package, ToteSimple, X } from "phosphor-react";
import { toast, Toaster } from "sonner";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { dateString, parseDate } from "@/utils/dateHandler";
import { localStorageUtils } from "@/utils/localStorageUtils";
import { data, addresses } from "@/services/orders";
import styles from "./Orders.module.css";

export function Orders() {
  React.useEffect(() => {
    localStorageUtils.getItem("solicitacoes-admin") ?? localStorageUtils.setItem("solicitacoes-admin", data);
    localStorageUtils.getItem("addresses") ?? localStorageUtils.setItem("addresses", addresses);
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

const getColumns = ({ setRowId, setIsAcceptModalOpen, setIsDeleteModalOpen }) => [
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
    filterFn: "arrIncludesSome",
    sortingFn: (rowA, rowB, columnId) => {
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
        `${localStorageUtils.getItem("solicitacoes-admin")[row.index].origem}/${localStorageUtils.getItem("solicitacoes-admin")[row.index].destino}`}</div>
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
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={event => {
            event.stopPropagation();
            if (row.getValue("status") == "Pendente") {
              setRowId(row.id);
              setIsAcceptModalOpen(true); 
            }
          }}>
            <Check />
          </ButtonShad>
          <ButtonShad variant="secondary" className={`h-8 w-8 p-0 ${row.getValue('status') == 'Pendente' ? ' hover:cursor-pointer' : 'capitalize text-gray-100 cursor-default'}`} onClick={event => {
            event.stopPropagation();
            if (row.getValue("status") == "Pendente") {
              setRowId(row.id);
              setIsDeleteModalOpen(true);
            }
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
  const [rowId, setRowId] = React.useState(0);
  const [tableData, setTableData] = React.useState([]);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();

  React.useEffect(() => {
    setColumnVisibility({
      id: !isMobile,
      origem: !isMobile,
      aceitar: !isMobile,
      status: !isSmallMobile
    })
  }, [isMobile, isSmallMobile])

  React.useEffect(() => {
    setTableData(localStorageUtils.getItem("solicitacoes-admin"));
  }, [])

  const isChecked = (value) => {
    if (table.getColumn("status").getFilterValue() == null) return false;
    else return table.getColumn("status").getFilterValue().includes(value);
  };

  function filterStatus(value) {
    const statusTable = table.getColumn("status");
    const filteredValue = statusTable.getFilterValue();
    if (filteredValue != null) {
      if (filteredValue.includes(value))
        statusTable.setFilterValue(filteredValue.filter(stat => stat != value));
      else
        statusTable.setFilterValue(prev => [...prev, value]);
    } else statusTable.setFilterValue([value]);
  };

  function statusFeedback(isAccepted, id) {
    const solicitations = localStorageUtils.getItem("solicitacoes-admin");
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
    setRowId(null);
    localStorageUtils.setItem("solicitacoes-admin", solicitations);
    setTableData(solicitations);
  };

  const columns = getColumns({
    setRowId: setRowId,
    setIsAcceptModalOpen: setIsAcceptModalOpen,
    setIsDeleteModalOpen: setIsDeleteModalOpen,
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
      <div className="flex items-center py-4 gap-x-3">

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

        <DatePickerDemo filterDate={table.getColumn("data").setFilterValue}></DatePickerDemo>

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
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center"
          >
            <ArrowLeft size={20} className="disabled:opacity-50" />
          </Button>

          <span className="text-sm text-gray-600 mx-2">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <Button
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center"
          >
            <ArrowRight size={20} className="disabled:opacity-50" />
          </Button>
        </div>
      </div>
      <ModalOrders
        open={!!selectedRow}
        data={selectedRow}
        onClose={() => setSelectedRow(null)}
        setRowId={setRowId}
        rowId={rowId}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setIsAcceptModalOpen={setIsAcceptModalOpen}
      />
      <ModalConfirm
        message="Deseja aceitar a solicitação?"
        open={isAcceptModalOpen}
        options={["Não", "Sim"]}
        good
        action={() => {
          statusFeedback(true, rowId);
          setSelectedRow(null);
        }}
        onClose={() => setIsAcceptModalOpen(false)}
      />
      <ModalConfirm
        message="Deseja recusar a solicitação?"
        open={isDeleteModalOpen}
        options={["Não", "Sim"]}
        action={() => {
          statusFeedback(false, rowId);
          setSelectedRow(null); 
        }}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

function ModalOrders({ open, data, onClose, setRowId, setIsAcceptModalOpen, setIsDeleteModalOpen }) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;
  const isPending = data.status == "Pendente";

  const statusColorMap = {
    "Aceito": "bg-success-light/30",
    "Recusado": "bg-danger-light/30", 
    "Pendente": "bg-star/30"
  }

  return (
    <Modal open={open} data={data} onClose={onClose} className="md:w-auto lg:w-5xl overflow-y-auto scrollbar-hidden md:max-h-[95vh]">
      <div className="lg:flex lg:gap-5 lg:flex-row flex flex-col justify-items-center gap-y-4 sm:grid-cols-2 sm:grid sm:gap-x-4">
        <Shape className="border-gray-600 border-1 flex flex-col sm:pt-2 sm:pb-5 sm:px-4 sm:col-span-2 md:max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold">Solicitação</span>
            <span className={`text-sm font-bold px-2 py-1 rounded-lg ${statusColorMap[data.status]}`}>{data.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex flex-col">
              <span className="sm:text-xs font-bold mt-1">Cliente</span>
              <span>{data.cliente}</span>
            </div>
            <div className="flex flex-col">
              <span className="sm:text-xs font-bold mt-1">Data</span>
              <span>{data.data}</span>
            </div>
          </div>
          <span className="sm:text-xs font-bold my-1">Carga</span>
          <Shape className="bg-gray-50 sm:pl-3 sm:pt-3 md:h-full">
            <PackageList packages={data.pacotes} />
          </Shape>
        </Shape>
        <AdressList adress={addresses[0]} title="Endereço de Origem" />
        <AdressList adress={addresses[1]} title="Endereço de Destino" />
      </div>
      {(
        isPending ? (
          <div className="sm:flex sm:flex-row mt-5 lg:justify-self-end sm:gap-3 flex flex-col gap-y-2">
            <Button className="lg:w-50 sm:mt-2" onClick={onClose}>
              <ButtonText className="text-center">Fechar</ButtonText>
            </Button>
            <Button className="bg-red-50 text-danger-base lg:w-50 sm:mt-2" onClick={() => {
              if(isPending) {
                setRowId(localStorageUtils.getItem("solicitacoes-admin").findIndex(info => info.id == data.id));
                setIsDeleteModalOpen(true);
              }
            }}>
              <ButtonText className="text-center">Recusar</ButtonText>
            </Button>
            <Button className="bg-red-tx lg:w-50 sm:mt-2" onClick={() => {
              if(isPending) {
                setRowId(localStorageUtils.getItem("solicitacoes-admin").findIndex(info => info.id == data.id));
                setIsAcceptModalOpen(true);
              }
            }}>
              <ButtonText className="text-center text-white">Aceitar</ButtonText>
            </Button>
          </div>
        )
          : (
            <Button className="mt-5 lg:w-50 justify-self-end" onClick={onClose}>
              <ButtonText className="text-center">Fechar</ButtonText>
            </Button>
          )
      )}
    </Modal>
  )
}

export function DatePickerDemo({ filterDate }) {
  const [date, setDate] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant=""
          data-empty={!date.length}
          className=" hover:cursor-pointer data-[empty=true]:text-muted-foreground w-auto h-auto text-left inline-flex items-center justify-center gap-2 rounded-md font-medium disabled:pointer-events-none border bg-background hover:bg-accent hover:text-accent-foreground sm:h-9 py-2 has-[>svg]:px-3"
        >
          <CalendarIcon size="20"/>
          Escolher data
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-3">
        <Calendar mode="multiple" selected={date} onSelect={setDate} className="rounded-2xl border border-gray-00" />
        <ButtonShad
          className={`float-end mt-1 bg-red-tx hover:cursor-pointer hover:bg-red-tx hover:text-white hover:shadow-none`}
          onClick={() => { 
            filterDate(dateString(date));
            setOpen(false);
          }}>
          Filtrar
        </ButtonShad>
      </PopoverContent>
    </Popover>
  )
}

function PackageList({ packages }) {
  const mocks = [
    { loadType: "caixa", width: 20, height: 20, length: 20, weight: 2 },
    { loadType: "sacola", weight: 3, amount: 2 },
    { loadType: "envelope", amount: 5 },
  ];

  const info = packages.length === 0 ? mocks : packages;

return (
  <div className="flex flex-col gap-2">
    {info.map((pkg, index) => (
      <div
        key={index}
        className="flex gap-x-2 gap-y-1 md:flex md:flex-row md:items-center md:gap-x-4 pb-1 border-b border-gray-100"
      >
      
        <span className="flex items-center">
          {pkg.loadType === "caixa" && <Package size={25} className="self-center" />}
          {pkg.loadType === "envelope" && <File size={25} className="self-center" />}
          {pkg.loadType === "sacola" && <ToteSimple size={25} className="self-center" />}
        </span>
        <div className={`gap-x-2 text-base ${styles.packInfo}`}>
          <div className="flex gap-x-2">
            <span className="capitalize">{pkg.loadType}</span>
            <span>{`${pkg.width || 0}x${pkg.height || 0}x${pkg.length || 0}cm`}</span>
          </div>
          <div className="flex gap-x-2">
            <span >{`${pkg.weight || 0}kg`}</span>
            <span>Qtd:{pkg.amount || 1}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
}

function AdressList({ adress, title }) {
  const labels = ["CEP", "Estado", "Cidade", "Bairro", "Rua", "Número"];

  const mocks = ["87808-500", "Paraná", "Paranavaí", "Fenda do Biquini", "Rua 10", "7"];

  return (
    <Shape className="border-gray-600 border-1 sm:pt-2 sm:pb-5 sm:pl-4 lg:max-w-70 lg:mt-0 md:max-w-90">
      <span className="text-lg font-bold">{title}</span>
      {labels.map((label, index) => (
        <div className="flex flex-col mt-3" key={index}>
          <span className="sm:text-xs font-bold">{label}</span>
          <span className="text-base">{adress.length ?? mocks[index]}</span>
        </div>
      ))}
    </Shape>
  );
}