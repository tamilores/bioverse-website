import { prisma } from "@/lib/prisma";
import QuestionnaireForm from "./QuestionnaireForm";

export const dynamic = "force-dynamic";   //build issues

type PageProps = {
  searchParams?: { id?: string };
};

export default async function Questionnaire({ searchParams }: PageProps) {
    const id = searchParams?.id;
    const questionnaireId = Number(id ?? 1);

    const junctionData = await prisma.junction.findMany({
    where: {
        questionnaireId,
    },
    select: {
        question: {
        select: {
            id: true,
            question: true,
            type: true,
            options: true,
        },
        },
        questionnaire: {
        select: {
            name: true,
        },
        },
    },
    });

    const questionnaireName = (junctionData[0]?.questionnaire.name ?? "QUESTIONNAIRE").toUpperCase();
    const questions = junctionData.map((row: (typeof junctionData)[number]) => ({
      id: row.question.id,
      question: row.question.question,
      type: row.question.type,
      options: row.question.options,
    }));

    return (
      <QuestionnaireForm
        questionnaireId={questionnaireId}
        questionnaireName={questionnaireName}
        questions={questions}
      />
    );
}