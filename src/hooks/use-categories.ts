// hooks/use-categories.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
  children?: Category[];
  imageUrl?: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
    children: number;
  };
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use the admin categories endpoint which includes parent/children info
        const { data } = await axios.get("/api/admin/categories");
        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    data: categories,
    isLoading,
    error,
  };
};
