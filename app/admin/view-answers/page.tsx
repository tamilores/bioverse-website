import { prisma } from "@/lib/prisma";
import { 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./page.css";

export const dynamic = "force-dynamic";

export default async function ViewAnswersPage() {
    const users = await prisma.user.findMany({
        where: { isAdmin: false },
        orderBy: { id: "asc" },
        select: {
            id: true,
            username: true,
            responses: {
                select: {
                    answer: true,
                    questionnaire: { select: { name: true } },
                    question: { select: { question: true } },
                },
            },
        },
    });

    const groupedData = users.map((user) => {
        const questionnaireMap = new Map<string, { question: string; answer: string[] }[]>();
        user.responses.forEach((resp) => {
            const qName = resp.questionnaire.name;
            if (!questionnaireMap.has(qName)) questionnaireMap.set(qName, []);
            questionnaireMap.get(qName)!.push({
                question: resp.question.question,
                answer: resp.answer,
            });
        });

        return {
            id: user.id,
            username: user.username,
            questionnaires: Array.from(questionnaireMap.entries()).map(([name, items]) => ({
                questionnaireName: name,
                items,
            })),
        };
    });

    return (
        <Container maxWidth="md" className="view-answers-container">
            <Typography variant="h4" gutterBottom component="h1" className="view-answers-title">
                User Submissions
            </Typography>

            {groupedData.map((user) => (
                <Accordion key={user.id} className="view-answers-accordion">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" className="view-answers-user-title">
                            {user.username} (ID: {user.id})
                        </Typography>
                    </AccordionSummary>
                    
                    <AccordionDetails>
                        {user.questionnaires.length === 0 ? (
                            <Typography className="view-answers-empty-text">No questionnaires answered yet.</Typography>
                        ) : (
                            user.questionnaires.map((q) => (
                                <Box key={q.questionnaireName} className="view-answers-questionnaire-group">
                                    <Typography variant="subtitle1" className="view-answers-questionnaire-title">
                                        {q.questionnaireName.toUpperCase()}
                                    </Typography>
                                    
                                    <List disablePadding>
                                        {q.items.map((item, idx) => (
                                            <Box key={idx}>
                                                <ListItem alignItems="flex-start" className="view-answers-list-item">
                                                    <ListItemText
                                                        primary={`Q. ${item.question}`}
                                                        secondary={`A. ${item.answer.join(", ")}`} />
                                                </ListItem>
                                                {idx < q.items.length - 1 && <Divider component="li" />}
                                            </Box>
                                        ))}
                                    </List>
                                </Box>
                            ))
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}