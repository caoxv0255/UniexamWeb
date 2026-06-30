// 数据结构与算法 数据（提取自 PDF + 公式补充）

export const datastruct = {
  id: "datastruct",
  name: "数据结构与算法",
  icon: "🌳",
  color: "#8b5cf6",
  examTime: "7/2 下午",
  desc: "线性表 · 树 · 图 · 排序 · 查找 · 算法设计",
  chapters: [
    {
      id: "ch1",
      name: "第1章 绪论",
      questionTypes: [
        {
          id: "ch1-qt1",
          badge: "知识点",
          title: "基本概念",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "概念\n定义\n数据结构\n相互之间存在⼀种或多种特定关系的数据元素的集合\n数据元素\n数据的基本单位，在计算机中通常作为⼀个整体进⾏考虑和处理\n数据项\n构成数据元素的不可分割的最⼩单位\n逻辑结构\n数据元素之间的逻辑关系，与存储⽆关\n存储结构（物理结构）\n数据元素及其关系在计算机内的存储⽅式\n逻辑结构类型\n线性结构        非线性结构\n├── 线性表      ├── 树\n├── 栈          └── 图\n├── 队列\n└── 串\n存储结构类型\n类型\n特点\n优点\n缺点\n顺序存储\n连续存储单元\n可随机访问\n需连续空间，插⼊删除不便\n链式存储\n指针链接\n动态分配，插⼊删除⽅便\n占⽤额外空间，不可随机访问\n索引存储\n建⽴索引表\n检索快\n索引表占空间\n散列存储\n散列函数\n检索快\n冲突处理\n1.2 算法与算法分析\n算法的5个重要特性\n1. 有输⼊：可有可⽆\n2. 有输出：⾄少有⼀个输出\n3. 确定性：每条指令⽆歧义\n4. 可⾏性：基本操作可执⾏\n5. 有穷性：执⾏有限步后终⽌\n时间复杂度\n定义：算法执⾏时间与问题规模n的函数T(n)\n常⻅复杂度等级（从低到⾼）：\nO(1) < O(log₂n) < O(n) < O(nlog₂n) < O(n²) < O(n³) < O(2ⁿ)\n计算规则：\n加法规则：T(n) = T₁(n) + T₂(n) = O(max(f(n), g(n)))\n乘法规则：T(n) = T₁(n) × T₂(n) = O(f(n) × g(n))\n空间复杂度\n定义：算法执⾏所需的存储空间与问题规模的函数S(n)\n类型\n说明\n固定部分\n程序代码、变量等，与n⽆关\n可变部分\n动态分配的空间、递归栈等，与n有关\n1.3 题型攻略\n\n题型⼀：时间复杂度计算\n识别特征\n给定代码段，求时间复杂度\n给定问题规模，求基本操作执⾏次数\n解法步骤\n步骤1：找出语句频度最大的语句（基本语句）\n步骤2：分析该语句的执行次数与n的关系\n步骤3：使用渐进表示法O(...)\n\n题型⼆：数据结构基本概念判断\n\n**本节公式：**\n- $O(n)$，移动 $n/2$ 次\n- $O(n)$，移动 $(n-1)/2$ 次\n- $O(n)$\n- $O(1)$（已知位置）",
          conceptsTable: [
            { item: "顺序表插入", content: "$O(n)$，移动 $n/2$ 次" },
            { item: "顺序表删除", content: "$O(n)$，移动 $(n-1)/2$ 次" },
            { item: "链表查找", content: "$O(n)$" },
            { item: "链表插入/删除", content: "$O(1)$（已知位置）" },
          ],
          examMethods: [
            { pattern: "考法", feature: "识别特征", solution: "解法" },
            { pattern: "存储结构与逻辑结构", feature: "\"采⽤...存储\"描述", solution: "顺序/链式→存储结构，树/图→逻辑结构" },
            { pattern: "算法的特性", feature: "考察5个特性", solution: "有穷性、确定性等关键词" },
            { pattern: "时间复杂度计算", feature: "给代码求复杂度", solution: "分析循环层数" },
            { pattern: "空间复杂度计算", feature: "给代码求空间", solution: "找动态分配/递归深度" },
          ],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch2",
      name: "第2章 线性表",
      questionTypes: [
        {
          id: "ch2-qt1",
          badge: "知识点",
          title: "线性表的顺序存储",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "顺序表结构体定义\nstruct SqList {\nElemType *elem;   // 存储空间基地址\nint length;       // 当前长度\nint listsize;     // 分配的存储容量\n};\n顺序表特点\n地址连续：LOC(a₁) + (i-1)×k\n随机存取：时间复杂度O(1)\n存储密度：= 1（100%利⽤）\n基本操作时间复杂度\n操作\n时间复杂度\n存取第i个元素\nO(1)\n查找\nO(n)\n插⼊\nO(n)\n删除\nO(n)\n2.2 线性表的链式存储\n单链表结构体定义\nstruct LNode {\nElemType data;\nstruct LNode *next;\n};\ntypedef struct LNode *LinkList;\n单链表特点\n⽆需连续空间\n通过指针链接\n头结点：第⼀个结点前的⼈⼯结点（不含数据）\n循环链表 vs 双链表\n类型\n特点\n判空条件\n单链表\n只含next指针\nhead->next == NULL\n循环单链表\n尾结点next指向头结点\nhead->next == head\n双链表\n含prior和next指针\n-\n循环双链表\n头结点的prior指向尾结点\nhead->prior == head\n单链表基本操作时间复杂度\n操作\n时间复杂度\n说明\n建⽴（头插法）\nO(n)\n每次头插\n建⽴（尾插法）\nO(n)\n每次尾插\n按序号查找\nO(n)\n最坏情况\n按值查找\nO(n)\n最坏情况\n插⼊\nO(n)\n定位+插⼊\n删除\nO(n)\n定位+删除\n2.3 栈和队列\n栈（后进先出 LIFO）\n顺序栈结构体定义：\nstruct SqStack {\nElemType *base;   // 栈底指针\nElemType *top;    // 栈顶指针\nint stacksize;    // 栈容量\n};\n栈的基本操作：\n操作\n说明\nInitStack(&S)\n初始化空栈\nPush(&S, e)\n压栈\nPop(&S, &e)\n弹栈\nGetTop(S, &e)\n取栈顶\nStackEmpty(S)\n判空\n栈空条件：S.top == S.base  栈满条件：S.top - S.base == S.stacksize\n队列（先进先出 FIFO）\n循环队列结构体定义：\nstruct SqQueue {\nElemType *base;   // 存储空间基地址\nint front;        // 头指针\nint rear;         // 尾指针\n};\n循环队列关键公式：\n操作\n公式\n队空条件\nQ.front == Q.rear\n队满条件\n(Q.rear + 1) % MAXSIZE == Q.front\n队列⻓度\n(Q.rear - Q.front + MAXSIZE) % MAXSIZE\n⼊队\nQ.rear = (Q.rear + 1) % MAXSIZE\n出队\nQ.front = (Q.front + 1) % MAXSIZE\n2.4 题型攻略\n\n题型⼀：链表基本操作\n单链表删除结点（第i个结点后）\np = GetElem(L, i);      // 找到第i个结点\nq = p->next;             // q指向第i+1个结点\np->next = q->next;       // 从链上摘下q\nfree(q);                 // 释放q\n单链表插⼊结点（第i个结点后）\np = GetElem(L, i);       // 找到第i个结点\ns = new LNode;           // 创建新结点\ns->data = e;\ns->next = p->next;       // 新结点指向后继\np->next = s;             // 前驱指向新结点\n链表逆置（头插法）\nvoid ReverseList(LinkList &L) {\nLinkList p = L->next;    // p指向第一个数据结点\nL->next = NULL;         // 头结点next置空\nwhile(p != NULL) {\nLinkList q = p->next;   // 保存后继\np->next = L->next;      // 头插\nL->next = p;\np = q;                   // 移动p\n}\n}\n\n题型⼆：栈的应⽤——出栈序列判断\n识别特征\n给出进栈序列和出栈序列\n判断是否可能/求栈容量\n解法步骤\n步骤1：理解栈的LIFO特性\n步骤2：模拟入栈出栈过程\n步骤3：判断出栈序列合法性\n典型例题（2018-2019真题）\n题⽬：进栈次序为A,B,C,D,E，以下出栈序列不可能的是？\nA. A,B,C,D,E ✅\nB. B,C,D,E,A ✅\nC. E,A,B,C,D ❌\nD. E,D,C,B,A ✅\n解答：C不可能，因为E先出说明A,B,C,D都在栈中，出栈顺序必须是D,C,B,A\n\n**本节公式：**\n- $O(n)$，移动 $n/2$ 次\n- $O(n)$，移动 $(n-1)/2$ 次\n- $O(n)$\n- $O(1)$（已知位置）",
          conceptsTable: [
            { item: "顺序表插入", content: "$O(n)$，移动 $n/2$ 次" },
            { item: "顺序表删除", content: "$O(n)$，移动 $(n-1)/2$ 次" },
            { item: "链表查找", content: "$O(n)$" },
            { item: "链表插入/删除", content: "$O(1)$（已知位置）" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
        {
          id: "ch2-qt2",
          badge: "题型3",
          title: "循环队列元素个数",
          difficulty: "中等",
          examPattern: "",
          knowledge: "\n\n**本节公式：**\n- $O(n)$，移动 $n/2$ 次\n- $O(n)$，移动 $(n-1)/2$ 次\n- $O(n)$\n- $O(1)$（已知位置）",
          conceptsTable: [
            { item: "顺序表插入", content: "$O(n)$，移动 $n/2$ 次" },
            { item: "顺序表删除", content: "$O(n)$，移动 $(n-1)/2$ 次" },
            { item: "链表查找", content: "$O(n)$" },
            { item: "链表插入/删除", content: "$O(1)$（已知位置）" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch3",
      name: "第3章 字符串和多维数组",
      questionTypes: [
        {
          id: "ch3-qt1",
          badge: "知识点",
          title: "字符串",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "概念\n说明\n串⻓\n串中字符的个数\n空串\n⻓度为零的串\n空格串\n仅含空格的串\n⼦串\n串中任意连续字符组成的序列\n主串\n包含⼦串的串\n串的存储结构\nstruct HString {\nchar *ch;    // 字符数组\nint length;  // 串长\n};\n3.2 模式匹配（重点）\n必背知识——KMP算法\nNext数组计算\n核⼼思想：当匹配失败时，利⽤已经部分匹配的信息，不回溯主串指针\nNext[j]含义：模式串第j个字符匹配失败时，应跳转到的位置\n计算公式：\nNext[1] = 0\nNext[2] = 1\nNext[j] = k（当P[1..k-1] = P[j-k+1..j-1]时，k为最长相等前后缀长度+1）\nNextval数组（Next的改进）\n当P[j] = P[Next[j]]时，Nextval[j] = Nextval[Next[j]]\n数组地址计算\n按⾏优先（C/C++/Pascal）：\nLOC(i,j) = LOC(0,0) + (i×n + j) × k\n按列优先（Fortran）：\nLOC(i,j) = LOC(0,0) + (j×m + i) × k\n特殊矩阵压缩存储\n矩阵类型\n压缩存储⼤⼩\n存储⽅式\n对称矩阵\nn(n+1)/2\n只存下三⻆（含对⻆线）\n三⻆矩阵\nn(n+1)/2\n只存下三⻆+常数\n对⻆矩阵\n3n-2\n只存三条对⻆线\n\n**本节公式：**\n- $O(n)$，移动 $n/2$ 次\n- $O(n)$，移动 $(n-1)/2$ 次\n- $O(n)$\n- $O(1)$（已知位置）",
          conceptsTable: [
            { item: "顺序表插入", content: "$O(n)$，移动 $n/2$ 次" },
            { item: "顺序表删除", content: "$O(n)$，移动 $(n-1)/2$ 次" },
            { item: "链表查找", content: "$O(n)$" },
            { item: "链表插入/删除", content: "$O(1)$（已知位置）" },
          ],
          examMethods: [],
          steps: [
            "步骤1：写出模式串P",
            "步骤2：按位置标号1到m",
            "步骤3：计算每个位置的Next值",
            "步骤4：若需要，计算Nextval值",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch4",
      name: "第4章 树和⼆叉树",
      questionTypes: [
        {
          id: "ch4-qt1",
          badge: "知识点",
          title: "⼆叉树基本概念",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "⼆叉树5种基本形态\n空二叉树     只有根结点     右子树为空的二叉树\n○            ○              ○\n│            ╱\n○            ○\n╱            ○\n○\n左子树为空的二叉树       满二叉树\n○              ●\n╱                ●●\n○                ●●●\n╱               ●●●●\n○\n⼆叉树性质\n性质\n内容\n性质1\n在⼆叉树第i层上⾄多有2^(i-1)个结点\n性质2\n深度为k的⼆叉树⾄多有2^k-1个结点\n性质3\n终端结点数 = 度为2的结点数 + 1\n性质4\n完全⼆叉树深度 = ⌊log₂n⌋ + 1\n完全⼆叉树性质\n结点i的左孩⼦：2i（若2i ≤ n）\n结点i的右孩⼦：2i+1（若2i+1 ≤ n）\n结点i的⽗节点：⌊i/2⌋\n4.2 ⼆叉树遍历（核⼼）\n遍历序列关系\n遍历⽅式\n序列特点\n根的位置\n先序（DLR）\n根左右\n第⼀个\n中序（LDR）\n左根右\n中间\n后序（LRD）\n左右根\n最后⼀个\n层序\n按层从上到下\n按层访问\n由遍历序列重建⼆叉树\n关键：必须知道中序序列 + 任意⼀种其他遍历序列\n做题步骤：\n1. 从先序/后序确定根\n2. 在中序中划分左右子树\n3. 递归处理左右子树\n4.3 题型攻略\n\n题型⼀：⼆叉树遍历代码\n先序遍历递归算法\nvoid PreOrder(BiTree T) {\nif(T != NULL) {\nVisit(T->data);        // 访问根\nPreOrder(T->lchild);   // 遍历左子树\nPreOrder(T->rchild);   // 遍历右子树\n}\n}\n中序遍历递归算法\nvoid InOrder(BiTree T) {\nif(T != NULL) {\nInOrder(T->lchild);\nVisit(T->data);\nInOrder(T->rchild);\n}\n}\n后序遍历递归算法\nvoid PostOrder(BiTree T) {\nif(T != NULL) {\nPostOrder(T->lchild);\nPostOrder(T->rchild);\nVisit(T->data);\n}\n}\n⼆叉树结构体定义\nstruct BiTNode {\nElemType data;\nstruct BiTNode *lchild, *rchild;\n};\ntypedef struct BiTNode *BiTree;\n\n题型⼆：给定中序和后序求先序（2018-2019真题）\n已知：中序 cbedahgijf，后序 cedbhjigfa 求：先序序列\n解题步骤：\n1. 从后序最后一个确定根：a\n2. 在中序中划分：\n- cbed 在左子树\n- hgijf 在右子树\n3. 后序 cedb → 左子树根为 b\n后序 hjgif → 右子树根为 f\n4. 递归继续...\n5. 最终得到先序：abcdefghij\n\n**本节公式：**\n- $n_0 = n_2 + 1$（叶子 = 度2节点 + 1）\n- $\\lfloor \\log_2 n \\rfloor + 1$\n- $O(h)$，最坏 $O(n)$\n- $O(\\log n)$\n- $n$ 个叶子共 $2n-1$ 个节点",
          conceptsTable: [
            { item: "二叉树性质", content: "$n_0 = n_2 + 1$（叶子 = 度2节点 + 1）" },
            { item: "完全二叉树深度", content: "$\\lfloor \\log_2 n \\rfloor + 1$" },
            { item: "BST查找", content: "$O(h)$，最坏 $O(n)$" },
            { item: "AVL查找", content: "$O(\\log n)$" },
            { item: "哈夫曼树", content: "$n$ 个叶子共 $2n-1$ 个节点" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["树"]
        },
        {
          id: "ch4-qt2",
          badge: "题型3",
          title: "哈夫曼树与哈夫曼编码",
          difficulty: "中等",
          examPattern: "",
          knowledge: "类型\n情况\n调整⽅法\nLL型\n左左\n单右旋\nRR型\n右右\n单左旋\nLR型\n左右\n先左旋后右旋\nRL型\n右左\n先右旋后左旋\n平衡因⼦\nBF = 左⼦树深度 - 右⼦树深度\nAVL树：|BF| ≤ 1\n\n**本节公式：**\n- $n_0 = n_2 + 1$（叶子 = 度2节点 + 1）\n- $\\lfloor \\log_2 n \\rfloor + 1$\n- $O(h)$，最坏 $O(n)$\n- $O(\\log n)$\n- $n$ 个叶子共 $2n-1$ 个节点",
          conceptsTable: [
            { item: "二叉树性质", content: "$n_0 = n_2 + 1$（叶子 = 度2节点 + 1）" },
            { item: "完全二叉树深度", content: "$\\lfloor \\log_2 n \\rfloor + 1$" },
            { item: "BST查找", content: "$O(h)$，最坏 $O(n)$" },
            { item: "AVL查找", content: "$O(\\log n)$" },
            { item: "哈夫曼树", content: "$n$ 个叶子共 $2n-1$ 个节点" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["树"]
        },
      ]
    },
    {
      id: "ch5",
      name: "第5章 图",
      questionTypes: [
        {
          id: "ch5-qt1",
          badge: "知识点",
          title: "图的存储结构",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "邻接矩阵\n#define MAX_VERTEX_NUM 20\ntypedef struct {\nVertexType vexs[MAX_VERTEX_NUM];  // 顶点信息\nEdgeType arc[MAX_VERTEX_NUM][MAX_VERTEX_NUM];  // 边信息\nint vexnum, arcnum;  // 顶点数、边数\n} MGraph;\n特点：\n⽆向图对称矩阵\n有向图不⼀定对称\n空间复杂度：O(n²)\n邻接表\nstruct ArcNode {\nint adjvex;          // 邻接点位置\nstruct ArcNode *nextarc;\n};\ntypedef struct {\nVertexType data;\nArcNode *firstarc;\n} VNode, AdjList[MAX_VERTEX_NUM];\nstruct ALGraph {\nAdjList vertices;\nint vexnum, arcnum;\n};\n特点：\n空间复杂度：O(n+e)\n适合稀疏图\n5.2 图的遍历\n深度优先遍历（DFS）\n类似先序遍历\n使⽤栈/递归\n时间复杂度：O(n+e)\n⼴度优先遍历（BFS）\n类似层序遍历\n使⽤队列\n时间复杂度：O(n+e)\n代码模板\n// 邻接表的DFS\nbool visited[MAX_VERTEX_NUM];\nvoid DFS(ALGraph G, int v) {\nvisited[v] = true;\nVisit(G.vertices[v].data);\nArcNode *p = G.vertices[v].firstarc;\nwhile(p != NULL) {\nif(!visited[p->adjvex])\nDFS(G, p->adjvex);\np = p->nextarc;\n}\n}\n// 邻接表的BFS\nvoid BFS(ALGraph G, int v) {\nqueue<int> Q;\nvisited[v] = true;\nVisit(G.vertices[v].data);\nQ.push(v);\nwhile(!Q.empty()) {\nint u = Q.front();\nQ.pop();\nArcNode *p = G.vertices[u].firstarc;\nwhile(p != NULL) {\nif(!visited[p->adjvex]) {\nvisited[p->adjvex] = true;\nVisit(G.vertices[p->adjvex].data);\nQ.push(p->adjvex);\n}\np = p->nextarc;\n}\n}\n}\n5.3 最⼩⽣成树\nPrim算法（普⾥姆算法）\n基本思想：从某顶点出发，逐步扩展，每次选择权值最⼩的边\n时间复杂度：O(n²)\nvoid Prim(MGraph G, int v0) {\nint lowcost[MAX_VERTEX_NUM];\nint adjvex[MAX_VERTEX_NUM];\n// 初始化\nfor(int i = 0; i < G.vexnum; i++) {\nlowcost[i] = G.arc[v0][i];\nadjvex[i] = v0;\n}\nlowcost[v0] = 0;  // 标记已加入\nfor(int i = 1; i < G.vexnum; i++) {\nint k = MinEdge(lowcost, G.vexnum);\nlowcost[k] = 0;  // 加入生成树\n// 更新lowcost和adjvex\nfor(int j = 0; j < G.vexnum; j++) {\nif(G.arc[k][j] < lowcost[j]) {\nlowcost[j] = G.arc[k][j];\nadjvex[j] = k;\n}\n}\n}\n}\nKruskal算法（克鲁斯卡尔算法）\n基本思想：按权值从⼩到⼤选边，不形成环\n时间复杂度：O(eloge)\n核⼼：使⽤并查集判断是否成环\n贪心选择：每次选权值最小且不成环的边\n5.4 最短路径\nDijkstra算法（单源最短路径）\n适⽤：⾮负权图\n时间复杂度：O(n²)\n核⼼：dist[i] = min(当前dist[i], dist[k] + arc[k][i])\nvoid Dijkstra(MGraph G, int v0) {\nint dist[MAX_VERTEX_NUM];\nint S[MAX_VERTEX_NUM];\n// 初始化\nfor(int i = 0; i < G.vexnum; i++) {\ndist[i] = G.arc[v0][i];\nS[i] = 0;\n}\nS[v0] = 1;\nfor(int i = 1; i < G.vexnum; i++) {\nint u = 0, min = INFINITY;\n// 找最小dist\nfor(int j = 0; j < G.vexnum; j++) {\nif(!S[j] && dist[j] < min) {\nmin = dist[j];\nu = j;\n}\n}\nS[u] = 1;\n// 更新dist\nfor(int w = 0; w < G.vexnum; w++) {\nif(!S[w] && dist[u] + G.arc[u][w] < dist[w])\ndist[w] = dist[u] + G.arc[u][w];\n}\n}\n}\n5.5 拓扑排序\nAOV⽹：⽤顶点表⽰活动的有向⽆环图\n拓扑排序：将AOV⽹中所有顶点排成线性序列\n特点：\n若存在拓扑序列，图⽆环\n若图⽆环，必存在拓扑序列\n算法步骤：\n1. 计算所有顶点入度\n2. 将入度为0的顶点入栈\n3. 栈非空时，弹出顶点，输出\n4. 将其邻接点的入度-1\n5. 若邻接点入度变为0，入栈\n\n**本节公式：**\n- $O(V+E)$\n- $O(n^2)$，稠密图\n- $O(e \\log e)$，稀疏图\n- $O(n^2)$\n- $O(n^3)$\n- $O(V+E)$",
          conceptsTable: [
            { item: "DFS/BFS", content: "$O(V+E)$" },
            { item: "Prim", content: "$O(n^2)$，稠密图" },
            { item: "Kruskal", content: "$O(e \\log e)$，稀疏图" },
            { item: "Dijkstra", content: "$O(n^2)$" },
            { item: "Floyd", content: "$O(n^3)$" },
            { item: "拓扑排序", content: "$O(V+E)$" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["图"]
        },
      ]
    },
    {
      id: "ch6",
      name: "第6章 查找",
      questionTypes: [
        {
          id: "ch6-qt1",
          badge: "知识点",
          title: "顺序查找",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "时间复杂度：O(n)\n监视哨⽅法：\nint Search_Seq(SSTable ST, KeyType key) {\nST.R[0].key = key;  // 监视哨\nint i = ST.length;\nwhile(ST.R[i].key != key) i--;\nreturn i;\n}\n优点：查找成功时未⽐较元素 缺点：需要0号单元\n6.2 折半查找（⼆分查找）\n前提条件：\n1. 顺序存储结构\n2. 有序序列\n判定树：折半查找的过程可⽤⼆叉树描述\n时间复杂度：O(log₂n)\nint Search_Bin(SSTable ST, KeyType key) {\nint low = 1, high = ST.length;\nwhile(low <= high) {\nint mid = (low + high) / 2;\nif(ST.R[mid].key == key)\nreturn mid;\nelse if(ST.R[mid].key > key)\nhigh = mid - 1;\nelse\nlow = mid + 1;\n}\nreturn 0;\n}\n折半查找判定树\n性质：\n查找次数 = 结点所在层数\nASL ≈ log₂(n+1) - 1\n6.3 ⼆叉排序树（BST）\n定义：\n左⼦树 < 根 < 右⼦树\n左右⼦树均为BST\n查找：\nBSTNode* Search_BST(BSTree T, KeyType key) {\nif(T == NULL || T->data == key)\nreturn T;\nif(key < T->data)\nreturn Search_BST(T->lchild, key);\nelse\nreturn Search_BST(T->rchild, key);\n}\n时间复杂度：\n平均：O(log₂n)\n最坏（退化为链表）：O(n)\n6.4 散列查找（哈希表）\n哈希函数\n⽅法\n公式\n适⽤场景\n直接定址法\nH(key) = a×key + b\nkey分布均匀\n除留余数法\nH(key) = key % p\n通⽤\n数字分析法\n取key中分布均匀的位\nkey已知\n平⽅取中法\n取key²中间⼏位\nkey分布均匀\n冲突处理\n开放地址法：\n⽅法\n增量序列\n线性探测\ndi = 1,2,3,...,m-1\n⼆次探测\ndi = 1²,-1²,2²,-2²,...\n伪随机探测\ndi = 伪随机数序列\n拉链法：\n将同义词存储在同⼀个链表中\n适合插⼊删除频繁的场景\n装填因⼦\nα = n / m  (n为元素数，m为表长)\nα 越大，冲突越多\n平均查找⻓度\nASL成功 = 各元素查找次数之和 / 元素个数\nASL失败 = 各位置查找次数之和 / 地址个数\n\n**本节公式：**\n- $O(\\log n)$，需有序\n- 平均 $O(1)$\n- $\\alpha = n/m$（元素数/表长）",
          conceptsTable: [
            { item: "二分查找", content: "$O(\\log n)$，需有序" },
            { item: "哈希查找", content: "平均 $O(1)$" },
            { item: "装填因子", content: "$\\alpha = n/m$（元素数/表长）" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["查找"]
        },
      ]
    },
    {
      id: "ch7",
      name: "第7章 排序",
      questionTypes: [
        {
          id: "ch7-qt1",
          badge: "知识点",
          title: "排序算法总览",
          difficulty: "基础",
          examPattern: "选择/判断",
          knowledge: "题型实战——历年真题精选\n\n题型⼀：快速排序第⼀趟（必考）\n真题（2019-2020）： 序列(24, 19, 32, 43, 38, 6, 13, 22)，以第⼀个记录为枢轴，第⼀趟排序结果？\n答案：22 19 13 6 24 38 43 32\n解题要点：\n1. 基准数⼀直不变，直到找到最终位置\n2. 先从后往前找⼩于基准的，再从前往后找⼤于基准的\n3. 交替进⾏直到low==high\n\n题型⼆：哈希表构造（必考）\n真题（2018-2019）： H(key) = key % 13，线性探测再散列 插⼊：19, 1, 23, 14, 55, 2, 84, 27, 68, 11, 10, 78\n解题步骤：\nH(19) = 19 % 13 = 6 → 地址6\nH(1) = 1 % 13 = 1 → 地址1\nH(23) = 23 % 13 = 10 → 地址10\nH(14) = 14 % 13 = 1 → 地址1冲突，探查2 → 地址2\nH(55) = 55 % 13 = 3 → 地址3\nH(2) = 2 % 13 = 2 → 地址2冲突，探查3,4 → 地址4\nH(84) = 84 % 13 = 6 → 地址6冲突，探查7,8,9 → 地址8\nH(27) = 27 % 13 = 1 → 地址1冲突... → 地址5\n...\nASL计算：\n每个元素查找次数之和 / 元素个数\n\n**本节公式：**\n- $O(n^2)$，稳定(除选择)\n- 平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定\n- $O(n \\log n)$，稳定，$O(n)$ 空间\n- $O(n \\log n)$，不稳定，$O(1)$ 空间\n- $O(n^{1.3})$，不稳定",
          conceptsTable: [
            { item: "冒泡/插入/选择", content: "$O(n^2)$，稳定(除选择)" },
            { item: "快排", content: "平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定" },
            { item: "归并", content: "$O(n \\log n)$，稳定，$O(n)$ 空间" },
            { item: "堆排", content: "$O(n \\log n)$，不稳定，$O(1)$ 空间" },
            { item: "希尔", content: "$O(n^{1.3})$，不稳定" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["排序"]
        },
        {
          id: "ch7-qt2",
          badge: "题型3",
          title: "完全⼆叉树判断（算法设计）",
          difficulty: "中等",
          examPattern: "",
          knowledge: "\n\n**本节公式：**\n- $O(n^2)$，稳定(除选择)\n- 平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定\n- $O(n \\log n)$，稳定，$O(n)$ 空间\n- $O(n \\log n)$，不稳定，$O(1)$ 空间\n- $O(n^{1.3})$，不稳定",
          conceptsTable: [
            { item: "冒泡/插入/选择", content: "$O(n^2)$，稳定(除选择)" },
            { item: "快排", content: "平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定" },
            { item: "归并", content: "$O(n \\log n)$，稳定，$O(n)$ 空间" },
            { item: "堆排", content: "$O(n \\log n)$，不稳定，$O(1)$ 空间" },
            { item: "希尔", content: "$O(n^{1.3})$，不稳定" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["排序", "树"]
        },
        {
          id: "ch7-qt3",
          badge: "题型4",
          title: "⼆叉排序树判断（算法设计）",
          difficulty: "中等",
          examPattern: "",
          knowledge: "\n\n**本节公式：**\n- $O(n^2)$，稳定(除选择)\n- 平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定\n- $O(n \\log n)$，稳定，$O(n)$ 空间\n- $O(n \\log n)$，不稳定，$O(1)$ 空间\n- $O(n^{1.3})$，不稳定",
          conceptsTable: [
            { item: "冒泡/插入/选择", content: "$O(n^2)$，稳定(除选择)" },
            { item: "快排", content: "平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定" },
            { item: "归并", content: "$O(n \\log n)$，稳定，$O(n)$ 空间" },
            { item: "堆排", content: "$O(n \\log n)$，不稳定，$O(1)$ 空间" },
            { item: "希尔", content: "$O(n^{1.3})$，不稳定" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["排序", "树"]
        },
        {
          id: "ch7-qt4",
          badge: "题型5",
          title: "Prim算法求最⼩⽣成树（应⽤题）",
          difficulty: "中等",
          examPattern: "",
          knowledge: "\n\n**本节公式：**\n- $O(n^2)$，稳定(除选择)\n- 平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定\n- $O(n \\log n)$，稳定，$O(n)$ 空间\n- $O(n \\log n)$，不稳定，$O(1)$ 空间\n- $O(n^{1.3})$，不稳定",
          conceptsTable: [
            { item: "冒泡/插入/选择", content: "$O(n^2)$，稳定(除选择)" },
            { item: "快排", content: "平均 $O(n \\log n)$，最坏 $O(n^2)$，不稳定" },
            { item: "归并", content: "$O(n \\log n)$，稳定，$O(n)$ 空间" },
            { item: "堆排", content: "$O(n \\log n)$，不稳定，$O(1)$ 空间" },
            { item: "希尔", content: "$O(n^{1.3})$，不稳定" },
          ],
          examMethods: [],
          steps: [],
          tips: "",
          pitfalls: "",
          tags: ["排序", "树"]
        },
      ]
    },
  ]
};