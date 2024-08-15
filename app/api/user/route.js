// config
import { NextResponse } from "next/server";

// prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//imports
import { randomBytes } from "crypto";
import moment from "moment-timezone";
import { v4 } from "uuid";

// funcoes
const convertToSaoPauloTime = (date) => {
  const momentDate = moment(date); // Cria um objeto moment a partir da data
  const saoPauloDate = momentDate.tz("America/Sao_Paulo"); // Converte a data para o fuso horário de São Paulo Brasil
  return saoPauloDate; // Retorna a data no fuso horário de São Paulo Brasil
};

// Função para gerar um salt seguro para cada usuário
function create_salt(size = 16) {
  const salt = randomBytes(size); // Gere um salt aleatório do tamanho especificado
  return salt.toString("hex"); // Converta o salt para uma string hexadecimal
}

export async function POST(request) {
  try {
    const id = v4(); // Gera um ID usando a função uuidv4()

    const requestBody = await request.json(); //pegar dados
    const { email, password } = requestBody;

    const salt = create_salt(); //criar salt
    const role = requestBody.role || "default"; //definir role como default se nao receber nada

    const datetime_now = moment().tz("UTC"); // Obter a data e hora do servidor no fuso horário UTC
    const created = datetime_now.toDate(); // Converte o objeto moment para um objeto Date

    // Crie um novo registro no banco de dados usando os dados fornecidos
    const createdRecord = await prisma.users.create({
      data: {
        id,
        email,
        password,
        salt,
        role,
        created,
      },
    });

    return NextResponse.json({ record: createdRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);

    //console.info("Record that was attempted to be created:", createdRecord);

    return NextResponse.json(
      { error: "Error creating record." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Certifique-se de desconectar o Prisma após a operação
  }
}

// Função para manipular requisições GET
export async function GET() {
  try {
    const users = await prisma.users.findMany();
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
}
