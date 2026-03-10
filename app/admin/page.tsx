"use client";

import { Typography, Card, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import "../user/page.css";

const modes = [
    { id: 1, title: "View Answers", url: "/admin/view-answers", image: "/image.jpg" },
    { id: 2, title: "View Questionnaire Count", url: "/admin/view-questionnaire-count", image: "/image.jpg" },
];

export default function Admin() {
    const router = useRouter();

    return (
        <main className="admin-page">
            <Typography variant="h4" className="admin-title">
                Choose Your Mode
            </Typography>

            <div className="admin-grid">
                {modes.map((item) => (
                    <Card key={item.id} className="admin-card" elevation={1}>
                        <CardMedia component="img" image={item.image} className="admin-image" />

                        <div className="admin-card-footer">
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <IconButton
                                aria-label={`Open ${item.title} mode`}
                                onClick={() => router.push(item.url)}
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