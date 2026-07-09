import type { Problem } from '../../shared/types';

export const problems: Problem[] = [
  {
    id: 1,
    title: '两数之和',
    difficulty: 'easy',
    tags: ['数组', '哈希表'],
    acceptanceRate: 52.3,
    description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    hints: [
      '使用哈希表可以将查找时间从 O(n) 降低到 O(1)。',
      '遍历数组时，检查 target - nums[i] 是否已在哈希表中。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' },
      { input: '[1,2,3,4,5]\n9', expectedOutput: '[3,4]' },
      { input: '[0,4,3,0]\n0', expectedOutput: '[0,3]' }
    ]
  },
  {
    id: 2,
    title: '回文数',
    difficulty: 'easy',
    tags: ['数学'],
    acceptanceRate: 58.7,
    description: `给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

例如，121 是回文，而 123 不是。`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '从左向右读, 为 121 。从右向左读, 也是 121 。'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: '从左向右读, 为 -121 。从右向左读, 为 121- 。因此它不是一个回文数。'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: '从右向左读, 为 01 。因此它不是一个回文数。'
      }
    ],
    hints: [
      '负数不可能是回文数。',
      '你可以将数字转换为字符串来解决这个问题，但也可以尝试不转换。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    
};`,
      typescript: `function isPalindrome(x: number): boolean {
    
}`,
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        
    }
}`
    },
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' },
      { input: '0', expectedOutput: 'true' },
      { input: '12321', expectedOutput: 'true' }
    ]
  },
  {
    id: 3,
    title: '合并两个有序链表',
    difficulty: 'easy',
    tags: ['链表', '递归'],
    acceptanceRate: 66.2,
    description: `将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。`,
    examples: [
      {
        input: 'l1 = [1,2,4], l2 = [1,3,4]',
        output: '[1,1,2,3,4,4]'
      },
      {
        input: 'l1 = [], l2 = []',
        output: '[]'
      },
      {
        input: 'l1 = [], l2 = [0]',
        output: '[0]'
      }
    ],
    hints: [
      '可以使用迭代或递归的方法来解决。',
      '注意处理其中一个链表先遍历完的情况。'
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    
};`,
      typescript: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}`
    },
    testCases: [
      { input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { input: '[]\n[]', expectedOutput: '[]' },
      { input: '[]\n[0]', expectedOutput: '[0]' }
    ]
  },
  {
    id: 4,
    title: '最长公共前缀',
    difficulty: 'easy',
    tags: ['字符串', '字典树'],
    acceptanceRate: 43.1,
    description: `编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。`,
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"'
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: '输入不存在公共前缀。'
      }
    ],
    hints: [
      '可以使用纵向扫描的方法，从前往后逐个字符比较。',
      '也可以使用分治法，类似于归并排序的思路。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    
};`,
      typescript: `function longestCommonPrefix(strs: string[]): string {
    
}`,
      python: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        pass`,
      java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        
    }
}`
    },
    testCases: [
      { input: '["flower","flow","flight"]', expectedOutput: '"fl"' },
      { input: '["dog","racecar","car"]', expectedOutput: '""' },
      { input: '["a"]', expectedOutput: '"a"' }
    ]
  },
  {
    id: 5,
    title: '有效的括号',
    difficulty: 'easy',
    tags: ['栈', '字符串'],
    acceptanceRate: 44.5,
    description: `给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    hints: [
      '使用栈来存储遇到的左括号。',
      '遇到右括号时，检查栈顶是否是对应的左括号。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`,
      typescript: `function isValid(s: string): boolean {
    
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' }
    ]
  },
  {
    id: 6,
    title: '无重复字符的最长子串',
    difficulty: 'medium',
    tags: ['哈希表', '字符串', '滑动窗口'],
    acceptanceRate: 38.9,
    description: `给定一个字符串 s ，请你找出其中不含有重复字符的最长子串的长度。`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: '因为无重复字符的最长子串是 "abc"，所以其长度为 3。'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: '因为无重复字符的最长子串是 "b"，所以其长度为 1。'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: '因为无重复字符的最长子串是 "wke"，所以其长度为 3。'
      }
    ],
    hints: [
      '使用滑动窗口的思想，维护一个无重复字符的窗口。',
      '用哈希表记录字符最后出现的位置。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    
};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
      { input: '""', expectedOutput: '0' },
      { input: '"au"', expectedOutput: '2' }
    ]
  },
  {
    id: 7,
    title: '最长回文子串',
    difficulty: 'medium',
    tags: ['字符串', '动态规划'],
    acceptanceRate: 36.4,
    description: `给你一个字符串 s，找到 s 中最长的回文子串。

如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" 同样是符合题意的答案。'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    hints: [
      '可以使用动态规划，dp[i][j] 表示 s[i..j] 是否是回文串。',
      '也可以使用中心扩展法，枚举所有可能的回文中心。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    
};`,
      typescript: `function longestPalindrome(s: string): string {
    
}`,
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        pass`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        
    }
}`
    },
    testCases: [
      { input: '"babad"', expectedOutput: '"bab"' },
      { input: '"cbbd"', expectedOutput: '"bb"' },
      { input: '"a"', expectedOutput: '"a"' },
      { input: '"ac"', expectedOutput: '"a"' }
    ]
  },
  {
    id: 8,
    title: '三数之和',
    difficulty: 'medium',
    tags: ['数组', '双指针', '排序'],
    acceptanceRate: 35.2,
    description: `给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。

