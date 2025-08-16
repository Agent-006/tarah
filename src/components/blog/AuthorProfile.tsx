"use client";

import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorProfileProps {
    name: string;
    avatar?: string;
    socialLinks?: {
        facebook?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
    };
}

export default function AuthorProfile({
    name,
    avatar,
    socialLinks = {},
}: AuthorProfileProps) {
    const socialIcons = [
        { icon: Facebook, url: socialLinks.facebook, color: "#1877F2" },
        { icon: Linkedin, url: socialLinks.linkedin, color: "#0A66C2" },
        { icon: Twitter, url: socialLinks.twitter, color: "#1DA1F2" },
        { icon: Instagram, url: socialLinks.instagram, color: "#E4405F" },
    ];

    return (
        <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-12 h-12 border-2 border-gray-100">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <div className="flex items-center gap-2">
                    {socialIcons.map(({ icon: Icon, url, color }, index) => (
                        <a
                            key={index}
                            href={url || "#"}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-200"
                            style={{ color }}
                            aria-label={`${name}'s social profile`}
                        >
                            <Icon size={16} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
