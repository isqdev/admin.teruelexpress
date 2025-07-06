import { Button, ButtonText, InputLabel, SectionApp, AppHeader, Modal, Shape } from "@/components";
import * as React from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Button as ButtonShad } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, File, Package, ToteSimple, X } from "phosphor-react";
import { toast, Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { dateString } from "@/utils/dateHandler";

export function Orders() {
  // getInfo() ?? setInfo(); Vai ter que ter algo assim nos services
  // setInfo();
  React.useEffect(() => {
    // localStorage.getItem("solicitacoes-admin") ?? localStorage.setItem("solicitacoes-admin", JSON.stringify(data));
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
    status: "Pendente",
    pacotes: [
      {
        loadType: "envelope",
        width: 0,
        height: 1,
        length: 0,
        weight: 0,
        amount: 5,
      },
      {
        loadType: "caixa",
        width: 2,
        height: 0,
        length: 0,
        weight: 4,
        amount: 1,
      },
      {
        loadType: "sacola",
        width: 0,
        height: 0,
        length: 3,
        weight: 0,
        amount: 1,
      }
    ],
    aceitar: "X ✓"
  },
  {
    id: 11,
    data: "10/11/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Pendente",
    pacotes: [],
  },
  {
    id: 12,
    data: "10/12/2025",
    cliente: "Eletrohitiz",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
    pacotes: [],
  },
  {
    id: 13,
    data: "11/12/2025",
    cliente: "Gerdau",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
    pacotes: [],
  },
  {
    id: 14,
    data: "13/12/2025",
    cliente: "Fipal",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Recusado",
    pacotes: [],
  },
  {
    id: 15,
    data: "11/12/2025",
    cliente: "ViaVerde",
    origem: "Paranavaí",
    destino: "Nova Esperança",
    status: "Aceito",
    pacotes: [],
  },
];

const addresses = [
  // "origem":
  {
    cep: "87701050",
    estado: "pr",
    cidade: "paranavaí",
    bairro: "Jardim Nakamura",
    rua: "Rua Professora Enira Braga de Moraes",
    numero: "56"
  },
  // "destino":
  {
    cep: "87701050",
    estado: "pr",
    cidade: "paranavaí",
    bairro: "Jardim Nakamura",
    rua: "Rua Professora Enira Braga de Moraes",
    numero: "57"
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
    filterFn: "arrIncludesSome",
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
    localStorage.setItem("solicitacoes-admin", JSON.stringify(solicitations));
    setTableData(solicitations);
  };

  const columns = getColumns({
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
        statusFeedback={statusFeedback}
      />
    </div>
  );
}

function ModalOrders({ open, data, onClose, statusFeedback }) {
  if (!open) return null;
  const isPending = data.status == "Pendente";

  return (
    <Modal open={open} data={data} onClose={onClose}>
      <div className="flex gap-5">
        <Shape className="border-gray-600 border-1 flex flex-col sm:pt-2 sm:pb-5 sm:px-4">
          <span className="text-lg font-bold">Solicitação</span>

          <div className="flex flex-row gap-15">
            <div className=" flex flex-col">
              <InputLabel className="sm:text-xs mt-3">Cliente</InputLabel>
              {1 === 1 ? <InputLabel className="font-normal">Gerdau</InputLabel> : data.cliente}
            </div>
            <div className="flex flex-col">
              <InputLabel className="sm:text-xs mt-3">Data</InputLabel>
              {1 === 1 ? <InputLabel className="font-normal">10/08/2025</InputLabel> : data.data}
            </div>
            <div className="flex flex-col">
              <InputLabel className="sm:text-xs mt-3">Status</InputLabel>
              {1 === 1 ? <InputLabel className="font-normal">Pendente</InputLabel> : data.status}
            </div>
          </div>

          <InputLabel className="sm:text-xs my-1">Carga</InputLabel>
          <Shape className="bg-gray-50 sm:pl-3 sm:pt-3 h-full">
            <PackageList packages={data.pacotes} />
          </Shape>

        </Shape>

        {/* <Shape className="border-gray-600 border-1 flex flex-col sm:pt-2 sm:pb-5 sm:pl-4">
          <InputLabel>Endereço de Origem</InputLabel>
          <InputLabel className="sm:text-xs mt-3">CEP</InputLabel> {1 === 1 ? <InputLabel className="font-normal">87808-500</InputLabel> : data.cliente}
          <InputLabel className="sm:text-xs mt-3">Estado</InputLabel> {1 === 1 ? <InputLabel className="font-normal">Paraná</InputLabel> : data.cliente}
          <InputLabel className="sm:text-xs mt-4">Cidade</InputLabel> {1 === 1 ? <InputLabel className="font-normal">Paranavaí</InputLabel> : data.cliente}
          <InputLabel className="sm:text-xs mt-4">Bairro</InputLabel> {1 === 1 ? <InputLabel className="font-normal">Fenda do Biquini</InputLabel> : data.cliente}
          <InputLabel className="sm:text-xs mt-3">Rua</InputLabel> {1 === 1 ? <InputLabel className="font-normal">Rua 10</InputLabel> : data.cliente}
          <InputLabel className="sm:text-xs mt-3">Número</InputLabel> {1 === 1 ? <InputLabel className="font-normal">7</InputLabel> : data.cliente}
        </Shape> */}
        <AdressList adress={addresses[0]} title="Endereço de Origem" />
        <AdressList adress={addresses[1]} title="Endereço de Destino" />

      </div>
      {(
        isPending ? (
          <div className="flex mt-5 justify-self-end gap-2">
            <Button className="w-50 h-10 sm:h-12" onClick={onClose}>
              <ButtonText className="text-center">Fechar</ButtonText>
            </Button>
            <Button className="bg-red-50 text-danger-base w-50 h-10 sm:h-12" onClick={() => {
              if (isPending) statusFeedback(false, JSON.parse(localStorage.getItem("solicitacoes-admin")).findIndex(info => info.id == data.id))
            }}>
              <ButtonText className="text-center">Recusar</ButtonText>
            </Button>
            <Button className="bg-red-tx w-50 h-10 sm:h-12" onClick={() => {
              if (isPending) statusFeedback(true, JSON.parse(localStorage.getItem("solicitacoes-admin")).findIndex(info => info.id == data.id))
            }}>
              <ButtonText className="text-center text-white">Aceitar</ButtonText>
            </Button>
          </div>
        )
          : (
            <Button className="mt-5" onClick={onClose}>
              <ButtonText className="text-center">Fechar</ButtonText>
            </Button>
          )
      )}
    </Modal>
  )
}

export function DatePickerDemo({ filterDate }) {
  const [date, setDate] = React.useState([]);

  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button
          variant=""
          data-empty={!date.length}
          className=" hover:cursor-pointer data-[empty=true]:text-muted-foreground w-60 text-left inline-flex items-center justify-center gap-2 rounded-md font-medium disabled:pointer-events-none border bg-background hover:bg-accent hover:text-accent-foreground sm:h-9 py-2 has-[>svg]:px-3"
        >
          <CalendarIcon />
          <ButtonText className="sm:text-base font-normal">Escolha uma data</ButtonText>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-3">
        <Calendar mode="multiple" selected={date} onSelect={setDate} className="rounded-2xl border border-gray-00" />
        <ButtonShad
          className={`float-end mt-1 bg-red-tx hover:cursor-pointer hover:bg-red-tx hover:text-white hover:shadow-none`}
          onClick={() => {filterDate(dateString(date))}}>
          Filtrar
        </ButtonShad>
      </PopoverContent>
    </Popover>
  )
}

function PackageList({ packages }) {

  return (
    <div className="flex flex-col gap-2">
      {packages.length === 0 ? (
        <p className="text-gray-600 text-center">Nenhum pacote adicionado</p>
      ) : (
        packages.map((pkg, index) => (
          <div key={index} className="flex gap-y-3 justify-between">
            <div className="flex gap-x-3 items-center">
              {pkg.loadType === "caixa" && <Package className="icon" />}
              {pkg.loadType === "envelope" && <File className="icon" />}
              {pkg.loadType === "sacola" && <ToteSimple className="icon" />}
              <span className="capitalize">{pkg.loadType}</span>
              <span>{`${pkg.width || 0}x${pkg.height || 0}x${pkg.length || 0}cm`}</span>
              <span>{`${pkg.weight || 0}kg`}</span>
              <span>Qtd:{pkg.amount || 1}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AdressList({ adress, title }) {
  const labels = ["CEP", "Estado", "Cidade", "Bairro", "Rua", "Número"];

  const mocks = ["87808-500", "Paraná", "Paranavaí", "Fenda do Biquini", "Rua 10", "7"];

  return (
    <Shape className="border-gray-600 border-1 sm:pt-2 sm:pb-5 sm:pl-4 max-w-70">
      <span className="text-lg font-bold">{title}</span>
      {labels.map((label, index) => (
        <div className="flex flex-col mt-3" key={index}>
          <span className="sm:text-xs font-bold">{label}</span>
          <span>{1 == 1 ? mocks[index] : adress.cliente}</span>
        </div>
      ))}
    </Shape>
  );
}