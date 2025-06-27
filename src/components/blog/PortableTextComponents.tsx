import { PortableText as PT, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { getImageUrl } from "@/lib/uploadthing";

export const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            const imageUrl = getImageUrl(value.assetKey);

            return (
            <div className="relative w-full h-96 my-8">
                <Image
                    src={imageUrl}
                    alt={value.alt || "Image"}
                    fill
                    className="object-contain"
                />
                {value.caption && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        {value.caption}
                    </p>
                )}
            </div>
        )},
    },
    block: {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold my-6">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-bold my-5">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-bold my-4">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-bold my-3">{children}</h4>
        ),
        normal: ({ children }) => <p className="my-4">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="list-disc pl-6 my-4">{children}</ul>
        ),
        number: ({ children }) => (
            <ol className="list-decimal pl-6 my-4">{children}</ol>
        ),
    },
    marks: {
        link: ({ value, children }) => {
            const target = (value?.href || "").startsWith("http")
                ? "_blank"
                : undefined;
            return (
                <a
                    href={value?.href}
                    target={target}
                    rel={
                        target === "_blank" ? "noopener noreferrer" : undefined
                    }
                    className="text-primary underline hover:text-primary/80"
                >
                    {children}
                </a>
            );
        },
        strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {children}
            </code>
        ),
    },
};

// Export a wrapper component for use in BlogPost
export function PortableText(props: Parameters<typeof PT>[0]) {
    return <PT components={components} {...props} />;
}
