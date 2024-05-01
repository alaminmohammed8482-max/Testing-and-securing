"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import styles from "../app/styles/assignLectures.module.scss";
import url from "../../environment";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  CalendarIcon,
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
import { toast } from "sonner";
import { CalendarDate, Switch, Tooltip, cn } from "@nextui-org/react";
import { AiOutlineDelete } from "react-icons/ai";
import { Edit } from "lucide-react";
import { DateInput } from "@nextui-org/date-input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MdContentCopy } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

export type Payment = {
  _id: any;
  id: string;
  code: string;
  description: String;
  discountType: String;
  discountValue: String;
  minPrice: String;
  active: String;
};

export default function AssignLecture() {
  const params = useParams();
  const [offerData, setOfferData] = useState<any[]>([]);
  const [isOfferActive, setIsOfferActive] = useState("");
  const [instructor, setInstructor] = useState("");
  const [lecture, setLecture] = useState("");

  const [userData, setUserData] = useState([]);
  const [lectureData, setLectureData] = useState([]);

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // delete offer
  const deleteOffer = async (id: any) => {
    const response = await axios.delete(
      `${url.url}admin/deleteAssignLecture/${id}`
    );
    if (response.status === 200) {
      // Update serviceData state after successfully deletion
      setOfferData((prevData) => prevData.filter((item) => item._id !== id));
      toast("Offer Deleted Sucessfully!", {
        position: "top-right",
      });
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "userName",
      header: "Instructor",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-left">Discount Value</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.getValue("date")}</div>
        );
      },
    },
    {
      accessorKey: "courseName",
      header: "Case Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("courseName")}</div>
      ),
    },
    {
      accessorKey: "lectureName",
      header: "Case Assign",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("lectureName")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("createdAt")}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("updatedAt")}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <Dialog>
            <DialogContent className="w-[300px]">
              <DialogHeader>
                <DialogDescription>
                  Do you want delete this offer?
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex justify-end gap-2">
                <DialogClose>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-red-600"
                  onClick={() => {
                    deleteOffer(payment._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem className="space-x-2 cursor-pointer">
                    <AiOutlineDelete size={15} />
                    <p>Delete</p>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `${url.url}admin/getAllAssignLectures`
        );
        if (response.status === 200) {
          setOfferData(response.data.assignLecture);
        }
        const userResponse = await axios.get(`${url.url}admin/getAllUsers`);
        if (userResponse.status === 200) {
          setUserData(userResponse.data.user);
        }
        const lectureResponse = await axios.get(
          `${url.url}admin/getAllLectures`
        );
        if (lectureResponse.status === 200) {
          setLectureData(lectureResponse.data.lecture);
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

  const data: Payment[] = offerData;

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

  const [formData, setFormData] = useState({
    userName: "",
    lectureId: "",
    date: "",
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    // const formattedDate = date.toLocaleDateString("en-GB");
    const formattedDate = date ? date.toLocaleDateString("en-GB") : "No date";
    formData.userName = instructor;
    formData.lectureId = lecture;
    formData.date = formattedDate;

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

    console.log(formData);

    try {
      const response = await axios.post(
        `${url.url}admin/assignLecture`,
        formData
      );
      if (response.status === 200) {
        // update the state
        const data = response.data.assignLecture;
        // Add id and createdAt fields to formData
        const updatedFormData = {
          ...formData,
          _id: data._id,
          courseName: data.courseName,
          lectureName: data.lectureName,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        setOfferData((prevData) => [...prevData, updatedFormData]);
        toast("Service Created Successfully", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error in assigning lecture:", error);
      if (error.response.status === 400) {
        toast(
          "Instructor already assigned lecture on this date please select other date",
          {
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
            position: "top-right",
          }
        );
      }
    }
  };

  const [selectFilter, setSelectFilter] = useState("Filter Instructor");

  return (
    <>
      <div className={`${styles.offerTableContainer} w-[70%] mx-auto mt-14`}>
        <div className="pageHeading">
          <span className="text-xl font-semibold">Assign Lectures</span>
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
                    <SelectItem value="Filter Instructor">Police</SelectItem>
                    <SelectItem value="Filter Lecture">Lecture</SelectItem>
                    <SelectItem value="Filter Course">Course</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectFilter === "Filter Instructor" ? (
              <Input
                placeholder="Filter Instructor.."
                value={
                  (table.getColumn("userName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("userName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            ) : selectFilter === "Filter Lecture" ? (
              <Input
                placeholder="Filter Lecture.."
                value={
                  (table
                    .getColumn("lectureName")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("lectureName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            ) : (
              <Input
                placeholder="Filter Course.."
                value={
                  (table.getColumn("courseName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("courseName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Dialog>
              <Tooltip showArrow={true} content="Assign Lecture">
                <DialogTrigger asChild>
                  <Button className="text-xl rounded-xl bg-slate-800 ml-2">
                    +
                  </Button>
                </DialogTrigger>
              </Tooltip>
              <DialogContent className="sm:w-[425px] w-[350px]">
                <DialogHeader>
                  <DialogTitle>Assign Case</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="w-11/12 flex flex-col gap-3 mx-auto">
                    <div className="w-full">
                      <Select
                        value={instructor}
                        onValueChange={setInstructor}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Police" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {userData ? (
                              userData.map((user: any) => {
                                return (
                                  <div key={user._id}>
                                    <SelectItem value={user.name}>
                                      {user.name}
                                    </SelectItem>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No Instructor</p>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full">
                      <Select
                        value={lecture}
                        onValueChange={setLecture}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {lectureData ? (
                              lectureData.map((lecture: any) => {
                                return (
                                  <div key={lecture._id}>
                                    <SelectItem value={lecture._id}>
                                      {lecture.name}
                                    </SelectItem>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No Instructor</p>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date: any) =>
                              date <
                              new Date(
                                new Date().getTime() - 24 * 60 * 60 * 1000
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
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
                <Button variant="outline">
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