请你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: '不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: '唯一可能的三元组和不为 0 。'
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: '唯一可能的三元组和为 0 。'
      }
    ],
    hints: [
      '先对数组进行排序，然后使用双指针法。',
      '注意去重，避免重复的三元组。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    
};`,
      typescript: `function threeSum(nums: number[]): number[][] {
    
}`,
      python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        pass`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        
    }
}`
    },
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expectedOutput: '[]' },
      { input: '[0,0,0]', expectedOutput: '[[0,0,0]]' }
    ]
  },
  {
    id: 9,
    title: '反转链表',
    difficulty: 'easy',
    tags: ['链表', '递归'],
    acceptanceRate: 74.8,
    description: `给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      },
      {
        input: 'head = []',
        output: '[]'
      }
    ],
    hints: [
      '可以使用迭代或递归的方法。',
      '迭代法需要三个指针：prev、curr、next。'
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    
};`,
      typescript: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
function reverseList(head: ListNode | null): ListNode | null {
    
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}`
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' },
      { input: '[]', expectedOutput: '[]' }
    ]
  },
  {
    id: 10,
    title: '二叉树的最大深度',
    difficulty: 'easy',
    tags: ['树', '深度优先搜索', '广度优先搜索', '二叉树'],
    acceptanceRate: 77.5,
    description: `给定一个二叉树 root ，返回其最大深度。

二叉树的最大深度是指从根节点到最远叶子节点的最长路径上的节点数。`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3'
      },
      {
        input: 'root = [1,null,2]',
        output: '2'
      }
    ],
    hints: [
      '可以使用递归，树的最大深度等于左右子树最大深度加1。',
      '也可以使用层序遍历（BFS），统计层数。'
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    
};`,
      typescript: `/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
