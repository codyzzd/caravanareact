// config
import moment from "moment-timezone";
import { NextResponse } from "next/server";

// prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Função para combinar data e hora
function combineDateTime(date, time) {
  // Converter data no formato dd/mm/yyyy para o formato ISO
  const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");

  // Criar o objeto Date combinando a data e a hora
  const combinedDateTime = moment(`${formattedDate}T${time}:00.000Z`).toDate();

  // Verificar se a data combinada é válida
  if (!moment(combinedDateTime).isValid()) {
    console.error(`Invalid date or time: ${combinedDateTime}`);
    return new Date(NaN); // Retornar um objeto Date inválido
  }

  return combinedDateTime;
}


// Listar todas as caravanas
export async function GET() {
  try {
    const caravans = await prisma.caravans.findMany(); // Usando o nome correto do modelo
    return NextResponse.json(caravans);
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

// Função para criar uma nova caravana
export async function POST(request) {
  try {
    // Extrair os dados do corpo da requisição
    const { date1, time1, date2, time2, name1 } = await request.json();

    // Validar os dados recebidos
    if (!date1 || !time1 || !date2 || !time2 || !name1) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Combinar data e hora
    const start_travel = combineDateTime(date1, time1);
    const return_travel = combineDateTime(date2, time2);

    // Criar uma nova caravana no banco de dados
    const newCaravan = await prisma.caravans.create({
      data: {
        name: name1,
        start_travel: new Date(start_travel),
        return_travel: new Date(return_travel),
      },
    });

    // Retornar a nova caravana criada como resposta
    return NextResponse.json(newCaravan);
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Error creating record." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Certifique-se de desconectar o Prisma após a operação
  }
}
