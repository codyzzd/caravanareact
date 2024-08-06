-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "criado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_caravana" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registro_caravana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_banco" (
    "id" TEXT NOT NULL,
    "numero_banco" INTEGER NOT NULL,
    "id_caravana" TEXT NOT NULL,
    "id_passageiro" TEXT NOT NULL,
    "id_cadastrador" TEXT NOT NULL,

    CONSTRAINT "registro_banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_onibus" (
    "id" TEXT NOT NULL,
    "bancos" INTEGER NOT NULL,
    "foto" TEXT NOT NULL,

    CONSTRAINT "tipos_onibus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_documento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tipos_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_ordenanca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tipos_ordenanca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "id_estaca" TEXT NOT NULL,

    CONSTRAINT "alas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estaca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "estaca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_id_key" ON "usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "registro_caravana_id_key" ON "registro_caravana"("id");

-- CreateIndex
CREATE UNIQUE INDEX "registro_banco_id_key" ON "registro_banco"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_onibus_id_key" ON "tipos_onibus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_documento_id_key" ON "tipos_documento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_ordenanca_id_key" ON "tipos_ordenanca"("id");

-- CreateIndex
CREATE UNIQUE INDEX "alas_id_key" ON "alas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "estaca_id_key" ON "estaca"("id");