function maxDepth(root: TreeNode | null): number {
    
}`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        pass`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        
    }
}`
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3' },
      { input: '[1,null,2]', expectedOutput: '2' },
      { input: '[]', expectedOutput: '0' }
    ]
  },
  {
    id: 11,
    title: '爬楼梯',
    difficulty: 'easy',
    tags: ['记忆化搜索', '数学', '动态规划'],
    acceptanceRate: 53.2,
    description: `假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: '有两种方法可以爬到楼顶。1. 1 阶 + 1 阶 2. 2 阶'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: '有三种方法可以爬到楼顶。1. 1 阶 + 1 阶 + 1 阶 2. 1 阶 + 2 阶 3. 2 阶 + 1 阶'
      }
    ],
    hints: [
      '这是一个斐波那契数列问题。',
      '到达第 n 阶的方法数等于到达第 n-1 阶和第 n-2 阶方法数之和。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    
};`,
      typescript: `function climbStairs(n: number): number {
    
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        
    }
}`
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' },
      { input: '5', expectedOutput: '8' }
    ]
  },
  {
    id: 12,
    title: '买卖股票的最佳时机',
    difficulty: 'easy',
    tags: ['数组', '动态规划'],
    acceptanceRate: 58.9,
    description: `给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: '在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: '在这种情况下, 没有交易完成, 所以最大利润为 0。'
      }
    ],
    hints: [
      '记录当前位置之前的最小价格。',
      '遍历数组，计算当前价格与最小价格的差值，更新最大利润。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    
};`,
      typescript: `function maxProfit(prices: number[]): number {
    
}`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[2,4,1]', expectedOutput: '2' }
    ]
  },
  {
    id: 13,
    title: '最大子数组和',
    difficulty: 'medium',
    tags: ['数组', '分治', '动态规划'],
    acceptanceRate: 55.1,
    description: `给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: '连续子数组 [4,-1,2,1] 的和最大，为 6 。'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    hints: [
      '使用动态规划，dp[i] 表示以 nums[i] 结尾的最大子数组和。',
      '也可以使用分治法，时间复杂度 O(n log n)。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    
};`,
      typescript: `function maxSubArray(nums: number[]): number {
    
}`,
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
      { input: '[-1]', expectedOutput: '-1' }
    ]
  },
  {
    id: 14,
    title: '跳跃游戏',
    difficulty: 'medium',
    tags: ['贪心', '数组', '动态规划'],
    acceptanceRate: 43.8,
    description: `给你一个非负整数数组 nums ，你最初位于数组的第一个下标 。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标。`,
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        explanation: '可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。'
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
        explanation: '无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。'
      }
    ],
    hints: [
      '使用贪心算法，维护最远可达位置。',
      '遍历数组，如果当前位置可达，更新最远可达位置。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    
};`,
      typescript: `function canJump(nums: number[]): boolean {
    
}`,
      python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        pass`,
      java: `class Solution {
    public boolean canJump(int[] nums) {
        
    }
}`
    },
    testCases: [
      { input: '[2,3,1,1,4]', expectedOutput: 'true' },
      { input: '[3,2,1,0,4]', expectedOutput: 'false' },
      { input: '[0]', expectedOutput: 'true' },
      { input: '[2,0,0]', expectedOutput: 'true' }
    ]
  },
  {
    id: 15,
    title: '合并区间',
    difficulty: 'medium',
    tags: ['数组', '排序'],
    acceptanceRate: 49.6,
    description: `以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。

请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: '区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6]。'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: '区间 [1,4] 和 [4,5] 可被视为重叠区间。'
      }
    ],
    hints: [
      '先按区间的起始位置排序。',
      '遍历区间，如果当前区间与结果中最后一个区间重叠，则合并。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    
};`,
      typescript: `function merge(intervals: number[][]): number[][] {
    
}`,
      python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        pass`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        
    }
}`
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]' }
    ]
  },
  {
    id: 16,
    title: '最小路径和',
    difficulty: 'medium',
    tags: ['数组', '动态规划', '矩阵'],
    acceptanceRate: 69.4,
    description: `给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

