import { Router } from 'express';
import { questions, getQuestionById, getQuestionListItems, getAllTags } from '../data/questions.js';
import type { QuestionListItem, Difficulty, QuestionType } from '../../shared/types.js';

const router = Router();

router.get('/', (req, res) => {
  const { difficulty, tag, type, search } = req.query;
  
  let result = getQuestionListItems() as QuestionListItem[];
  
  if (difficulty && difficulty !== 'all') {
    result = result.filter(p => p.difficulty === difficulty);
  }
  
  if (tag && tag !== 'all') {
    result = result.filter(p => p.tags.includes(tag as string));
  }
  
  if (type && type !== 'all') {
    result = result.filter(p => p.type === type);
  }
  
  if (search) {
    const searchStr = String(search).toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(searchStr) ||
      p.id.toString().includes(searchStr)
    );
  }
  
  const allTags = getAllTags();
  const allTypes: QuestionType[] = ['single', 'multiple', 'judge'];
  
  res.json({
    problems: result,
    total: result.length,
    allTags,
    allTypes
  });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const question = getQuestionById(id);
  
  if (!question) {
    res.status(404).json({ error: '题目不存在' });
    return;
  }
  
  res.json(question);
});

export default router;
