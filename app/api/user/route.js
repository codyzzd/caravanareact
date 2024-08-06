// config
import { NextResponse } from "next/server";

// prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//imports
import moment from "moment-timezone";
import { v4 } from "uuid";
// funcoes
const convertToSaoPauloTime = (date) => {
  // Cria um objeto moment a partir da data
  const momentDate = moment(date);

  // Converte a data para o fuso horário de São Paulo Brasil
  const saoPauloDate = momentDate.tz("America/Sao_Paulo");

  // Retorna a data no fuso horário de São Paulo Brasil
  return saoPauloDate;
};

// Função para gerar um salt seguro para cada usuário
function create_salt() {
  const crypto = require("crypto");
  // Gere um sal aleatório de 16 bytes (tamanho recomendado)
  const salt = crypto.randomBytes(16);
  // Converta o salt para uma string hexadecimal
  const saltHex = salt.toString("hex");
  return saltHex;
}

export default async function handler(req) {
  switch (req.method) {
    case "POST":
      return handlePost(req);
    case "GET":
      return handleGet();
    default:
      return NextResponse.json(
        { error: `Method ${req.method} Not Allowed` },
        { status: 405 }
      );
  }
}
const handlePost = async (req) => {
  try {
    // Gera um ID usando a função uuidv4()
    const id = v4();
    // Obter a data e hora do servidor no fuso horário UTC
    const datetime_now = moment().tz("UTC");
    // Converte o objeto moment para um objeto Date
    const created = datetime_now.toDate();
    //pegar dados
    const requestBody = await request.json();
    const { email, password } = requestBody;
    //criar salt
    const salt = create_salt();
    //definir role como default se nao receber nada
    const role = requestBody.role || "default";

    // Crie um novo registro no banco de dados usando os dados fornecidos
    const createdRecord = await prisma.usuario.create({
      data: {
        id,
        email,
        password,
        salt,
      },
    });

    return NextResponse.json({ record: createdRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Error creating record." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Certifique-se de desconectar o Prisma após a operação
  }
};

const handleGet = async () => {
  try {
    const users = await prisma.usuario.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Error fetching records." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Certifique-se de desconectar o Prisma após a operação
  }
};
