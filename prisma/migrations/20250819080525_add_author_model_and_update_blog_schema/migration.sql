/*
  Warnings:

  - You are about to drop the column `authorId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `backlinks` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `authorName` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_authorId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "authorId",
DROP COLUMN "backlinks",
ADD COLUMN     "authorName" TEXT NOT NULL,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "ogImageAlt" TEXT;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
