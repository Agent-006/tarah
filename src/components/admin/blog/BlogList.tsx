import { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useAdminBlogStore } from "@/store/admin/adminBlogStore";

interface AdminBlogListProps {
    searchSlug?: string;
    currentPage?: number;
    pageSize?: number;
    setCurrentPage: (page: number) => void;
}

export default function AdminBlogList({
    searchSlug = "",
    currentPage = 1,
    pageSize = 10,
    setCurrentPage,
}: AdminBlogListProps) {
    const { allPosts, isLoading, error, fetchAllPosts } = useAdminBlogStore();

    useEffect(() => {
        fetchAllPosts();
    }, [fetchAllPosts]);

    const filteredPosts = searchSlug.trim()
        ? allPosts.filter((post) =>
              post.slug.toLowerCase().includes(searchSlug.toLowerCase())
          )
        : allPosts;

    const totalPages = Math.ceil(filteredPosts.length / pageSize);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }
    if (filteredPosts.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                No blog post found
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedPosts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">
                                {post.title}
                            </TableCell>
                            <TableCell>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                    {post.slug}
                                </span>
                            </TableCell>
                            <TableCell>
                                {post.author?.fullName || "Unknown Author"}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        post.published
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {post.published ? "Published" : "Draft"}
                                </span>
                            </TableCell>
                            <TableCell>
                                {post.publishedAt
                                    ? formatDate(post.publishedAt)
                                    : "Not published"}
                            </TableCell>
                            <TableCell>{post.views?.length || 0}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <Link
                                            href={`/admin/blog/view/${post.id}`}
                                        >
                                            <span className="sr-only">View</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Link
                                            href={`/admin/blog/edit/${post.id}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="px-2 text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        </>
    );
}
