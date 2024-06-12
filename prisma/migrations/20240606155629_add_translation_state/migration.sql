-- CreateEnum
CREATE TYPE "TranslationState" AS ENUM ('PUBLISHED', 'NOT_PUBLISHED');

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "state" "TranslationState" NOT NULL DEFAULT 'NOT_PUBLISHED';
