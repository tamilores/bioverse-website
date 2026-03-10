"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography 
} from "@mui/material";
import { useUser } from "@/app/context/UserContext";

type Question = {
  id: number;
  question: string;
  type: string;
  options: string[];
};

type QuestionnaireFormProps = {
  questionnaireId: number;
  questionnaireName: string;
  questions: Question[];
};

export default function QuestionnaireForm({
  questionnaireId,
  questionnaireName,
  questions,
}: QuestionnaireFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [answers, setAnswers] = useState<Record<number, string[]>>({});

  const allQuestionsAnswered = useMemo(
    () =>
      questions.length > 0 &&
      questions.every((q) => answers[q.id]?.some((val) => val.trim() !== "")),
    [answers, questions]
  );

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: [value] }));
  };

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked
          ? [...current, option]
          : current.filter((item) => item !== option),
      };
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function loadExistingAnswers() {
      try {
        const response = await fetch(`/api/responses?questionnaireId=${questionnaireId}`, {
          method: "GET",
        });

        if (!response.ok) return;

        const data = await response.json();
        const existing = Array.isArray(data?.responses) ? data.responses : [];
        const mapped: Record<number, string[]> = {};

        existing.forEach((item: { questionId: number; answer: string[] }) => {
          if (!Number.isInteger(item?.questionId) || !Array.isArray(item?.answer)) return;
          mapped[item.questionId] = item.answer;
        });

        if (!isMounted) return;

        setAnswers((prev) => (Object.keys(prev).length > 0 ? prev : mapped));
      } catch {      }
    }

    loadExistingAnswers();

    return () => {
      isMounted = false;
    };
  }, [questionnaireId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user || !allQuestionsAnswered) return;

    const responses = questions.map((q) => ({
      questionId: q.id,
      questionnaireId,
      answer: (answers[q.id] ?? []).map((a) => a.trim()).filter(Boolean),
    }));

    await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses }),
    });

    alert("Submitted successfully");
    router.push("/user");
  }

  return (
    <form onSubmit={handleSubmit} className="questionnaire-form">
      <Stack spacing={2} className="questionnaire-stack">
        <Typography variant="h4" className="questionnaire-title">
          {questionnaireName} QUESTIONNAIRE
        </Typography>

        {questions.map((q, index) => {
          const currentAnswer = answers[q.id] || [];

          return (
            <Card key={q.id} className="questionnaire-card" elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. {q.question}
                </Typography>

                {q.type === "input" && (
                  <TextField
                    placeholder="Enter your answer"
                    value={currentAnswer[0] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    fullWidth
                  />
                )}

                {q.type === "mcq" && (
                  <FormGroup>
                    {q.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            value={option}
                            checked={currentAnswer.includes(option)}
                            onChange={(e) =>
                              handleCheckboxChange(q.id, option, e.target.checked)
                            }
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Button
          type="submit"
          variant="contained"
          className="submit-button questionnaire-submit"
          disabled={!user || !allQuestionsAnswered}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}