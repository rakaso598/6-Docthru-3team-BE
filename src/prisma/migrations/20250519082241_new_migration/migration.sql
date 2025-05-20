/*
  Warnings:

  - Added the required column `title` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "title" TEXT NOT NULL;
