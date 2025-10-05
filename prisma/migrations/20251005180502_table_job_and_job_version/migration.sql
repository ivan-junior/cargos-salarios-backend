/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPERADMIN', 'SUPPORT', 'USER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('DRAFT', 'REVIEWING', 'PUBLISHED');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "family" TEXT,
    "area" TEXT,
    "level" TEXT,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'DRAFT',
    "currentVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobVersion" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JobVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobVersion" ADD CONSTRAINT "JobVersion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
