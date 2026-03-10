import { prisma } from "@/lib/prisma"; // Import the client you just made
import { Typography, Card, CardContent, Stack, TextField, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Questionnaire({ searchParams }: PageProps) {
    const { id } = await searchParams;
    const junctionData = await prisma.junction.findMany({
    where: {
        questionnaireId: Number(id ?? 1), 
    },
    select: {
        question: {
        select: {
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

    return (
        <Stack>
            <Typography variant="h3">{junctionData[0]?.questionnaire.name} Questionnaire</Typography>
            {junctionData.map((row, index) => {
                const name = row.questionnaire.name;
                const q = row.question;
                const qType = q.type;
                const options = qType === "mcq" ? q.options : [];

                return (
                    <Card key={index}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom> {index + 1}. {q.question} </Typography>

                        {qType === "input" && (
                        <TextField
                            placeholder="Enter your answer"
                            name={`${index}`} />
                        )}

                        {qType === "mcq" && (
                        <FormGroup>
                            {options.map((option, optIndex) => (
                            <FormControlLabel
                                key={optIndex}
                                control={<Checkbox name={`${index}`} value={option} />}
                                label={option}
                            />
                            ))}
                        </FormGroup>
                        )}
                    </CardContent>
                    </Card>
                );
                })}
        </Stack>
  );
}