"use client";

import React, { useEffect, useState } from "react";
import url from "../../environment";
import { useParams } from "next/navigation";
import axios from "axios";

import { Tooltip } from "@nextui-org/react";
import { toast } from "sonner";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import styles from "../app/styles/course.module.scss";

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
import { Edit } from "lucide-react";
import { IoCloseOutline } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Course() {
  const params = useParams();
  const [catalogData, setCatalogData] = useState<any[]>([]);

  type Payment = {
    _id: any;
    id: string;
    name: String;
    description: String;
    images: String;
    startingPrice: String;
    duration: String;
  };

  const deleteCatalog = async (id: any) => {
    const response = await axios.delete(`${url.url}admin/deleteCourse/${id}`);
    if (response.status === 200) {
      // Update catalogData state after successful deletion
      setCatalogData((prevData) => prevData.filter((item) => item._id !== id));
      toast("Catalog Deleted Sucessfully!", {
        position: "top-right",
      });
    }
  };

  const [open, setOpen] = useState(false);

  // update exiting offer
  const [updateCourseData, setUpdateCourseData] = useState({
    name: "",
    description: "",
    level: "",
  });

  const fetchServiceById = async (id: any) => {
    try {
      const response = await axios.get(`${url.url}admin/getCourse/${id}`);
      if (response.status === 200) {
        setUpdateCourseData((prevData) => ({
          ...prevData,
          ...response.data.course,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChangeUpdate = (e: any) => {
    const { name, value } = e.target;
    setUpdateCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // update offer
  const handleUpdateFormSubmit = async (e: any, id: any) => {
    e.preventDefault();
    const currentService = catalogData.find((service) => service._id === id);
    if (!currentService) {
      console.error("Offer not found with id:", id);
      return;
    }

    // Check if any key in formData is empty and track the missing fields
    const missingFields: string[] = [];
    Object.entries(updateCourseData).forEach(([key, value]) => {
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

    let updatedOfferData: React.SetStateAction<any[]> = [];

    try {
      const response = await axios.post(
        `${url.url}admin/updateCourse/${id}`,
        updateCourseData
      );
      if (response.status === 200) {
        updatedOfferData = catalogData.map((offer) => {
          if (offer._id === id) {
            console.log("data change");
            return { ...updateCourseData }; // Update all properties of the offer
          }
          return offer;
        });
        setCatalogData(updatedOfferData);
        toast("Service Updated Successfully", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error in creating catalog:", error);
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="w-[150px]">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <div className="w-[50px]">{row.getValue("level")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="w-[350px]">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("createdAt")}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("updatedAt")}
          </div>
        );
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
                  Do you want to delete this service?
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex justify-end gap-2">
                <DialogClose>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-red-600"
                  onClick={() => {
                    deleteCatalog(payment._id);
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
              <DropdownMenuContent align="end" className="relative">
                <div className="w-[98%] flex justify-end absolute top-2 right-1.5 cursor-pointer">
                  <IoCloseOutline />
                </div>
                <DropdownMenuLabel className="mt-2">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="space-x-2 cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                    fetchServiceById(payment._id);
                    localStorage.setItem("editCourseId", payment._id);
                  }}
                >
                  <Edit size={15} />
                  <p>Edit</p>
                </DropdownMenuItem>
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
        const response = await axios.get(`${url.url}admin/getAllCourses`);
        if (response.status === 200) {
          setCatalogData(response.data.course);
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

  const data: Payment[] = catalogData;

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
        pageSize: 5, // Set the initial page size
      },
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
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
        `${url.url}admin/createCourse`,
        formData
      );
      if (response.status === 200) {
        // update the state
        const data = response.data.course;
        // Add id and createdAt fields to formData
        const updatedFormData = {
          ...formData,
          _id: data._id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        setCatalogData((prevData) => [...prevData, updatedFormData]);
        toast("Course has been created", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error in creating catalog:", error);
    }
  };

  const editServiceId = localStorage.getItem("editCourseId");

  return (
    <>
      {open && (
        <div
          className="fixed top-0 w-full h-[100vh] flex justify-center items-center bg-black bg-opacity-80 z-20"
          onClick={() => {
            setOpen(false);
          }}
        >
          <Card
            className="sm:w-[425px] w-[350px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CardHeader>
              <CardTitle>Update Case</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  handleUpdateFormSubmit(e, editServiceId);
                }}
              >
                <div className="w-11/12 flex flex-col gap-3 mx-auto">
                  <div className="w-full">
                    <Input
                      name="name"
                      placeholder="Service Name"
                      className="col-span-3"
                      onChange={handleInputChangeUpdate}
                      value={updateCourseData.name}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      name="description"
                      placeholder="Description"
                      className="col-span-3"
                      onChange={handleInputChangeUpdate}
                      value={updateCourseData.description}
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <div className={`${styles.catalogTableContainer} w-[70%] mx-auto mt-14`}>
        <div className="pageHeading">
          <span className="text-xl font-semibold">Cases</span>
        </div>
        <div className="flex justify-between py-4">
          <Input
            placeholder="Filter Name.."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Dialog>
              <Tooltip showArrow={true} content="Add Courses">
                <DialogTrigger asChild>
                  <Button className="text-xl rounded-xl bg-slate-800 ml-2">
                    +
                  </Button>
                </DialogTrigger>
              </Tooltip>
              <DialogContent className="w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Case</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="w-11/12 flex flex-col gap-3 mx-auto">
                    <div className="w-full">
                      <Input
                        name="name"
                        placeholder="Course Name"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        name="description"
                        placeholder="Description"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        type="Number"
                        name="level"
                        placeholder="Level"
                        className="col-span-3"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="w-[96%]">
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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
function setCatalogData(arg0: (prevData: any) => any) {
  throw new Error("Function not implemented.");
}
