"use client";

import { Typography, Card, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import "./page.css";

const questionnaires = [
    { id: 1, title: "Semaglutide", image: "/image.jpg" },
    { id: 2, title: "NAD-Injection", image: "/image.jpg" },
    { id: 3, title: "Metformin", image: "/image.jpg" },
];

export default function User() {
    const router = useRouter();

    return (
        <main className="user-page">
            <Typography variant="h4" className="user-title">
                Choose Your Questionnaire
            </Typography>

            <div className="user-grid">
                {questionnaires.map((item) => (
                    <Card key={item.id} className="user-card" elevation={1}>
                        <CardMedia component="img" image={item.image} alt={item.title} className="user-image" />

                        <div className="user-card-footer">
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <IconButton
                                aria-label={`Open ${item.title} questionnaire`}
                                onClick={() => router.push(`/user/questionnaires?id=${item.id}`)}
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                    </Card>
                ))}
            </div>
        </main>
    );
}