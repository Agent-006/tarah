"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
    children: number;
  };
  parent?: {
    id: string;
    name: string;
  };
};

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryActions = ({
  category,
  onEdit,
  onDelete,
}: CategoryActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(category)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(category)}
          disabled={
            category._count.products > 0 || category._count.children > 0
          }
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{category.name}</span>
          {category.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "parent",
    header: "Parent Category",
    cell: ({ row }) => {
      const parent = row.original.parent;
      return parent ? (
        <Badge variant="outline">{parent.name}</Badge>
      ) : (
        <span className="text-muted-foreground">Root Category</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description ? (
        <span className="text-sm text-muted-foreground max-w-xs truncate">
          {description}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "_count.products",
    header: "Products",
    cell: ({ row }) => {
      const count = row.original._count.products;
      return (
        <Badge variant={count > 0 ? "default" : "secondary"}>{count}</Badge>
      );
    },
  },
  {
    accessorKey: "_count.children",
    header: "Subcategories",
    cell: ({ row }) => {
      const count = row.original._count.children;
      return (
        <Badge variant={count > 0 ? "default" : "secondary"}>{count}</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <CategoryActions
          category={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
