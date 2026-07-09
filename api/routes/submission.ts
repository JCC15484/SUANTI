import { Router } from 'express';
import { getQuestionById } from '../data/questions.js';
import type { SubmissionResult } from '../../shared/types.js';

const router = Router();

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

router.post('/:id/submit', (req, res) => {
  const id = parseInt(req.params.id);
  const { userAnswer } = req.body;
  
  const question = getQuestionById(id);
  
  if (!question) {
    res.status(404).json({ error: '题目不存在' });
    return;
  }
  
  const sortedUserAnswer = [...userAnswer].sort();
  const sortedCorrectAnswer = [...question.answer].sort();
  const isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
  
  const result: SubmissionResult = {
    id: generateId(),
    problemId: id,
    status: isCorrect ? 'correct' : 'wrong',
    userAnswer,
    correctAnswer: question.answer,
    score: isCorrect ? question.score : 0,
    submittedAt: new Date().toISOString()
  };
  
  res.json(result);
});

export default router;
