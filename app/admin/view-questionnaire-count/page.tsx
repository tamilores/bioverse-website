import { prisma } from "@/lib/prisma";
import QuestionnaireCountTable from "./QuestionnaireCountTable";

export const dynamic = "force-dynamic";

export type UserQuestionnaireSummary = {
	id: number;
	username: string;
	completedCount: number;
	questionnaires: {
		questionnaireName: string;
		items: { question: string; answer: string[] }[];
	}[];
};

export default async function ViewQuestionnaireCountPage() {
	const users = await prisma.user.findMany({
		where: { isAdmin: false },
		orderBy: { id: "asc" },
		select: {
			id: true,
			username: true,
			questionCount: true,
			responses: {
				select: {
					questionnaire: { select: { name: true } },
					question: { select: { question: true } },
					answer: true,
				},
			},
		},
	});

	const summaries: UserQuestionnaireSummary[] = users.map((user) => {
		const questionnaireMap = new Map<string, { question: string; answer: string[] }[]>();

		user.responses.forEach((response) => {
			const questionnaireName = response.questionnaire.name;
			const items = questionnaireMap.get(questionnaireName) ?? [];
			items.push({
				question: response.question.question,
				answer: response.answer,
			});
			questionnaireMap.set(questionnaireName, items);
		});

		return {
			id: user.id,
			username: user.username,
			completedCount: user.questionCount,
			questionnaires: Array.from(questionnaireMap.entries()).map(([questionnaireName, items]) => ({
				questionnaireName,
				items,
			})),
		};
	});

	return <QuestionnaireCountTable users={summaries} />;
}
