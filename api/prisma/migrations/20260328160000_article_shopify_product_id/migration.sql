-- AlterTable
ALTER TABLE "articles" ADD COLUMN "shopifyProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "articles_companyId_shopifyProductId_key" ON "articles"("companyId", "shopifyProductId");
