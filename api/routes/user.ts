import { Router } from 'express';
import type { UserProgress, SubmissionResult } from '../../shared/types.js';

const router = Router();

let userProgress: UserProgress = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  submissions: [],
  solvedProblems: [],
  favoriteProblems: [],
  totalScore: 0,
};

router.get('/progress', (req, res) => {
  res.json(userProgress);
});

router.get('/submissions', (req, res) => {
  const { problemId } = req.query;
  
  let submissions = [...userProgress.submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  
  if (problemId) {
    submissions = submissions.filter(s => s.problemId === parseInt(problemId as string));
  }
  
  res.json(submissions);
});

router.post('/submissions', (req, res) => {
  const submission = req.body as SubmissionResult;
  
  userProgress.submissions.unshift(submission);
  
  if (submission.status === 'correct' && !userProgress.solvedProblems.includes(submission.problemId)) {
    userProgress.solvedProblems.push(submission.problemId);
    userProgress.totalSolved = userProgress.solvedProblems.length;
    userProgress.totalScore += submission.score;
  }
  
  res.json({ success: true, progress: userProgress });
});

router.post('/favorites/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = userProgress.favoriteProblems.indexOf(id);
  
  if (index > -1) {
    userProgress.favoriteProblems.splice(index, 1);
  } else {
    userProgress.favoriteProblems.push(id);
  }
  
  res.json({ 
    favorite: index === -1,
    favoriteProblems: userProgress.favoriteProblems 
  });
});

export default router;
