-- CreateTable
CREATE TABLE "addresses" (
    "zipcode" TEXT NOT NULL,
    "patio" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "locality" TEXT,
    "uf" CHAR(2) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("zipcode")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zipcode" TEXT NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" BIGINT NOT NULL,
    "zipcode" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "number" SERIAL NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_number" INTEGER NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_number" INTEGER NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_origin_number" INTEGER NOT NULL,
    "account_destiny_number" INTEGER NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_zipcode_key" ON "addresses"("zipcode");

-- CreateIndex
CREATE UNIQUE INDEX "banks_number_key" ON "banks"("number");

-- CreateIndex
CREATE UNIQUE INDEX "banks_agency_key" ON "banks"("agency");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_zipcode_fkey" FOREIGN KEY ("zipcode") REFERENCES "addresses"("zipcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_zipcode_fkey" FOREIGN KEY ("zipcode") REFERENCES "addresses"("zipcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_account_number_fkey" FOREIGN KEY ("account_number") REFERENCES "accounts"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_account_number_fkey" FOREIGN KEY ("account_number") REFERENCES "accounts"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_account_origin_number_fkey" FOREIGN KEY ("account_origin_number") REFERENCES "accounts"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_account_destiny_number_fkey" FOREIGN KEY ("account_destiny_number") REFERENCES "accounts"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
