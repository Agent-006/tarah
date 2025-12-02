import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDefaultAuthors() {
  try {
    // Create some default authors
    const authors = [
      {
        name: "John Doe",
        bio: "Senior Content Writer with 5+ years of experience in technology and business writing.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      },
      {
        name: "Jane Smith",
        bio: "Marketing Specialist and Content Creator passionate about digital storytelling.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b2b5?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      },
      {
        name: "Alex Johnson",
        bio: "Technical Writer and Developer Advocate with expertise in web development.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      },
    ];

    for (const authorData of authors) {
      try {
        const existingAuthor = await prisma.author.findUnique({
          where: { name: authorData.name },
        });

        if (!existingAuthor) {
          await prisma.author.create({
            data: authorData,
          });
          console.log(`Created author: ${authorData.name}`);
        } else {
          console.log(`Author ${authorData.name} already exists`);
        }
      } catch (error) {
        console.error(`Error creating author ${authorData.name}:`, error);
      }
    }

    console.log("Default authors setup completed!");
  } catch (error) {
    console.error("Error setting up default authors:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAuthors();
