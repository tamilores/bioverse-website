import { prisma } from "@/lib/prisma";

type QA = { question: string; answer: string[] };
type QuestionnaireGroup = { questionnaireName: string; items: QA[] };
type Row = {
	userId: number;
	username: string;
	questionnaireName: string | null;
	questionText: string | null;
	answer: string[] | null;
};

export default async function ViewAnswersPage() {
	const users = await prisma.user.findMany({
  orderBy: { id: "asc" },
  select: {
    id: true,
    username: true,
    responses: {
      select: {
        questionnaireId: true,
        answer: true,
        questionnaire: {
          select: { name: true },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
          },
        },
      },
    },
  },
});

	const userMap = new Map<number, { id: number; username: string; questionnaires: QuestionnaireGroup[] }>();
	const questionnaireMap = new Map<string, QA[]>();

	rows.forEach((row) => {
		if (!userMap.has(row.userId)) {
			userMap.set(row.userId, {
				id: row.userId,
				username: row.username,
				questionnaires: [],
			});
		}

		if (!row.questionnaireName || !row.questionText) return;

		const key = `${row.userId}::${row.questionnaireName}`;
		if (!questionnaireMap.has(key)) questionnaireMap.set(key, []);
		questionnaireMap.get(key)!.push({
			question: row.questionText,
			answer: row.answer ?? [],
		});
	});

	userMap.forEach((user) => {
		const questionnaires: QuestionnaireGroup[] = [];
		questionnaireMap.forEach((items, key) => {
			const [userId, questionnaireName] = key.split("::");
			if (Number(userId) === user.id) {
				questionnaires.push({ questionnaireName, items });
			}
		});
		user.questionnaires = questionnaires;
	});

	const grouped = Array.from(userMap.values());

	return (
		<main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
			<h1 style={{ marginBottom: 16 }}>View Answers</h1>

			{grouped.map((user) => (
				<details key={user.id} style={{ marginBottom: 12, border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
					<summary style={{ cursor: "pointer", fontWeight: 600 }}>
						{user.username}
					</summary>

					{user.questionnaires.length === 0 ? (
						<p style={{ marginTop: 10 }}>No answered questionnaires.</p>
					) : (
						<div style={{ marginTop: 10, paddingLeft: 10 }}>
							{user.questionnaires.map((q) => (
								<details key={q.questionnaireName} style={{ marginBottom: 8 }}>
									<summary style={{ cursor: "pointer" }}>{q.questionnaireName}</summary>
									<ul style={{ marginTop: 8 }}>
										{q.items.map((item, idx) => (
											<li key={`${q.questionnaireName}-${idx}`}>
												<strong>{item.question}:</strong> {item.answer.join(", ")}
											</li>
										))}
									</ul>
								</details>
							))}
						</div>
					)}
				</details>
			))}
		</main>
	);
}
