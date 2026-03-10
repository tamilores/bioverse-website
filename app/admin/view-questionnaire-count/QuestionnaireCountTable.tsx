"use client";

import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import type { UserQuestionnaireSummary } from "./page";
import "./page.css";

type QuestionnaireCountTableProps = {
  users: UserQuestionnaireSummary[];
};

export default function QuestionnaireCountTable({ users }: QuestionnaireCountTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserQuestionnaireSummary | null>(null);

  return (
    <Box className="vq-count-container">
      <Typography variant="h4" className="vq-count-title">
        Questionnaire Completion
      </Typography>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="vq-count-head-cell">Username</TableCell>
              <TableCell className="vq-count-head-cell" align="right">
                Completed Questionnaires
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                onClick={() => setSelectedUser(user)}
                className="vq-count-row"
              >
                <TableCell>{user.username}</TableCell>
                <TableCell align="right">{user.completedCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedUser ? `${selectedUser.username} - Answered Questionnaires` : "Answered Questionnaires"}
        </DialogTitle>

        <DialogContent dividers>
          {!selectedUser || selectedUser.questionnaires.length === 0 ? (
            <Typography className="vq-count-empty-text">No answered questionnaires.</Typography>
          ) : (
            selectedUser.questionnaires.map((questionnaire) => (
              <Box key={questionnaire.questionnaireName} className="vq-count-group">
                <Typography variant="h6" className="vq-count-group-title">
                  {questionnaire.questionnaireName}
                </Typography>

                {questionnaire.items.map((item, index) => (
                  <Box key={`${questionnaire.questionnaireName}-${index}`} className="vq-count-item">
                    <Typography className="vq-count-question">{`Q. ${item.question}`}</Typography>
                    <Typography className="vq-count-answer">{`A. ${item.answer.join(", ")}`}</Typography>
                    {index < questionnaire.items.length - 1 && <Divider className="vq-count-divider" />}
                  </Box>
                ))}
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
