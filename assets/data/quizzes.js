// 综合题库数据：选择题 / 填空题 / 计算题 / 证明题 / 画图题
// 每种题型覆盖简单(1)/中等(2)/困难(3)三个难度，每道题包含题干、参考答案、评分标准

export const QUESTIONS = [
  // ============================================================
  // 选择题（40 道，由原 quizzes.js 迁移并补充字段）
  // ============================================================
  // 高数二 · 选择题（8 道）
  {
    id: "gaoshu-choice-001", subject: "gaoshu", type: "choice", difficulty: 1,
    title: "定积分的几何意义",
    description: "定积分 $\\int_{-a}^{a} \\sqrt{a^2-x^2}\,dx$ 的值等于（几何意义法）",
    opts: ["$\\pi a^2$", "$\\pi a^2/2$", "$\\pi a^2/4$", "$2\\pi a^2$"],
    answer: "B. $\\pi a^2/2$",
    answerDetail: "该积分表示上半圆 $x^2+y^2=a^2$ ($y\\ge0$) 的面积，即半圆面积。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$\\int_{-a}^{a} \\sqrt{a^2-x^2}\,dx$ 表示上半圆面积 $= \\pi a^2/2$。",
    tags: ["定积分", "几何意义"]
  },
  {
    id: "gaoshu-choice-002", subject: "gaoshu", type: "choice", difficulty: 2,
    title: "华莱士公式",
    description: "华莱士公式 $\\int_0^{\\pi/2} \\sin^4 x\,dx = ?$",
    opts: ["$3\\pi/16$", "$\\pi/4$", "$8/15$", "$2/3$"],
    answer: "A. $3\\pi/16$",
    answerDetail: "n=4 为偶数，套用华莱士公式计算。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "n=4 为偶数：$(n-1)!!/n!! \\times \\pi/2 = 3!!/4!! \\times \\pi/2 = 3\\pi/16$。",
    tags: ["定积分", "华莱士公式"]
  },
  {
    id: "gaoshu-choice-003", subject: "gaoshu", type: "choice", difficulty: 2,
    title: "二阶常系数齐次方程通解",
    description: "二阶常系数齐次方程 $y''-3y'+2y=0$ 的通解是",
    opts: ["$C_1 e^x+C_2 e^{2x}$", "$(C_1+C_2 x)e^x$", "$e^x(C_1\\cos x+C_2\\sin x)$", "$C_1 e^{-x}+C_2 e^{-2x}$"],
    answer: "A. $C_1 e^x+C_2 e^{2x}$",
    answerDetail: "写出特征方程，求根，根据根的情况写通解。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "特征方程 $r^2-3r+2=0$，根 $r_1=1, r_2=2$，通解 $y=C_1 e^x+C_2 e^{2x}$。",
    tags: ["微分方程", "通解"]
  },
  {
    id: "gaoshu-choice-004", subject: "gaoshu", type: "choice", difficulty: 1,
    title: "变上限积分求导",
    description: "变上限积分 $\\frac{d}{dx}\\int_0^x f(t)dt = ?$",
    opts: ["$f(x)$", "$f(t)$", "$f'(x)$", "$x \\cdot f(x)$"],
    answer: "A. $f(x)$",
    answerDetail: "变上限积分求导基本公式。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$\\frac{d}{dx}\\int_0^x f(t)dt = f(x)$。",
    tags: ["定积分", "变上限积分"]
  },
  {
    id: "gaoshu-choice-005", subject: "gaoshu", type: "choice", difficulty: 1,
    title: "极坐标下面积元素",
    description: "极坐标下二重积分 $dxdy = ?$",
    opts: ["$dr\, d\\theta$", "$r\, dr\, d\\theta$", "$r^2\, dr\, d\\theta$", "$d\\theta\, dr$"],
    answer: "B. $r\, dr\, d\\theta$",
    answerDetail: "极坐标变换的雅可比行列式为 $r$。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$x=r\\cos\\theta, y=r\\sin\\theta$，雅可比行列式 $J=r$，故 $dxdy=r\,dr\,d\\theta$。",
    tags: ["二重积分", "极坐标"]
  },
  {
    id: "gaoshu-choice-006", subject: "gaoshu", type: "choice", difficulty: 2,
    title: "幂级数收敛域",
    description: "幂级数 $\\sum \\frac{x^n}{n!}$ 的收敛域是",
    opts: ["$(-1,1)$", "$[-1,1)$", "$(-\\infty,+\\infty)$", "$[-1,1]$"],
    answer: "C. $(-\\infty,+\\infty)$",
    answerDetail: "用比值法求收敛半径。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$R=\\lim|a_n/a_{n+1}|=\\lim(n+1)/1=\\infty$，收敛域为 $(-\\infty,+\\infty)$。",
    tags: ["级数", "收敛域"]
  },
  {
    id: "gaoshu-choice-007", subject: "gaoshu", type: "choice", difficulty: 3,
    title: "拉格朗日乘数法",
    description: "拉格朗日乘数法求 $f(x,y)$ 在 $g(x,y)=0$ 下的极值，构造的函数是",
    opts: ["$L=f-\\lambda g$", "$L=f+\\lambda g$", "$L=f\\cdot g$", "$L=f/g$"],
    answer: "B. $L=f+\\lambda g$",
    answerDetail: "拉格朗日函数标准形式。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$L=f(x,y)+\\lambda g(x,y)$，对 $x,y,\\lambda$ 分别求偏导令为 0。",
    tags: ["多元微积分", "条件极值"]
  },
  {
    id: "gaoshu-choice-008", subject: "gaoshu", type: "choice", difficulty: 3,
    title: "一阶线性方程积分因子",
    description: "一阶线性非齐次方程 $\\frac{dy}{dx}+P(x)y=Q(x)$ 的积分因子是",
    opts: ["$e^{\\int P dx}$", "$e^{-\\int P dx}$", "$e^{\\int Q dx}$", "$e^{-\\int Q dx}$"],
    answer: "A. $e^{\\int P dx}$",
    answerDetail: "积分因子使方程左边成为全导数。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$\\mu=e^{\\int P dx}$，乘以方程两边后左边变成全导数。",
    tags: ["微分方程", "积分因子"]
  },

  // 线性代数 · 选择题（8 道）
  {
    id: "xiandai-choice-001", subject: "xiandai", type: "choice", difficulty: 1,
    title: "行列式非零的充要条件",
    description: "$n$ 阶行列式 $|A|\\ne 0$ 的充要条件是",
    opts: ["A 的秩 $<n$", "A 的秩 $=n$", "A 有零行", "A 是对称矩阵"],
    answer: "B. A 的秩 $=n$",
    answerDetail: "行列式非零等价于矩阵满秩。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$|A|\\ne 0 \\iff A$ 满秩 $\\iff A$ 可逆 $\\iff Ax=0$ 只有零解。",
    tags: ["行列式", "矩阵的秩"]
  },
  {
    id: "xiandai-choice-002", subject: "xiandai", type: "choice", difficulty: 1,
    title: "矩阵可逆条件",
    description: "矩阵 $A$ 可逆的充要条件是",
    opts: ["$|A|=0$", "$|A|\\ne 0$", "A 是对称矩阵", "A 是三角矩阵"],
    answer: "B. $|A|\\ne 0$",
    answerDetail: "可逆等价于行列式非零。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$A$ 可逆 $\\iff |A|\\ne 0 \\iff A$ 满秩。",
    tags: ["矩阵", "可逆"]
  },
  {
    id: "xiandai-choice-003", subject: "xiandai", type: "choice", difficulty: 2,
    title: "齐次方程组有非零解",
    description: "齐次方程组 $Ax=0$ 有非零解的条件是",
    opts: ["$r(A)=n$", "$r(A)<n$", "$|A|\\ne 0$", "A 是方阵"],
    answer: "B. $r(A)<n$",
    answerDetail: "秩小于未知量个数时存在非零解。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$Ax=0$ 有非零解 $\\iff r(A)<n$。基础解系含 $n-r(A)$ 个线性无关解向量。",
    tags: ["线性方程组", "基础解系"]
  },
  {
    id: "xiandai-choice-004", subject: "xiandai", type: "choice", difficulty: 2,
    title: "实对称矩阵特征值",
    description: "实对称矩阵的特征值性质是",
    opts: ["全为实数", "全为复数", "可能为复数", "全为正数"],
    answer: "A. 全为实数",
    answerDetail: "实对称矩阵特征值必为实数。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "实对称矩阵的特征值全为实数，且不同特征值对应的特征向量正交。",
    tags: ["特征值", "实对称矩阵"]
  },
  {
    id: "xiandai-choice-005", subject: "xiandai", type: "choice", difficulty: 2,
    title: "特征值与行列式迹",
    description: "若 3 阶矩阵 $A$ 的特征值为 $1,2,3$，则 $|A|$ 和 $\\mathrm{tr}(A)$ 分别为",
    opts: ["6, 6", "6, 1", "1, 6", "3, 6"],
    answer: "A. 6, 6",
    answerDetail: "特征值之积等于行列式，之和等于迹。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$|A|=1\\times2\\times3=6$，$\\mathrm{tr}(A)=1+2+3=6$。",
    tags: ["特征值", "行列式", "迹"]
  },
  {
    id: "xiandai-choice-006", subject: "xiandai", type: "choice", difficulty: 3,
    title: "二次型正定条件",
    description: "二次型正定的充要条件是",
    opts: ["所有顺序主子式 $>0$", "$|A|>0$", "特征值不全为负", "正惯性指数 $\\ge 0$"],
    answer: "A. 所有顺序主子式 $>0$",
    answerDetail: "正定判定的顺序主子式法则。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "正定 $\\iff$ 所有顺序主子式全 $>0 \\iff$ 所有特征值 $>0$。",
    tags: ["二次型", "正定"]
  },
  {
    id: "xiandai-choice-007", subject: "xiandai", type: "choice", difficulty: 1,
    title: "伴随矩阵性质",
    description: "伴随矩阵 $A^*$ 与 $A$ 的关系是",
    opts: ["$A^*=A^T$", "$AA^*=|A|E$", "$A^*=A^{-1}$", "$AA^*=E$"],
    answer: "B. $AA^*=|A|E$",
    answerDetail: "伴随矩阵基本恒等式。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$AA^*=A^*A=|A|E$，由此 $A^{-1}=A^*/|A|$（$|A|\\ne0$）。",
    tags: ["伴随矩阵", "逆矩阵"]
  },
  {
    id: "xiandai-choice-008", subject: "xiandai", type: "choice", difficulty: 3,
    title: "矩阵秩的乘法性质",
    description: "矩阵的秩 $r(AB)$ 与 $r(A), r(B)$ 的关系是",
    opts: ["$r(AB)=r(A)\\cdot r(B)$", "$r(AB)\\le \\min(r(A),r(B))$", "$r(AB)\\ge \\max(r(A),r(B))$", "$r(AB)=r(A)+r(B)$"],
    answer: "B. $r(AB)\\le \\min(r(A),r(B))$",
    answerDetail: "矩阵乘法不会增加秩。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$r(AB)\\le \\min(r(A),r(B))$。",
    tags: ["矩阵", "秩"]
  },

  // 微观经济学 · 选择题（10 道）
  {
    id: "weijing-choice-001", subject: "weijing", type: "choice", difficulty: 1,
    title: "消费者均衡条件",
    description: "消费者均衡条件 $MU_x/P_x = MU_y/P_y$ 的经济学含义是",
    opts: ["边际效用相等", "每元边际效用相等", "总效用相等", "价格相等"],
    answer: "B. 每元边际效用相等",
    answerDetail: "消费者均衡要求最后一元购买各商品的边际效用相等。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "消费者均衡要求最后一元购买各商品的边际效用相等。",
    tags: ["消费者理论", "边际效用"]
  },
  {
    id: "weijing-choice-002", subject: "weijing", type: "choice", difficulty: 2,
    title: "Cobb-Douglas 需求函数",
    description: "Cobb-Douglas 效用函数 $U=X^\\alpha Y^\\beta$，消费者对 X 的需求量 $X^* =$",
    opts: ["$\\alpha I/P_x$", "$\\beta I/P_x$", "$\\alpha I/((\\alpha+\\beta)P_x)$", "$\\beta I/((\\alpha+\\beta)P_x)$"],
    answer: "C. $\\alpha I/((\\alpha+\\beta)P_x)$",
    answerDetail: "Cobb-Douglas 需求函数快速公式。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$X^*=\\alpha I/((\\alpha+\\beta)P_x)$，$Y^*=\\beta I/((\\alpha+\\beta)P_y)$。",
    tags: ["消费者理论", "Cobb-Douglas"]
  },
  {
    id: "weijing-choice-003", subject: "weijing", type: "choice", difficulty: 1,
    title: "完全竞争短期均衡",
    description: "完全竞争厂商短期均衡条件是",
    opts: ["$P=MC$", "$P=AC$", "$MR=AC$", "$P=AR$"],
    answer: "A. $P=MC$",
    answerDetail: "完全竞争厂商 $P=MR$，均衡条件为 $P=MC$。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "完全竞争厂商 $P=MR$，短期均衡 $P=MC$（取 MC 上升段且 $P\\ge AVC$）。",
    tags: ["完全竞争", "短期均衡"]
  },
  {
    id: "weijing-choice-004", subject: "weijing", type: "choice", difficulty: 2,
    title: "停止营业点",
    description: "完全竞争厂商的停止营业点是",
    opts: ["$P=AC$ 最低点", "$P=AVC$ 最低点", "$P=MC$ 最低点", "$P=AFC$ 最低点"],
    answer: "B. $P=AVC$ 最低点",
    answerDetail: "价格低于平均可变成本时应停止营业。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "停止营业点 $P=AVC$ 最低点。当 $P<AVC$ 时厂商应停止营业。",
    tags: ["完全竞争", "停止营业点"]
  },
  {
    id: "weijing-choice-005", subject: "weijing", type: "choice", difficulty: 2,
    title: "垄断厂商边际收益",
    description: "垄断厂商的需求曲线 $P=a-bQ$，则 $MR =$",
    opts: ["$a-bQ$", "$a-2bQ$", "$a-bQ/2$", "$2a-bQ$"],
    answer: "B. $a-2bQ$",
    answerDetail: "$MR$ 的斜率是需求曲线斜率的 2 倍。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$TR=aQ-bQ^2 \\Rightarrow MR=a-2bQ$。",
    tags: ["垄断", "边际收益"]
  },
  {
    id: "weijing-choice-006", subject: "weijing", type: "choice", difficulty: 3,
    title: "勒纳指数与弹性",
    description: "勒纳指数 $(P-MC)/P = 1/|E_d|$，当 $|E_d|\\to\\infty$ 时",
    opts: ["垄断力最大", "垄断力为 0（完全竞争）", "利润最大", "亏损"],
    answer: "B. 垄断力为 0（完全竞争）",
    answerDetail: "弹性无穷大时勒纳指数趋于 0。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$|E_d|\\to\\infty$ 时勒纳指数 $\\to 0$，即 $P=MC$，对应完全竞争。",
    tags: ["勒纳指数", "市场结构"]
  },
  {
    id: "weijing-choice-007", subject: "weijing", type: "choice", difficulty: 3,
    title: "三级价格歧视均衡",
    description: "三级价格歧视的均衡条件是",
    opts: ["$P_1=P_2$", "$MR_1=MR_2=MC$", "$MC_1=MC_2$", "$Q_1=Q_2$"],
    answer: "B. $MR_1=MR_2=MC$",
    answerDetail: "各市场边际收益相等且等于边际成本。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "三级价格歧视要求各市场边际收益相等且等于边际成本：$MR_1=MR_2=MC$。",
    tags: ["价格歧视", "垄断"]
  },
  {
    id: "weijing-choice-008", subject: "weijing", type: "choice", difficulty: 2,
    title: "古诺双寡头均衡产量",
    description: "古诺双寡头模型中，对称厂商的均衡产量是（市场容量 $a-c$）",
    opts: ["$(a-c)/2$", "$(a-c)/3$", "$(a-c)/4$", "$2(a-c)/3$"],
    answer: "B. $(a-c)/3$",
    answerDetail: "对称古诺均衡每个厂商产量为市场容量的 1/3。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "$Q_1=Q_2=(a-c)/3b$，总产量 $=2(a-c)/3b$。",
    tags: ["寡头", "古诺模型"]
  },
  {
    id: "weijing-choice-009", subject: "weijing", type: "choice", difficulty: 1,
    title: "税收归宿规律",
    description: "税收归宿的一般规律是",
    opts: ["消费者承担全部", "生产者承担全部", "弹性小的一方承担更多", "平均分担"],
    answer: "C. 弹性小的一方承担更多",
    answerDetail: "税收归宿取决于供需弹性。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "税收归宿取决于供需弹性：弹性小的一方承担更多税负。",
    tags: ["税收", "弹性"]
  },
  {
    id: "weijing-choice-010", subject: "weijing", type: "choice", difficulty: 3,
    title: "吉芬品需求曲线",
    description: "吉芬品的需求曲线是",
    opts: ["向右下方倾斜", "向右上方倾斜", "水平", "垂直"],
    answer: "B. 向右上方倾斜",
    answerDetail: "吉芬品收入效应大于替代效应。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "吉芬品收入效应大于替代效应，价格上升需求反而增加。",
    tags: ["吉芬品", "需求曲线"]
  },

  // 数据结构 · 选择题（14 道）
  {
    id: "datastruct-choice-001", subject: "datastruct", type: "choice", difficulty: 1,
    title: "顺序表插入平均移动次数",
    description: "在长度为 $n$ 的顺序表中插入一个元素，平均需要移动的元素个数是",
    opts: ["$n/2$", "$(n-1)/2$", "$(n+1)/2$", "$n$"],
    answer: "A. $n/2$",
    answerDetail: "插入第 $i$ 个位置需移动 $n-i+1$ 个元素，取平均。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "插入第 $i$ 个位置需移动 $n-i+1$ 个元素，平均移动 $n/2$ 次，时间复杂度 $O(n)$。",
    tags: ["线性表", "顺序表"]
  },
  {
    id: "datastruct-choice-002", subject: "datastruct", type: "choice", difficulty: 1,
    title: "头插法建表结果",
    description: "单链表头插法建表的结果是",
    opts: ["正序", "逆序", "随机", "有序"],
    answer: "B. 逆序",
    answerDetail: "新节点插在表头，后插入的节点在前面。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "头插法：新节点插在表头，后插入的节点在前面，所以结果逆序。",
    tags: ["链表", "建表"]
  },
  {
    id: "datastruct-choice-003", subject: "datastruct", type: "choice", difficulty: 2,
    title: "循环队列判满条件",
    description: "循环队列的判满条件是（牺牲一个单元）",
    opts: ["front==rear", "$(rear+1)\\%MaxSize==front$", "$rear==front+1$", "$rear+1==front$"],
    answer: "B. $(rear+1)\\%MaxSize==front$",
    answerDetail: "牺牲一个单元区分空满。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "循环队列判满：$(rear+1)\\%MaxSize==front$；判空：$front==rear$。",
    tags: ["队列", "循环队列"]
  },
  {
    id: "datastruct-choice-004", subject: "datastruct", type: "choice", difficulty: 2,
    title: "遍历序列唯一确定二叉树",
    description: "已知二叉树的遍历序列，能唯一确定二叉树的是",
    opts: ["前序+后序", "前序+中序", "前序+层序", "后序+层序"],
    answer: "B. 前序+中序",
    answerDetail: "中序与其他序列配合可唯一确定二叉树。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "前序+中序 或 后序+中序 可唯一确定二叉树。",
    tags: ["二叉树", "遍历"]
  },
  {
    id: "datastruct-choice-005", subject: "datastruct", type: "choice", difficulty: 1,
    title: "BST 中序遍历结果",
    description: "二叉排序树（BST）的中序遍历结果是",
    opts: ["递增序列", "递减序列", "随机", "先增后减"],
    answer: "A. 递增序列",
    answerDetail: "BST 满足左<根<右。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "BST 性质：左<根<右。中序遍历得到递增有序序列。",
    tags: ["二叉排序树", "中序遍历"]
  },
  {
    id: "datastruct-choice-006", subject: "datastruct", type: "choice", difficulty: 2,
    title: "AVL 树 LL 型失衡旋转",
    description: "AVL 树中，插入节点导致 LL 型失衡，应进行",
    opts: ["左旋", "右旋", "先左旋后右旋", "先右旋后左旋"],
    answer: "B. 右旋",
    answerDetail: "LL 型对应右旋。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "LL 型：右旋。RR 型：左旋。LR 型：先左旋后右旋。RL 型：先右旋后左旋。",
    tags: ["AVL", "平衡二叉树"]
  },
  {
    id: "datastruct-choice-007", subject: "datastruct", type: "choice", difficulty: 2,
    title: "哈夫曼树节点总数",
    description: "哈夫曼树有 $n$ 个叶子节点，则总节点数为",
    opts: ["$2n$", "$2n-1$", "$2n+1$", "$n-1$"],
    answer: "B. $2n-1$",
    answerDetail: "$n$ 个叶子合并 $n-1$ 次产生新节点。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "哈夫曼树每次合并两个节点产生一个新节点，$n$ 个叶子合并 $n-1$ 次，共 $2n-1$ 个节点。",
    tags: ["哈夫曼树", "二叉树"]
  },
  {
    id: "datastruct-choice-008", subject: "datastruct", type: "choice", difficulty: 1,
    title: "BFS 使用的数据结构",
    description: "图的广度优先搜索（BFS）使用的数据结构是",
    opts: ["栈", "队列", "堆", "散列表"],
    answer: "B. 队列",
    answerDetail: "BFS 用队列 FIFO 逐层访问。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "BFS 用队列（FIFO）逐层访问；DFS 用栈（LIFO）。",
    tags: ["图", "BFS"]
  },
  {
    id: "datastruct-choice-009", subject: "datastruct", type: "choice", difficulty: 2,
    title: "Prim 算法适用图类型",
    description: "Prim 算法求最小生成树适合于",
    opts: ["稀疏图", "稠密图", "有向图", "带负权图"],
    answer: "B. 稠密图",
    answerDetail: "Prim 时间复杂度 $O(n^2)$，适合稠密图。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "Prim 从点扩展，$O(n^2)$，适合稠密图。Kruskal 按边排序，适合稀疏图。",
    tags: ["最小生成树", "Prim"]
  },
  {
    id: "datastruct-choice-010", subject: "datastruct", type: "choice", difficulty: 3,
    title: "Dijkstra 不能处理的图",
    description: "Dijkstra 算法不能处理的图是",
    opts: ["无向图", "有向图", "含负权边的图", "稀疏图"],
    answer: "C. 含负权边的图",
    answerDetail: "Dijkstra 基于贪心，不能处理负权边。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "Dijkstra 基于贪心，不能处理负权边。含负权用 Bellman-Ford 或 Floyd。",
    tags: ["最短路径", "Dijkstra"]
  },
  {
    id: "datastruct-choice-011", subject: "datastruct", type: "choice", difficulty: 1,
    title: "快速排序平均复杂度",
    description: "快速排序的平均时间复杂度是",
    opts: ["$O(n)$", "$O(n\\log n)$", "$O(n^2)$", "$O(\\log n)$"],
    answer: "B. $O(n\\log n)$",
    answerDetail: "快排平均 $O(n\\log n)$。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "快排平均 $O(n\\log n)$，最坏 $O(n^2)$。不稳定排序。",
    tags: ["排序", "快速排序"]
  },
  {
    id: "datastruct-choice-012", subject: "datastruct", type: "choice", difficulty: 2,
    title: "不稳定排序",
    description: "下列排序算法中，不稳定的是",
    opts: ["冒泡排序", "归并排序", "快速排序", "插入排序"],
    answer: "C. 快速排序",
    answerDetail: "快速排序不稳定。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "不稳定排序：快速排序、选择排序、希尔排序、堆排序。稳定排序：冒泡、插入、归并、基数。",
    tags: ["排序", "稳定性"]
  },
  {
    id: "datastruct-choice-013", subject: "datastruct", type: "choice", difficulty: 2,
    title: "二分查找复杂度",
    description: "二分查找的时间复杂度是",
    opts: ["$O(n)$", "$O(\\log n)$", "$O(n\\log n)$", "$O(1)$"],
    answer: "B. $O(\\log n)$",
    answerDetail: "二分查找每次缩小一半范围。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "二分查找每次缩小一半范围，$O(\\log n)$，需有序。",
    tags: ["查找", "二分查找"]
  },
  {
    id: "datastruct-choice-014", subject: "datastruct", type: "choice", difficulty: 3,
    title: "散列表不产生聚集的冲突处理",
    description: "散列表处理冲突的方法中，不会产生聚集的是",
    opts: ["线性探测法", "二次探测法", "链地址法", "开放定址法"],
    answer: "C. 链地址法",
    answerDetail: "链地址法把同义词放在链表中。",
    rubric: [{ item: "选择正确答案", score: 10 }],
    explain: "链地址法把同义词放在链表中，不会产生聚集。",
    tags: ["散列表", "冲突处理"]
  },

  // ============================================================
  // 填空题（12 道：4 学科 × 3 难度）
  // ============================================================
  {
    id: "gaoshu-fill-001", subject: "gaoshu", type: "fill", difficulty: 1,
    title: "变上限积分求导",
    description: "$\\frac{d}{dx}\\int_0^{x^2} \\sin t\,dt = $ __________。",
    answer: "$2x\\sin(x^2)$",
    answerDetail: "使用变上限积分求导公式与链式法则：$\\frac{d}{dx}\\int_0^{u(x)}f(t)dt = f(u(x))u'(x)$。",
    rubric: [
      { item: "正确应用变上限积分求导", score: 5 },
      { item: "链式法则求出 $2x$", score: 3 },
      { item: "结果 $2x\\sin(x^2)$ 正确", score: 2 }
    ],
    acceptedAnswers: ["2x sin(x^2)", "2x\\sin(x^2)", "2x*sin(x^2)", "$2x\\sin(x^2)$"],
    explain: "$\\frac{d}{dx}\\int_0^{x^2}\\sin t\,dt = \\sin(x^2)\\cdot 2x = 2x\\sin(x^2)$。",
    tags: ["定积分", "变上限积分"]
  },
  {
    id: "gaoshu-fill-002", subject: "gaoshu", type: "fill", difficulty: 2,
    title: "二阶混合偏导数",
    description: "设 $z = x^3y^2$，则 $\\frac{\\partial^2 z}{\\partial x\\partial y} = $ __________。",
    answer: "$6x^2 y$",
    answerDetail: "先对 $x$ 求偏导，再对 $y$ 求偏导。",
    rubric: [
      { item: "求出 $\\frac{\\partial z}{\\partial x}=3x^2y^2$", score: 5 },
      { item: "再对 $y$ 求导", score: 3 },
      { item: "结果 $6x^2y$ 正确", score: 2 }
    ],
    acceptedAnswers: ["6x^2y", "6x^2 y", "6 x^2 y"],
    explain: "$\\frac{\\partial z}{\\partial x}=3x^2y^2$，$\\frac{\\partial^2 z}{\\partial x\\partial y}=6x^2y$。",
    tags: ["多元微积分", "偏导数"]
  },
  {
    id: "gaoshu-fill-003", subject: "gaoshu", type: "fill", difficulty: 3,
    title: "幂级数收敛半径",
    description: "幂级数 $\\sum_{n=0}^{\\infty} \\frac{x^n}{n+1}$ 的收敛半径 $R = $ __________。",
    answer: "1",
    answerDetail: "用比值法或根值法求收敛半径。",
    rubric: [
      { item: "写出系数 $a_n=\\frac{1}{n+1}$", score: 4 },
      { item: "计算 $\\lim|a_n/a_{n+1}|$", score: 4 },
      { item: "结果 $R=1$", score: 2 }
    ],
    acceptedAnswers: ["1", "R=1", "$R=1$"],
    explain: "$R=\\lim_{n\\to\\infty}|a_n/a_{n+1}|=\\lim_{n\\to\\infty}\\frac{n+2}{n+1}=1$。",
    tags: ["级数", "收敛半径"]
  },
  {
    id: "xiandai-fill-001", subject: "xiandai", type: "fill", difficulty: 1,
    title: "2 阶行列式",
    description: "$\\begin{vmatrix} 1 & 2 \\ 3 & 4 \\ \\end{vmatrix} = $ __________。",
    answer: "-2",
    answerDetail: "二阶行列式 $ad-bc$。",
    rubric: [
      { item: "正确应用公式 $ad-bc$", score: 5 },
      { item: "代入 $1\\times4-2\\times3$", score: 3 },
      { item: "结果 $-2$", score: 2 }
    ],
    acceptedAnswers: ["-2", "−2"],
    explain: "$1\\times4 - 2\\times3 = 4 - 6 = -2$。",
    tags: ["行列式", "二阶行列式"]
  },
  {
    id: "xiandai-fill-002", subject: "xiandai", type: "fill", difficulty: 2,
    title: "矩阵的逆",
    description: "若 $A = \\begin{pmatrix} 2 & 0 \\ 0 & 3 \\ \\end{pmatrix}$，则 $A^{-1} = $ __________。",
    answer: "$\\begin{pmatrix} 1/2 & 0 \\ 0 & 1/3 \\ \\end{pmatrix}$",
    answerDetail: "对角矩阵的逆为对角元素取倒数。",
    rubric: [
      { item: "知道对角矩阵逆的求法", score: 5 },
      { item: "$2^{-1}=1/2, 3^{-1}=1/3$", score: 3 },
      { item: "写出矩阵形式", score: 2 }
    ],
    acceptedAnswers: ["diag(1/2,1/3)", "[[1/2,0],[0,1/3]]"],
    explain: "对角矩阵的逆为 $\\mathrm{diag}(1/2,1/3)$。",
    tags: ["矩阵", "逆矩阵"]
  },
  {
    id: "xiandai-fill-003", subject: "xiandai", type: "fill", difficulty: 3,
    title: "特征值之和",
    description: "若 $A$ 为 3 阶方阵，且特征值为 $\\lambda_1=1, \\lambda_2=-1, \\lambda_3=2$，则 $\\mathrm{tr}(A) = $ __________。",
    answer: "2",
    answerDetail: "特征值之和等于矩阵的迹。",
    rubric: [
      { item: "知道 $\\mathrm{tr}(A)=\\sum\\lambda_i$", score: 6 },
      { item: "计算 $1+(-1)+2=2$", score: 4 }
    ],
    acceptedAnswers: ["2", "tr(A)=2"],
    explain: "$\\mathrm{tr}(A)=1+(-1)+2=2$。",
    tags: ["特征值", "迹"]
  },
  {
    id: "weijing-fill-001", subject: "weijing", type: "fill", difficulty: 1,
    title: "消费者均衡",
    description: "消费者均衡时，$\\frac{MU_x}{P_x}$ 与 $\\frac{MU_y}{P_y}$ 的关系是 __________。",
    answer: "相等",
    answerDetail: "消费者均衡条件为每元边际效用相等。",
    rubric: [
      { item: "写出相等关系", score: 10 }
    ],
    acceptedAnswers: ["相等", "=", "相等（每元边际效用相等）"],
    explain: "消费者均衡要求 $\\frac{MU_x}{P_x}=\\frac{MU_y}{P_y}$。",
    tags: ["消费者理论", "均衡"]
  },
  {
    id: "weijing-fill-002", subject: "weijing", type: "fill", difficulty: 2,
    title: "完全竞争长期均衡",
    description: "完全竞争厂商长期均衡时，价格 $P$ 等于长期平均成本 $LAC$ 的 __________。",
    answer: "最低点",
    answerDetail: "长期均衡 $P=LMC=LAC_{\\min}$。",
    rubric: [
      { item: "写出长期均衡条件", score: 5 },
      { item: "指出最低点", score: 5 }
    ],
    acceptedAnswers: ["最低点", "min", "最小值"],
    explain: "$P=LMC=LAC_{\\min}$，即长期平均成本的最低点。",
    tags: ["完全竞争", "长期均衡"]
  },
  {
    id: "weijing-fill-003", subject: "weijing", type: "fill", difficulty: 3,
    title: "垄断定价",
    description: "垄断厂商利润最大化条件为 $MR = $ __________。",
    answer: "MC",
    answerDetail: "垄断均衡 $MR=MC$。",
    rubric: [
      { item: "写出 $MR=MC$", score: 10 }
    ],
    acceptedAnswers: ["MC", "mc", "边际成本"],
    explain: "垄断厂商利润最大化条件为 $MR=MC$。",
    tags: ["垄断", "均衡"]
  },
  {
    id: "datastruct-fill-001", subject: "datastruct", type: "fill", difficulty: 1,
    title: "顺序表删除元素",
    description: "在长度为 $n$ 的顺序表中删除一个元素，平均需要移动的元素个数是 __________。",
    answer: "$(n-1)/2$",
    answerDetail: "删除第 $i$ 个位置需移动 $n-i$ 个元素，取平均。",
    rubric: [
      { item: "写出平均移动次数公式", score: 10 }
    ],
    acceptedAnswers: ["(n-1)/2", "(n-1)/2 次", "(n−1)/2"],
    explain: "删除第 $i$ 个位置需移动 $n-i$ 个元素，平均 $\\frac{1}{n}\\sum_{i=1}^{n}(n-i)=\\frac{n-1}{2}$。",
    tags: ["线性表", "顺序表"]
  },
  {
    id: "datastruct-fill-002", subject: "datastruct", type: "fill", difficulty: 2,
    title: "完全二叉树深度",
    description: "具有 $n$ 个节点的完全二叉树的深度为 __________。",
    answer: "$\\lfloor\\log_2 n\\rfloor+1$",
    answerDetail: "完全二叉树深度公式。",
    rubric: [
      { item: "写出深度公式", score: 10 }
    ],
    acceptedAnswers: ["floor(log2 n)+1", "⌊log₂n⌋+1", "[log2 n]+1"],
    explain: "完全二叉树深度为 $\\lfloor\\log_2 n\\rfloor+1$。",
    tags: ["二叉树", "完全二叉树"]
  },
  {
    id: "datastruct-fill-003", subject: "datastruct", type: "fill", difficulty: 3,
    title: "拓扑排序适用对象",
    description: "拓扑排序只适用于 __________ 图。",
    answer: "有向无环图（DAG）",
    answerDetail: "拓扑排序要求图中无环。",
    rubric: [
      { item: "写出有向无环图", score: 10 }
    ],
    acceptedAnswers: ["有向无环图", "DAG", "有向无环"],
    explain: "拓扑排序只适用于 DAG（有向无环图）。",
    tags: ["图", "拓扑排序"]
  },

  // ============================================================
  // 计算题（12 道：4 学科 × 3 难度）
  // ============================================================
  {
    id: "gaoshu-calc-001", subject: "gaoshu", type: "calculation", difficulty: 1,
    title: "定积分计算",
    description: "计算定积分 $I = \\int_0^1 (x^2 + 2x)\,dx$。",
    answer: "$\\frac{4}{3}$",
    answerDetail: "$I = \\int_0^1 x^2 dx + 2\\int_0^1 x dx = \\frac{1}{3} + 1 = \\frac{4}{3}$。",
    rubric: [
      { item: "正确拆分积分", score: 3 },
      { item: "求出 $\\int_0^1 x^2 dx = \\frac{1}{3}$", score: 3 },
      { item: "求出 $2\\int_0^1 x dx = 1$", score: 2 },
      { item: "最终结果 $\\frac{4}{3}$", score: 2 }
    ],
    explain: "$\\int_0^1(x^2+2x)dx = \\left[\\frac{x^3}{3}+x^2\\right]_0^1 = \\frac{1}{3}+1=\\frac{4}{3}$。",
    tags: ["定积分", "基本计算"]
  },
  {
    id: "gaoshu-calc-002", subject: "gaoshu", type: "calculation", difficulty: 2,
    title: "二重积分",
    description: "计算 $I = \\iint_D (x+y)\,dxdy$，其中 $D$ 为由 $x=0, y=0, x+y=1$ 围成的三角形区域。",
    answer: "$\\frac{1}{3}$",
    answerDetail: "$I=\\int_0^1\\int_0^{1-x}(x+y)dydx = \\frac{1}{3}$。",
    rubric: [
      { item: "正确确定积分区域与上下限", score: 3 },
      { item: "内层积分计算正确", score: 3 },
      { item: "外层积分计算正确", score: 2 },
      { item: "最终结果", score: 2 }
    ],
    explain: "$\\int_0^1\\int_0^{1-x}(x+y)dydx = \\int_0^1\\left[x(1-x)+\\frac{(1-x)^2}{2}\\right]dx = \\frac{1}{3}$。",
    tags: ["二重积分", "累次积分"]
  },
  {
    id: "gaoshu-calc-003", subject: "gaoshu", type: "calculation", difficulty: 3,
    title: "条件极值",
    description: "求函数 $f(x,y)=x^2+y^2$ 在约束 $x+y=1$ 下的最小值。",
    answer: "$\\frac{1}{2}$",
    answerDetail: "代入 $y=1-x$，得 $f=x^2+(1-x)^2=2x^2-2x+1$，求导得 $x=\\frac{1}{2}$，最小值 $\\frac{1}{2}$。",
    rubric: [
      { item: "构造拉格朗日函数或代入消元", score: 3 },
      { item: "求偏导或一元导数并找临界点", score: 4 },
      { item: "验证为最小值", score: 1 },
      { item: "结果 $\\frac{1}{2}$", score: 2 }
    ],
    explain: "$L=x^2+y^2+\\lambda(1-x-y)$，$L_x=2x-\\lambda=0, L_y=2y-\\lambda=0$，得 $x=y=\\frac{1}{2}$，最小值 $\\frac{1}{2}$。",
    tags: ["多元微积分", "条件极值"]
  },
  {
    id: "xiandai-calc-001", subject: "xiandai", type: "calculation", difficulty: 1,
    title: "3 阶行列式计算",
    description: "计算行列式 $D = \\begin{vmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & 0 & 2 \\ \\end{vmatrix}$。",
    answer: "2",
    answerDetail: "上三角行列式等于主对角线元素乘积 $1\\times1\\times2=2$。",
    rubric: [
      { item: "识别上三角结构", score: 4 },
      { item: "主对角线相乘", score: 4 },
      { item: "结果 2", score: 2 }
    ],
    explain: "上三角行列式 $D=1\\times1\\times2=2$。",
    tags: ["行列式", "三角行列式"]
  },
  {
    id: "xiandai-calc-002", subject: "xiandai", type: "calculation", difficulty: 2,
    title: "矩阵乘法",
    description: "设 $A = \\begin{pmatrix} 1 & 2 \\ 3 & 4 \\ \\end{pmatrix}$，$B = \\begin{pmatrix} 0 & 1 \\ 1 & 0 \\ \\end{pmatrix}$，求 $AB$。",
    answer: "$\\begin{pmatrix} 2 & 1 \\ 4 & 3 \\ \\end{pmatrix}$",
    answerDetail: "按矩阵乘法规则计算。",
    rubric: [
      { item: "正确应用矩阵乘法规则", score: 5 },
      { item: "每个元素计算正确", score: 5 }
    ],
    explain: "$AB=\\begin{pmatrix}1\\times0+2\\times1 & 1\\times1+2\\times0 \\\\ 3\\times0+4\\times1 & 3\\times1+4\\times0\\end{pmatrix}=\\begin{pmatrix}2&1\\\\4&3\\end{pmatrix}$。",
    tags: ["矩阵", "矩阵乘法"]
  },
  {
    id: "xiandai-calc-003", subject: "xiandai", type: "calculation", difficulty: 3,
    title: "求矩阵特征值",
    description: "求矩阵 $A = \\begin{pmatrix} 4 & 2 \\ 1 & 3 \\ \\end{pmatrix}$ 的特征值。",
    answer: "$\\lambda_1=5, \\lambda_2=2$",
    answerDetail: "特征方程 $|\\lambda E-A|=(\\lambda-4)(\\lambda-3)-2=(\\lambda-5)(\\lambda-2)=0$。",
    rubric: [
      { item: "写出特征方程", score: 4 },
      { item: "展开并化简", score: 3 },
      { item: "解出两个特征值", score: 3 }
    ],
    explain: "$|\\lambda E-A|=(\\lambda-4)(\\lambda-3)-2=\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2)=0$。",
    tags: ["特征值", "特征方程"]
  },
  {
    id: "weijing-calc-001", subject: "weijing", type: "calculation", difficulty: 1,
    title: "消费者最优选择",
    description: "某消费者效用函数 $U=XY$，收入 $I=100$，价格 $P_X=P_Y=1$。求最优消费组合。",
    answer: "$X^*=50, Y^*=50$",
    answerDetail: "Cobb-Douglas 效用函数，$X^*=\\alpha I/[(\\alpha+\\beta)P_X]=100/2=50$。",
    rubric: [
      { item: "写出预算约束", score: 3 },
      { item: "写出均衡条件 $MU_X/P_X=MU_Y/P_Y$", score: 4 },
      { item: "结果 $X=Y=50$", score: 3 }
    ],
    explain: "$MU_X=Y, MU_Y=X$，均衡 $Y/1=X/1$ 且 $X+Y=100$，得 $X=Y=50$。",
    tags: ["消费者理论", "Cobb-Douglas"]
  },
  {
    id: "weijing-calc-002", subject: "weijing", type: "calculation", difficulty: 2,
    title: "完全竞争厂商利润最大化",
    description: "完全竞争厂商成本函数 $C(q)=q^2+4q+16$，市场价格 $P=12$。求利润最大化产量与利润。",
    answer: "$q^*=4, \\pi=0$",
    answerDetail: "$MC=2q+4=P=12$，得 $q=4$；$\\pi=TR-TC=48-48=0$。",
    rubric: [
      { item: "求出 $MC=2q+4$", score: 3 },
      { item: "令 $P=MC$ 解出 $q=4$", score: 4 },
      { item: "计算利润为 0", score: 3 }
    ],
    explain: "$MC=dC/dq=2q+4$，$P=MC$ 得 $q=4$；$TC=16+16+16=48$，$TR=48$，$\\pi=0$。",
    tags: ["完全竞争", "利润最大化"]
  },
  {
    id: "weijing-calc-003", subject: "weijing", type: "calculation", difficulty: 3,
    title: "垄断厂商利润最大化",
    description: "垄断厂商需求函数 $P=20-Q$，总成本 $TC=5Q$。求利润最大化产量、价格与利润。",
    answer: "$Q^*=7.5, P^*=12.5, \\pi=56.25$",
    answerDetail: "$TR=20Q-Q^2$，$MR=20-2Q$，$MC=5$，$MR=MC$ 得 $Q=7.5$。",
    rubric: [
      { item: "写出 $TR$ 与 $MR$", score: 3 },
      { item: "令 $MR=MC$ 解出 $Q$", score: 3 },
      { item: "求出价格 $P$", score: 2 },
      { item: "求出利润", score: 2 }
    ],
    explain: "$MR=20-2Q=5$，$Q=7.5$，$P=12.5$，$\\pi=(12.5-5)\\times7.5=56.25$。",
    tags: ["垄断", "利润最大化"]
  },
  {
    id: "datastruct-calc-001", subject: "datastruct", type: "calculation", difficulty: 1,
    title: "链表插入操作",
    description: "在单链表中，已知指针 $p$ 指向某节点，在其后插入值为 $x$ 的新节点 $s$，写出核心操作语句。",
    answer: "`s->next = p->next; p->next = s;`",
    answerDetail: "先让新节点指向 $p$ 的后继，再让 $p$ 指向新节点。",
    rubric: [
      { item: "写出 $s->next=p->next$", score: 5 },
      { item: "写出 $p->next=s$", score: 5 }
    ],
    explain: "插入操作需保持链不断裂：先接后链，再改前链。",
    tags: ["链表", "插入"]
  },
  {
    id: "datastruct-calc-002", subject: "datastruct", type: "calculation", difficulty: 2,
    title: "完全二叉树叶子节点数",
    description: "一棵完全二叉树有 100 个节点，求其叶子节点数。",
    answer: "50",
    answerDetail: "完全二叉树中，若节点总数为偶数，则叶子数为 $n/2$。",
    rubric: [
      { item: "知道完全二叉树叶子数公式", score: 5 },
      { item: "代入 $n=100$ 得 50", score: 5 }
    ],
    explain: "完全二叉树叶子节点数为 $\\lceil n/2 \\rceil = 50$。",
    tags: ["二叉树", "完全二叉树"]
  },
  {
    id: "datastruct-calc-003", subject: "datastruct", type: "calculation", difficulty: 3,
    title: "Dijkstra 最短路径",
    description: "给定有向图：$A\\to B$ 权 1，$A\\to C$ 权 4，$B\\to C$ 权 2，求 $A$ 到 $C$ 的最短路径及长度。",
    answer: "路径 $A\\to B\\to C$，长度 3",
    answerDetail: "比较 $A\\to C$ 直接 4 与 $A\\to B\\to C$ 为 $1+2=3$，取最小。",
    rubric: [
      { item: "列出从 A 到 C 的所有路径", score: 4 },
      { item: "计算各路径长度", score: 4 },
      { item: "确定最短路径及长度", score: 2 }
    ],
    explain: "$A\\to C$ 直接长度为 4；$A\\to B\\to C$ 长度为 $1+2=3$，故最短为 3。",
    tags: ["图", "最短路径"]
  },

  // ============================================================
  // 证明题（12 道：4 学科 × 3 难度）
  // ============================================================
  {
    id: "gaoshu-proof-001", subject: "gaoshu", type: "proof", difficulty: 1,
    title: "定积分奇函数性质",
    description: "证明：若 $f(x)$ 在 $[-a,a]$ 上连续且为奇函数，则 $\\int_{-a}^{a} f(x)\,dx = 0$。",
    answer: "证明见解析",
    answerDetail: "$\\int_{-a}^{a}f(x)dx=\\int_{-a}^{0}f(x)dx+\\int_{0}^{a}f(x)dx$，令 $x=-t$ 得 $\\int_{-a}^{0}f(x)dx=-\\int_{0}^{a}f(t)dt$，相加为 0。",
    rubric: [
      { item: "将积分拆分为两个区间", score: 3 },
      { item: "正确作换元 $x=-t$", score: 4 },
      { item: "利用奇函数性质 $f(-t)=-f(t)$", score: 2 },
      { item: "得出两个积分相消为 0", score: 1 }
    ],
    explain: "奇函数图像关于原点对称，对称区间上正负面积抵消，积分值为 0。",
    tags: ["定积分", "奇函数"]
  },
  {
    id: "gaoshu-proof-002", subject: "gaoshu", type: "proof", difficulty: 2,
    title: "柯西中值定理",
    description: "叙述并证明柯西中值定理（提示：构造辅助函数 $F(x)=f(x)-\\frac{f(b)-f(a)}{g(b)-g(a)}g(x)$）。",
    answer: "证明见解析",
    answerDetail: "构造 $F(x)=f(x)-\\lambda g(x)$，其中 $\\lambda=\\frac{f(b)-f(a)}{g(b)-g(a)}$，则 $F(a)=F(b)$，由罗尔定理存在 $\\xi$ 使 $F'(\\xi)=0$，即 $\\frac{f'(\\xi)}{g'(\\xi)}=\\lambda$。",
    rubric: [
      { item: "准确叙述定理条件与结论", score: 3 },
      { item: "构造正确辅助函数", score: 4 },
      { item: "应用罗尔定理", score: 2 },
      { item: "整理得到结论", score: 1 }
    ],
    explain: "柯西中值定理是拉格朗日中值定理的推广，要求 $g'(x)\\ne0$。",
    tags: ["中值定理", "微分"]
  },
  {
    id: "gaoshu-proof-003", subject: "gaoshu", type: "proof", difficulty: 3,
    title: "格林公式",
    description: "叙述格林公式，并说明其证明思路（无需完整计算细节）。",
    answer: "证明见解析",
    answerDetail: "格林公式：$\\oint_L Pdx+Qdy=\\iint_D(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y})dxdy$。证明思路：将区域 $D$ 分成若干简单区域，分别验证 $\\oint Pdx=-\\iint\\frac{\\partial P}{\\partial y}dxdy$ 与 $\\oint Qdy=\\iint\\frac{\\partial Q}{\\partial x}dxdy$。",
    rubric: [
      { item: "准确写出格林公式", score: 4 },
      { item: "说明区域与边界方向", score: 2 },
      { item: "给出分部积分证明思路", score: 4 }
    ],
    explain: "格林公式建立了平面区域上的二重积分与其边界曲线积分之间的联系。",
    tags: ["曲线积分", "格林公式"]
  },
  {
    id: "xiandai-proof-001", subject: "xiandai", type: "proof", difficulty: 1,
    title: "行列式转置不变",
    description: "证明：对任意 $n$ 阶方阵 $A$，有 $|A^T|=|A|$。",
    answer: "证明见解析",
    answerDetail: "由行列式定义，$|A^T|=\\sum_{\\sigma}\\mathrm{sgn}(\\sigma)\\prod_i a_{\\sigma(i),i}=\\sum_{\\sigma}\\mathrm{sgn}(\\sigma)\\prod_i a_{i,\\sigma^{-1}(i)}=|A|$。",
    rubric: [
      { item: "写出行列式定义", score: 4 },
      { item: "说明转置后元素下标变化", score: 3 },
      { item: "利用逆排列符号不变", score: 3 }
    ],
    explain: "转置不改变逆序数的奇偶性，因此行列式值不变。",
    tags: ["行列式", "转置"]
  },
  {
    id: "xiandai-proof-002", subject: "xiandai", type: "proof", difficulty: 2,
    title: "可逆矩阵唯一性",
    description: "证明：若 $n$ 阶方阵 $A$ 可逆，则其逆矩阵唯一。",
    answer: "证明见解析",
    answerDetail: "设 $B,C$ 都是 $A$ 的逆矩阵，则 $B=BI=B(AC)=(BA)C=IC=C$。",
    rubric: [
      { item: "假设存在两个逆矩阵", score: 2 },
      { item: "利用结合律", score: 4 },
      { item: "得出 $B=C$", score: 4 }
    ],
    explain: "逆矩阵的唯一性由单位矩阵和结合律保证。",
    tags: ["矩阵", "逆矩阵"]
  },
  {
    id: "xiandai-proof-003", subject: "xiandai", type: "proof", difficulty: 3,
    title: "实对称矩阵特征值为实数",
    description: "证明：实对称矩阵的特征值都是实数。",
    answer: "证明见解析",
    answerDetail: "设 $A\\bar{x}=\\lambda\\bar{x}$，取共轭转置得 $\\bar{x}^T A = \\bar{\\lambda}\\bar{x}^T$，右乘 $\\bar{x}$ 得 $\\bar{x}^T A \\bar{x}=\\bar{\\lambda}\\bar{x}^T\\bar{x}$；又左乘 $\\bar{x}^T$ 得 $\\lambda\\bar{x}^T\\bar{x}$，故 $\\lambda=\\bar{\\lambda}$。",
    rubric: [
      { item: "写出特征方程并取共轭转置", score: 4 },
      { item: "利用 $A^T=A$", score: 3 },
      { item: "比较两式得到 $\\lambda=\\bar{\\lambda}$", score: 3 }
    ],
    explain: "实对称矩阵特征值为实数，且不同特征值对应的特征向量正交。",
    tags: ["特征值", "实对称矩阵"]
  },
  {
    id: "weijing-proof-001", subject: "weijing", type: "proof", difficulty: 1,
    title: "边际替代率等于边际效用之比",
    description: "证明：在效用最大化处，$MRS_{XY}=\\frac{MU_X}{MU_Y}$。",
    answer: "证明见解析",
    answerDetail: "沿同一条无差异曲线 $U(X,Y)=\\bar{U}$，全微分得 $MU_X dX+MU_Y dY=0$，故 $-\\frac{dY}{dX}=\\frac{MU_X}{MU_Y}=MRS_{XY}$。",
    rubric: [
      { item: "写出无差异曲线全微分", score: 4 },
      { item: "整理得 $dY/dX$", score: 3 },
      { item: "联系 MRS 定义", score: 3 }
    ],
    explain: "MRS 是无差异曲线斜率的绝对值，等于边际效用之比。",
    tags: ["消费者理论", "MRS"]
  },
  {
    id: "weijing-proof-002", subject: "weijing", type: "proof", difficulty: 2,
    title: "完全竞争长期均衡零利润",
    description: "证明：完全竞争厂商长期均衡时经济利润为零。",
    answer: "证明见解析",
    answerDetail: "长期中厂商可自由进出。若利润大于零，新厂商进入使供给增加、价格下降；若利润小于零，厂商退出使供给减少、价格上升。均衡时 $P=LAC_{\\min}$，经济利润为零。",
    rubric: [
      { item: "说明自由进出机制", score: 4 },
      { item: "分析利润不为零时的调整", score: 4 },
      { item: "得出零利润结论", score: 2 }
    ],
    explain: "长期均衡时 $P=LMC=LAC_{\\min}$，厂商只能获得正常利润。",
    tags: ["完全竞争", "长期均衡"]
  },
  {
    id: "weijing-proof-003", subject: "weijing", type: "proof", difficulty: 3,
    title: "垄断造成无谓损失",
    description: "用图形和公式说明垄断会造成无谓损失（Deadweight Loss）。",
    answer: "证明见解析",
    answerDetail: "完全竞争产量 $Q_c$ 满足 $P=MC$；垄断产量 $Q_m$ 满足 $MR=MC$，$Q_m<Q_c$。无谓损失为需求曲线与 MC 曲线之间从 $Q_m$ 到 $Q_c$ 的三角形面积 $DWL=\\int_{Q_m}^{Q_c}[D(Q)-MC(Q)]dQ$。",
    rubric: [
      { item: "比较完全竞争与垄断产量", score: 4 },
      { item: "指出产量低于社会最优", score: 3 },
      { item: "给出无谓损失的面积表达", score: 3 }
    ],
    explain: "垄断厂商限制产量、提高价格，导致消费者剩余和总剩余减少。",
    tags: ["垄断", "无谓损失"]
  },
  {
    id: "datastruct-proof-001", subject: "datastruct", type: "proof", difficulty: 1,
    title: "二叉树叶子与度为 2 节点关系",
    description: "证明：任意非空二叉树中，叶子节点数 $n_0$ 与度为 2 的节点数 $n_2$ 满足 $n_0=n_2+1$。",
    answer: "证明见解析",
    answerDetail: "设度为 1 的节点数为 $n_1$，总节点数 $n=n_0+n_1+n_2$，边数 $B=n-1=n_1+2n_2$，联立得 $n_0=n_2+1$。",
    rubric: [
      { item: "用节点数与边数建立等式", score: 5 },
      { item: "消去 $n_1$ 得到结论", score: 5 }
    ],
    explain: "这是二叉树的基本性质，在哈夫曼树、BST 分析中常用。",
    tags: ["二叉树", "性质"]
  },
  {
    id: "datastruct-proof-002", subject: "datastruct", type: "proof", difficulty: 2,
    title: "BST 中序遍历有序",
    description: "证明：二叉排序树的中序遍历序列是递增有序的。",
    answer: "证明见解析",
    answerDetail: "由 BST 定义，左子树所有节点值 < 根 < 右子树所有节点值。中序遍历顺序为左-根-右，故序列递增。",
    rubric: [
      { item: "写出 BST 定义", score: 4 },
      { item: "说明中序遍历顺序", score: 3 },
      { item: "递归或归纳完成证明", score: 3 }
    ],
    explain: "BST 的中序有序性是其核心性质，也是排序和查找的基础。",
    tags: ["二叉排序树", "中序遍历"]
  },
  {
    id: "datastruct-proof-003", subject: "datastruct", type: "proof", difficulty: 3,
    title: "快速排序平均时间复杂度",
    description: "简述证明快速排序平均时间复杂度为 $O(n\\log n)$ 的思路。",
    answer: "证明见解析",
    answerDetail: "设 $T(n)$ 为平均比较次数，$T(n)=(n-1)+\\frac{1}{n}\\sum_{i=0}^{n-1}[T(i)+T(n-1-i)]$。通过归纳或主定理可证 $T(n)=O(n\\log n)$。",
    rubric: [
      { item: "建立递归方程", score: 4 },
      { item: "解释分区点均匀分布", score: 3 },
      { item: "得出 $O(n\\log n)$ 结论", score: 3 }
    ],
    explain: "快排平均性能好的原因是每次分区大致将数组一分为二。",
    tags: ["排序", "快速排序"]
  },

  // ============================================================
  // 画图题（12 道，4 学科 × 3 难度）
  // ============================================================
  // 高数二 · 画图题（3 道）
  {
    id: "gaoshu-drawing-001", subject: "gaoshu", type: "drawing", difficulty: 1,
    title: "抛物线草图",
    description: "画出函数 $y=x^2$ 在区间 $[-2,2]$ 上的图像，并标出顶点与对称轴。",
    answer: "参考图形见解析",
    answerDetail: "图像为开口向上的抛物线，顶点 $(0,0)$，对称轴为 $y$ 轴（$x=0$），在 $x=\\pm2$ 处 $y=4$。",
    rubric: [
      { item: "画出开口向上的抛物线", score: 4 },
      { item: "标出顶点 $(0,0)$", score: 3 },
      { item: "标出对称轴 $x=0$", score: 3 }
    ],
    explain: "$y=x^2$ 是偶函数，关于 $y$ 轴对称，最小值在 $x=0$。",
    tags: ["函数图像", "抛物线"]
  },
  {
    id: "gaoshu-drawing-002", subject: "gaoshu", type: "drawing", difficulty: 2,
    title: "正弦函数图像",
    description: "画出 $y=\\sin x$ 在 $[0,2\\pi]$ 上的图像，标出最大值、最小值与零点。",
    answer: "参考图形见解析",
    answerDetail: "正弦曲线从 $(0,0)$ 上升至 $(\\pi/2,1)$，下降至 $(3\\pi/2,-1)$，再回到 $(2\\pi,0)$；零点为 $0,\\pi,2\\pi$。",
    rubric: [
      { item: "曲线走势正确", score: 4 },
      { item: "标出极值点 $(\\pi/2,1)$ 与 $(3\\pi/2,-1)$", score: 3 },
      { item: "标出零点", score: 3 }
    ],
    explain: "$\\sin x$ 周期为 $2\\pi$，在 $[0,2\\pi]$ 内最大值为 1、最小值为 -1。",
    tags: ["三角函数", "图像"]
  },
  {
    id: "gaoshu-drawing-003", subject: "gaoshu", type: "drawing", difficulty: 3,
    title: "曲线围成区域",
    description: "在同一坐标系中画出 $y=\\sqrt{x}$ 与 $y=x$，并标出它们围成的封闭区域及交点。",
    answer: "参考图形见解析",
    answerDetail: "两曲线交于 $(0,0)$ 与 $(1,1)$；在 $[0,1]$ 上 $\\sqrt{x} \\ge x$，封闭区域位于两者之间。",
    rubric: [
      { item: "画出两条曲线并标出交点", score: 4 },
      { item: "正确识别 $[0,1]$ 为上边界", score: 3 },
      { item: "清晰标示封闭区域", score: 3 }
    ],
    explain: "由 $\\sqrt{x}=x$ 解得 $x=0$ 或 $1$，围成区域面积 $S=\\int_0^1(\\sqrt{x}-x)dx=1/6$。",
    tags: ["定积分", "面积"]
  },

  // 线性代数 · 画图题（3 道）
  {
    id: "xiandai-drawing-001", subject: "xiandai", type: "drawing", difficulty: 1,
    title: "平面向量图示",
    description: "在平面直角坐标系中画出向量 $\\vec{a}=(2,1)$ 与 $\\vec{b}=(1,3)$，并标出起点、终点与分量。",
    answer: "参考图形见解析",
    answerDetail: "$\\vec{a}$ 从原点指向 $(2,1)$，$\\vec{b}$ 从原点指向 $(1,3)$；可在坐标轴上标出对应的分量投影。",
    rubric: [
      { item: "画出坐标系与两个向量", score: 4 },
      { item: "标出向量终点坐标", score: 3 },
      { item: "标出分量投影", score: 3 }
    ],
    explain: "向量用从原点出发的有向线段表示，终点坐标即其分量。",
    tags: ["向量", "坐标"]
  },
  {
    id: "xiandai-drawing-002", subject: "xiandai", type: "drawing", difficulty: 2,
    title: "线性变换后的单位正方形",
    description: "画出线性变换 $T(x,y)=(x+y,x-y)$ 将单位正方形 $[0,1]\\times[0,1]$ 映射成的图形，并标出四个顶点。",
    answer: "参考图形见解析",
    answerDetail: "四个顶点映射为 $(0,0)\\to(0,0)$、$(1,0)\\to(1,1)$、$(0,1)\\to(1,-1)$、$(1,1)\\to(2,0)$，形成菱形。",
    rubric: [
      { item: "正确计算四个顶点", score: 4 },
      { item: "画出映射后的四边形", score: 3 },
      { item: "顶点标注清晰", score: 3 }
    ],
    explain: "线性变换把平行四边形映射为平行四边形（此处单位正方形映射为菱形）。",
    tags: ["线性变换", "几何"]
  },
  {
    id: "xiandai-drawing-003", subject: "xiandai", type: "drawing", difficulty: 3,
    title: "二次型等高线草图",
    description: "画出二次型 $f(x,y)=x^2+4xy+y^2$ 的一条非零等高线草图，并标出大致的主轴方向。",
    answer: "参考图形见解析",
    answerDetail: "该二次型矩阵特征值一正一负，等高线为双曲线；主轴方向对应特征向量，大致沿 $y=x$ 与 $y=-x$。",
    rubric: [
      { item: "判断等高线为双曲线", score: 4 },
      { item: "画出两条分支", score: 3 },
      { item: "标出主轴方向", score: 3 }
    ],
    explain: "矩阵 $A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ 特征值为 $3$ 与 $-1$，符号相反，故为双曲型。",
    tags: ["二次型", "特征值"]
  },

  // 微观经济学 · 画图题（3 道）
  {
    id: "weijing-drawing-001", subject: "weijing", type: "drawing", difficulty: 1,
    title: "市场均衡图示",
    description: "画出完全竞争市场的供给曲线 $S$ 与需求曲线 $D$，并标出均衡价格 $P^*$ 与均衡数量 $Q^*$。",
    answer: "参考图形见解析",
    answerDetail: "需求曲线向右下方倾斜，供给曲线向右上方倾斜，两者交点决定 $(Q^*,P^*)$。",
    rubric: [
      { item: "画出供需两条曲线", score: 4 },
      { item: "标出交点", score: 3 },
      { item: "正确标注 $P^*$、$Q^*$", score: 3 }
    ],
    explain: "均衡时需求量等于供给量，对应价格为均衡价格。",
    tags: ["供需", "均衡"]
  },
  {
    id: "weijing-drawing-002", subject: "weijing", type: "drawing", difficulty: 2,
    title: "完全竞争厂商成本曲线",
    description: "画出完全竞争厂商的 $MC$、$AC$、$AVC$ 曲线，并标出停止营业点。",
    answer: "参考图形见解析",
    answerDetail: "$MC$ 穿过 $AC$ 与 $AVC$ 的最低点；停止营业点位于 $P=AVC_{\\min}$ 处。",
    rubric: [
      { item: "画出 $MC$、$AC$、$AVC$ 三条曲线", score: 4 },
      { item: "标出 $MC$ 穿过 $AVC$ 最低点", score: 3 },
      { item: "正确标出停止营业点", score: 3 }
    ],
    explain: "当价格低于平均可变成本最低点时，厂商应停止生产。",
    tags: ["完全竞争", "成本曲线"]
  },
  {
    id: "weijing-drawing-003", subject: "weijing", type: "drawing", difficulty: 3,
    title: "垄断厂商利润最大化",
    description: "画出垄断厂商的需求曲线 $D$、边际收益曲线 $MR$ 与边际成本曲线 $MC$，并标出利润最大化产量 $Q_m$ 与价格 $P_m$。",
    answer: "参考图形见解析",
    answerDetail: "$MR$ 位于 $D$ 下方且斜率两倍；利润最大化条件 $MR=MC$ 决定 $Q_m$，再由 $D$ 确定 $P_m$。",
    rubric: [
      { item: "画出 $D$、$MR$、$MC$ 三条曲线", score: 4 },
      { item: "由 $MR=MC$ 确定 $Q_m$", score: 3 },
      { item: "由需求曲线确定 $P_m$", score: 3 }
    ],
    explain: "垄断厂商按 $MR=MC$ 决定产量，再按消费者愿意支付的价格定价。",
    tags: ["垄断", "利润最大化"]
  },

  // 数据结构 · 画图题（3 道）
  {
    id: "datastruct-drawing-001", subject: "datastruct", type: "drawing", difficulty: 1,
    title: "单链表图示",
    description: "画出包含 3 个节点 $A \\to B \\to C$ 的单链表，并标出头指针与每个节点的数据域、指针域。",
    answer: "参考图形见解析",
    answerDetail: "头指针指向节点 $A$，每个节点分为数据域与 next 指针域，$C$ 的 next 为 $NULL$。",
    rubric: [
      { item: "画出三个节点及箭头", score: 4 },
      { item: "标出头指针", score: 3 },
      { item: "标出尾节点空指针", score: 3 }
    ],
    explain: "单链表通过指针依次连接，尾节点指向空。",
    tags: ["链表", "单链表"]
  },
  {
    id: "datastruct-drawing-002", subject: "datastruct", type: "drawing", difficulty: 2,
    title: "二叉树图示",
    description: "画出根为 5、左子 3、右子 8、3 的左右子分别为 1 和 4 的二叉树，并标出中序遍历顺序。",
    answer: "参考图形见解析",
    answerDetail: "树结构：5 为根，左孩子 3（左 1 右 4），右孩子 8；中序遍历顺序为 $1,3,4,5,8$。",
    rubric: [
      { item: "画出正确的二叉树结构", score: 4 },
      { item: "节点数值标注正确", score: 3 },
      { item: "标出中序遍历顺序", score: 3 }
    ],
    explain: "二叉树中序遍历顺序为左-根-右。",
    tags: ["二叉树", "遍历"]
  },
  {
    id: "datastruct-drawing-003", subject: "datastruct", type: "drawing", difficulty: 3,
    title: "大根堆结构图",
    description: "对序列 $[3,1,4,2]$ 建立大根堆，画出最终堆结构并标出父子关系。",
    answer: "参考图形见解析",
    answerDetail: "大根堆数组为 $[4,3,2,1]$；堆顶为 4，左孩子 3，右孩子 2，3 的左孩子为 1。",
    rubric: [
      { item: "正确建堆得到 $[4,3,2,1]$", score: 4 },
      { item: "画出堆的树形结构", score: 3 },
      { item: "父子关系标注正确", score: 3 }
    ],
    explain: "大根堆要求每个节点值不小于其子节点值。",
    tags: ["堆", "堆排序"]
  }
];

// 兼容旧导入：仅导出选择题
export const QUIZZES = QUESTIONS.filter((q) => q.type === "choice");
