-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "email" TEXT NOT NULL,
    "name" TEXT DEFAULT '',
    "phone" TEXT DEFAULT '',
    "destination" TEXT DEFAULT '',
    "dates" TEXT DEFAULT '',
    "travelers" TEXT DEFAULT '',
    "budget" TEXT DEFAULT '',
    "interests" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "itinerary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email" ASC);
