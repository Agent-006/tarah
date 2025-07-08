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

export default function AdminBlogList() {
    const { allPosts, isLoading, error, fetchAllPosts } = useAdminBlogStore();

    useEffect(() => {
        fetchAllPosts();
    }, [fetchAllPosts]);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allPosts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium">
                            {post.title}
                        </TableCell>
                        <TableCell>{post.author.fullName}</TableCell>
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
                        <TableCell>{post.views.length}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="icon">
                                    <Link href={`/admin/blog/edit/${post.id}`}>
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
    );
}
