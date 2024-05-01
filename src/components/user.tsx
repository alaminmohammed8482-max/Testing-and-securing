"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import styles from "../app/styles/user.module.scss";
import url from "../../environment";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tooltip } from "@nextui-org/tooltip";
import { toast } from "sonner";

export type Payment = {
  _id: string;
  id: string;
  name: String;
  email: string;
  phone: String;
  createdAt: String;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-2"
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-left">Phone</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("phone")}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-left">Created At</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("createdAt")}</div>
      );
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
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment._id)}
            >
              Copy User ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function User() {
  const params = useParams();
  const [userData, setUserData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Check if any key in formData is empty and track the missing fields
      const missingFields: string[] = [];
      Object.entries(formData).forEach(([key, value]) => {
        if (value === "") {
          missingFields.push(key);
        }
      });

      if (missingFields.length > 0) {
        // Show error message with the names of missing fields
        toast.error(
          `Please fill in the following fields: ${missingFields.join(", ")}`,
          {
            position: "top-right",
          }
        );
        return;
      }

      const response = await axios.post(
        `${url.url}admin/createUser`,
        formData
      );
      if (response.status === 200) {
        // update the state
        const data = response.data.user;
        // Add id and createdAt fields to formData
        const updatedFormData = {
          ...formData,
          _id: data._id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        setUserData((prevData) => [...prevData, updatedFormData]);

        toast("Service Created Successfully", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error in creating catalog:", error);
      toast.error("Failed to create service", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`${url.url}admin/getAllUsers`);
        if (response.status === 200) {
          console.log(response.data.user);
          setUserData(response.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRequest();
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data: Payment[] = userData;

  console.log(userData);

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
    initialState: {
      pagination: {
        pageIndex: 0, // Set the initial page index
        pageSize: 8, // Set the initial page size
      },
    },
  });

  const [selectFilter, setSelectFilter] = useState("Filter Email");

  return (
    <>
      <div className={`${styles.userTableContainer} w-[70%] mx-auto mt-14`}>
        <div className="pageHeading">
          <span className="text-xl font-semibold">Polices</span>
        </div>
        <div className={`${styles.tableControllers} flex justify-between py-4`}>
          <div className="flex gap-2">
            <div className="w-[210px]">
              <Select
                value={selectFilter}
                onValueChange={setSelectFilter}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Filter Email">Filter Email</SelectItem>
                    <SelectItem value="Filter Name">Filter Name</SelectItem>
                    <SelectItem value="Filter Phone">Filter Phone</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectFilter === "Filter Email" ? (
              <Input
                placeholder="Filter Email.."
                value={
                  (table.getColumn("email")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            ) : selectFilter === "Filter Name" ? (
              <Input
                placeholder="Filter Name.."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            ) : (
              <Input
                placeholder="Filter Phone.."
                value={
                  (table.getColumn("phone")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("phone")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Dialog>
              <Tooltip showArrow={true} content="Add Instructor">
                <DialogTrigger asChild>
                  <Button className="text-xl rounded-xl bg-slate-800 ml-2">
                    +
                  </Button>
                </DialogTrigger>
              </Tooltip>
              <DialogContent className="sm:w-[425px] w-[350px]">
                <DialogHeader className="text-start">
                  <DialogTitle>Add Police</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="w-11/12 flex flex-col gap-3 mx-auto">
                    <div className="w-full">
                      <Input
                        name="name"
                        placeholder="Name"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        name="email"
                        placeholder="Email"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        type="Number"
                        name="phone"
                        placeholder="Phone"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 sm:ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className={` ${styles.table} rounded-md border`}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.slice()
                  .reverse()
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} row(s).
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
      </div>
    </>
  );
}