说明：每次只能向下或者向右移动一步。`,
    examples: [
      {
        input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]',
        output: '7',
        explanation: '因为路径 1→3→1→1→1 的总和最小。'
      },
      {
        input: 'grid = [[1,2,3],[4,5,6]]',
        output: '12'
      }
    ],
    hints: [
      '使用动态规划，dp[i][j] 表示到达 (i,j) 的最小路径和。',
      '状态转移方程：dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    
};`,
      typescript: `function minPathSum(grid: number[][]): number {
    
}`,
      python: `class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        pass`,
      java: `class Solution {
    public int minPathSum(int[][] grid) {
        
    }
}`
    },
    testCases: [
      { input: '[[1,3,1],[1,5,1],[4,2,1]]', expectedOutput: '7' },
      { input: '[[1,2,3],[4,5,6]]', expectedOutput: '12' },
      { input: '[[1]]', expectedOutput: '1' }
    ]
  },
  {
    id: 17,
    title: '解码方法',
    difficulty: 'medium',
    tags: ['字符串', '动态规划'],
    acceptanceRate: 32.1,
    description: `一条包含字母 A-Z 的消息通过以下映射进行了编码：

'A' -> "1"
'B' -> "2"
...
'Z' -> "26"

要解码已编码的消息，所有数字必须基于上述映射的方法，反向映射回字母（可能有多种方法）。

给你一个只含数字的字符串 s ，请计算并返回解码方法的总数。

题目数据保证答案肯定是一个 32 位的整数。`,
    examples: [
      {
        input: 's = "12"',
        output: '2',
        explanation: '它可以解码为 "AB"（1 2）或者 "L"（12）。'
      },
      {
        input: 's = "226"',
        output: '3',
        explanation: '它可以解码为 "BZ" (2 26), "VF" (22 6), 或者 "BBF" (2 2 6) 。'
      },
      {
        input: 's = "06"',
        output: '0',
        explanation: '"06" 无法映射到 "F" ，因为存在前导零。'
      }
    ],
    hints: [
      '使用动态规划，dp[i] 表示前 i 个字符的解码方法数。',
      '注意处理 "0" 的情况，以及两位数是否在 10-26 之间。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    
};`,
      typescript: `function numDecodings(s: string): number {
    
}`,
      python: `class Solution:
    def numDecodings(self, s: str) -> int:
        pass`,
      java: `class Solution {
    public int numDecodings(String s) {
        
    }
}`
    },
    testCases: [
      { input: '"12"', expectedOutput: '2' },
      { input: '"226"', expectedOutput: '3' },
      { input: '"06"', expectedOutput: '0' },
      { input: '"0"', expectedOutput: '0' }
    ]
  },
  {
    id: 18,
    title: '最长递增子序列',
    difficulty: 'medium',
    tags: ['数组', '二分查找', '动态规划'],
    acceptanceRate: 55.7,
    description: `给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。

例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。`,
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: '最长递增子序列是 [2,3,7,101]，因此长度为 4 。'
      },
      {
        input: 'nums = [0,1,0,3,2,3]',
        output: '4'
      },
      {
        input: 'nums = [7,7,7,7,7,7,7]',
        output: '1'
      }
    ],
    hints: [
      '动态规划解法时间复杂度 O(n^2)。',
      '贪心 + 二分查找可以做到 O(n log n)。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    
};`,
      typescript: `function lengthOfLIS(nums: number[]): number {
    
}`,
      python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        pass`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        
    }
}`
    },
    testCases: [
      { input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4' },
      { input: '[0,1,0,3,2,3]', expectedOutput: '4' },
      { input: '[7,7,7,7,7,7,7]', expectedOutput: '1' }
    ]
  },
  {
    id: 19,
    title: '接雨水',
    difficulty: 'hard',
    tags: ['栈', '数组', '双指针', '动态规划', '单调栈'],
    acceptanceRate: 62.5,
    description: `给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: '上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水。'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    hints: [
      '可以使用双指针法，从两端向中间遍历。',
      '也可以使用动态规划，预先计算每个位置左右的最大高度。'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    
};`,
      typescript: `function trap(height: number[]): number {
    
}`,
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        pass`,
      java: `class Solution {
    public int trap(int[] height) {
        
    }
}`
    },
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' },
      { input: '[1,2,3,4,5]', expectedOutput: '0' }
    ]
  },
  {
    id: 20,
    title: '编辑距离',
    difficulty: 'hard',
    tags: ['字符串', '动态规划'],
    acceptanceRate: 62.8,
    description: `给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数 。

你可以对一个单词进行如下三种操作：
- 插入一个字符
- 删除一个字符
- 替换一个字符`,
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (将 \'h\' 替换为 \'r\') rorse -> rose (删除 \'r\') rose -> ros (删除 \'e\')'
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: '5',
        explanation: 'intention -> inention (删除 \'t\') inention -> enention (将 \'i\' 替换为 \'e\') enention -> exention (将 \'n\' 替换为 \'x\') exention -> exection (将 \'n\' 替换为 \'c\') exection -> execution (插入 \'u\')'
      }
    ],
    hints: [
      '使用动态规划，dp[i][j] 表示 word1 的前 i 个字符转换成 word2 的前 j 个字符的最小操作数。',
      '如果 word1[i-1] == word2[j-1]，则 dp[i][j] = dp[i-1][j-1]。'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    
};`,
      typescript: `function minDistance(word1: string, word2: string): number {
    
}`,
      python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        pass`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        
    }
}`
    },
    testCases: [
      { input: '"horse"\n"ros"', expectedOutput: '3' },
      { input: '"intention"\n"execution"', expectedOutput: '5' },
      { input: '""\n"a"', expectedOutput: '1' }
    ]
  }
];

export function getProblemById(id: number): Problem | undefined {
  return problems.find(p => p.id === id);
}

export function getProblemListItems() {
  return problems.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    tags: p.tags,
    acceptanceRate: p.acceptanceRate
  }));
}
