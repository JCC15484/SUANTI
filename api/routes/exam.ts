import { Router } from 'express';
import { questions } from '../data/questions.js';
import type { QuestionType } from '../../shared/types.js';

const router = Router();

// 按题型比例随机抽取题目，按单选→多选→判断排序
router.get('/random', (req, res) => {
  const count = Math.min(Math.max(parseInt(req.query.count as string) || 50, 1), 155);

  const singleQuestions = questions.filter(q => q.type === 'single');
  const multipleQuestions = questions.filter(q => q.type === 'multiple');
  const judgeQuestions = questions.filter(q => q.type === 'judge');

  // 按比例分配: 单选40% 多选30% 判断30%
  const singleCount = Math.round(count * 0.4);
  const multipleCount = Math.round(count * 0.3);
  const judgeCount = count - singleCount - multipleCount; // 剩余给判断题，避免舍入误差

  const shuffle = <T,>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const pickedSingle = shuffle(singleQuestions).slice(0, Math.min(singleCount, singleQuestions.length));
  const pickedMultiple = shuffle(multipleQuestions).slice(0, Math.min(multipleCount, multipleQuestions.length));
  const pickedJudge = shuffle(judgeQuestions).slice(0, Math.min(judgeCount, judgeQuestions.length));

  // 按题型排序: 单选 → 多选 → 判断
  const selected = [...pickedSingle, ...pickedMultiple, ...pickedJudge];

  // 返回题型分布信息
  const distribution = {
    single: pickedSingle.length,
    multiple: pickedMultiple.length,
    judge: pickedJudge.length,
  };

  res.json({ questions: selected, total: selected.length, distribution });
});

// 获取题库中各题型可用数量
router.get('/stats', (_req, res) => {
  const singleCount = questions.filter(q => q.type === 'single').length;
  const multipleCount = questions.filter(q => q.type === 'multiple').length;
  const judgeCount = questions.filter(q => q.type === 'judge').length;
  res.json({ total: questions.length, single: singleCount, multiple: multipleCount, judge: judgeCount });
});

export default router;
