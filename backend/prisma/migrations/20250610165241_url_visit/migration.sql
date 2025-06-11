-- CreateTable
CREATE TABLE "UrlVisit" (
    "id" SERIAL NOT NULL,
    "url_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlVisit" ADD CONSTRAINT "UrlVisit_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
