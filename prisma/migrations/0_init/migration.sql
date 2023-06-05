-- CreateTable
CREATE TABLE "orders" (
    "orderid" INTEGER NOT NULL,
    "ordername" VARCHAR(255) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderid")
);

-- CreateTable
CREATE TABLE "users" (
    "personid" SERIAL NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "orderid" INTEGER NOT NULL,

    CONSTRAINT "pk_users" PRIMARY KEY ("personid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_orders" FOREIGN KEY ("orderid") REFERENCES "orders"("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

