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
import { Root, Switch, Thumb } from "@radix-ui/react-switch";

import { Button as ButtonShad } from "@/components/ui/button"
import { useState } from "react";
import { useEffect } from "react";
import { MapPin, X } from "phosphor-react";
import { normalize } from "../../../lib/utils";

import { fetchCities } from "@/services/ibge";
import { setInfo, getInfo, updateInfo, updateStatus, addInfo } from "@/services/cities";


export function ManageRoutes() {

  getInfo() ?? setInfo();
  // setInfo();

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

  // useEffect(() => {
  //   console.log(newCity)
  //  }, [newCity]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (isWriting === false) setIsWriting(true);
    const filteredSuggestions = suggestions.filter(suggestion => (normalize(suggestion).includes(normalize(inputValue)))
    )

    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    setNewCity(value);
    console.log(value);
    setInputValue(value);
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
            else setIsWriting(true)
          }}
          onBlur={() => {
            if (normalize(inputValue.toString()) ===
              normalize(filteredSuggestions[0])) { setInputValue(filteredSuggestions[0]); }
            else { setIsWriting(true); }
            setIsWriting(false)
          }} />
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

function ModalAddCity({ onClose, open, setTableData }) {
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
      <CitySearch setNewCity={setNewCity} />
      <Switch
        className="w-10 h-6 bg-gray-300 rounded-full relative"
        style={{ backgroundColor: "rgb(209, 213, 219)" }} // Cor cinza clara
      >
        <Thumb
          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform transform data-[state=checked]:translate-x-4"
          style={{ backgroundColor: "white" }} // Cor branca
        />
      </Switch>
      <div className="flex justify-between">
        <Button className="bg-gray-100 mt-5 w-31 sm:h-12" onClick={() => { onClose() }}>
          <ButtonText className="text-black text-center">
            Cancelar
          </ButtonText>
        </Button>
        <Button className="bg-red-tx mt-5 w-31 sm:h-12" onClick={() => {
          console.log(newCity);
          addInfo(newCity)
          setTableData(getInfo())
        }}>
          <ButtonText className="text-white text-center">
            Adicionar
          </ButtonText>
        </Button>
      </div>
    </ModalSm>
  )
}