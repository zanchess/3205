-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_alias_key" ON "Url"("alias");
