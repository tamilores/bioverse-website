"use client";

import { Container, Typography, Card, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from 'next/navigation';

export default function User() {
    const router = useRouter();
        return(
            <>    
                <Typography variant="h3">What are you trying to achieve?</Typography>
    
                <div>
                    <Card sx={{ width: 50, height: 100}}>
                        <Typography variant="subtitle2">Semaglutide</Typography>
                        <div>
                            <IconButton onClick={() => router.push("/questionnaire-one")}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                        <CardMedia
                        component="img"
                        image="/image.jpg"
                        sx={{ width: 50, height: 100}}
                        alt="Semaglutide"/>
                    </Card>
    
                    <Card sx={{ width: 50, height: 100}}>
                        <Typography variant="subtitle2">NAD-Injection</Typography>
                        <div>
                            <IconButton onClick={() => router.push("/questionnaire-two")}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                        <CardMedia
                        component="img"
                        image="/image.jpg"
                        sx={{ width: 50, height: 100}}
                        alt="NAD-Injection"/>
                    </Card>
    
                    <Card sx={{ width: 50, height: 100}}>
                        <Typography variant="subtitle2">Metformin</Typography>
                        <div>
                            <IconButton onClick={() => router.push("/questionnaire-three")}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                        <CardMedia
                        component="img"
                        image="/image.jpg"
                        sx={{ width: 50, height: 100}}
                        alt="Metformin"/>
                    </Card>       
                </div>
            </>
        );
}