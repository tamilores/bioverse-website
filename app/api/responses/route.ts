import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingResponse = {
  answer: string[];
  questionId: number;
  questionnaireId: number;
};

type ResponseRow = {
  id: number;
  questionId: number;
  answer: string[];
};

type CookieUser = {
  id: number;
};

function getUserFromCookie(req: NextRequest): CookieUser | null {
  const cookie = req.cookies.get("user")?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as CookieUser;
  } catch {
    try {
      return JSON.parse(decodeURIComponent(cookie)) as CookieUser;
    } catch {
      return null;
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user?.id || !Number.isInteger(user.id)) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const questionnaireIdRaw = req.nextUrl.searchParams.get("questionnaireId");
    const questionnaireId = Number(questionnaireIdRaw);

    if (!questionnaireIdRaw || !Number.isInteger(questionnaireId)) {
      return NextResponse.json({ error: "Invalid questionnaireId" }, { status: 400 });
    }

    const rows: ResponseRow[] = await prisma.responses.findMany({
      where: {
        userId: user.id,
        questionnaireId,
      },
      select: {
        id: true,
        questionId: true,
        answer: true,
      },
      orderBy: { id: "desc" },
    });

    const latestByQuestion = new Map<number, string[]>();
    rows.forEach((row: ResponseRow) => {
      if (!latestByQuestion.has(row.questionId)) {
        latestByQuestion.set(row.questionId, row.answer ?? []);
      }
    });

    return NextResponse.json({
      responses: Array.from(latestByQuestion.entries()).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    });
  } catch (error) {
    console.error("Fetch responses error:", error);
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user?.id || !Number.isInteger(user.id)) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const responses: IncomingResponse[] = Array.isArray(body?.responses) ? body.responses : [];

    if (responses.length === 0) {
      return NextResponse.json({ error: "No responses provided" }, { status: 400 });
    }

    const validResponses = responses.filter(
      (item) =>
        Number.isInteger(item.questionId) &&
        Number.isInteger(item.questionnaireId) &&
        Array.isArray(item.answer),
    );

    if (validResponses.length === 0) {
      return NextResponse.json({ error: "No valid responses provided" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.responses.createMany({
        data: validResponses.map((item) => ({
          userId: user.id,
          questionId: item.questionId,
          questionnaireId: item.questionnaireId,
          answer: item.answer,
        })),
      }),
      
      prisma.user.update({
        where: { id: user.id },
        data: {
          questionCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, count: validResponses.length });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to save responses" }, { status: 500 });
  }
}
