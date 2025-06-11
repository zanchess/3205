-- CreateIndex
CREATE INDEX "Url_alias_idx" ON "Url"("alias");

-- CreateIndex
CREATE INDEX "UrlVisit_url_id_ip_visited_at_idx" ON "UrlVisit"("url_id", "ip", "visited_at");
