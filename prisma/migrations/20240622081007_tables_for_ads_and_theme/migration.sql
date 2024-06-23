-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_operatorId_fkey";

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "operatorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TitleAd" (
    "countryCode" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "TitleAd_pkey" PRIMARY KEY ("countryCode")
);

-- CreateTable
CREATE TABLE "BannerAd" (
    "countryCode" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "BannerAd_pkey" PRIMARY KEY ("countryCode")
);

-- CreateTable
CREATE TABLE "ColorTheme" (
    "countryCode" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "background" TEXT NOT NULL,

    CONSTRAINT "ColorTheme_pkey" PRIMARY KEY ("countryCode")
);

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
