// 微观经济学 数据（提取自 PDF + 公式补充）

export const weijing = {
  id: "weijing",
  name: "微观经济学",
  icon: "📈",
  color: "#f59e0b",
  examTime: "7/2 上午",
  desc: "供求 · 消费者 · 生产者 · 市场结构 · 福利分析",
  chapters: [
    {
      id: "ch1",
      name: "专题1：供给与需求的基本原理",
      questionTypes: [
        {
          id: "ch1-qt1",
          badge: "专题1",
          title: "供给与需求的基本原理",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$\n- $X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$\n- $MRS = \\frac{MU_x}{MU_y}$\n- $P_x X + P_y Y = I$",
          conceptsTable: [
            { item: "消费者均衡", content: "$\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$" },
            { item: "Cobb-Douglas需求", content: "$X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$" },
            { item: "边际替代率", content: "$MRS = \\frac{MU_x}{MU_y}$" },
            { item: "预算约束", content: "$P_x X + P_y Y = I$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】均衡价格与数量 例题： 需求函数 QD = 100 - 0.5P，供给函数 QS = -50 + P，求均衡价格和数量。",
            "步骤： 1. 列均衡条件： 2. 代⼊函数： 3. 求解： 4. 代⼊求Q：",
            "【计算题】点弹性计算 例题： 需求函数 Q = 100 - 2P，求 P=20 时的点弹性。",
            "步骤： 1. 求导数： 2. 代⼊公式： 3. 取绝对值判断类型： ，缺乏弹性",
            "【计算题】征税影响 例题： 需求 Q_D = 1600 - 400P，供给 Q_S = -200 + 200P，征收 t=1 的从量税。",
            "步骤： 1. 建⽴⽅程组： 2. 求解：由前两式得 ， 3. 计算福利变化：分别计算 CS、PS、⽆谓损失 四、画图要点 供求均衡图 P |          S |         / |        / |       /    E (均衡点) |      /    / |     /    / |    /    / |   /    / |  /    / |/_____/_______ Q 关键要素： 纵轴：价格 P 横轴：数量 Q D 曲线：向右下倾斜 S 曲线：向右上倾斜 E 点：两曲线交点 弹性与收益关系图 TR |         /  (e>1, TR↑) |        / |       / |______/__________ Q (e<1, TR↓) 政府限价图 P |    P_max (最高限价)←---低于均衡价格 |   / S |  / | / E (均衡) |/_________ Q_s  Q_e    Q",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch2",
      name: "专题2：消费者⾏为理论",
      questionTypes: [
        {
          id: "ch2-qt1",
          badge: "专题2",
          title: "消费者⾏为理论",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$\n- $X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$\n- $MRS = \\frac{MU_x}{MU_y}$\n- $P_x X + P_y Y = I$",
          conceptsTable: [
            { item: "消费者均衡", content: "$\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$" },
            { item: "Cobb-Douglas需求", content: "$X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$" },
            { item: "边际替代率", content: "$MRS = \\frac{MU_x}{MU_y}$" },
            { item: "预算约束", content: "$P_x X + P_y Y = I$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】消费者均衡（拉格朗⽇法） 例题： 效⽤函数 ， ， ，收⼊ M = 120。求最优消费组合。",
            "步骤： 1. 构造拉格朗⽇函数： 2. 求⼀阶偏导并令其为0： 3. 求解： 4. 验证： ， ，相等 ✓",
            "【计算题】替代效应与收⼊效应 例题： ，初始 ， ， 。 下降到 1。",
            "步骤： 1. 初始均衡： 2. 新均衡（ ）： 3. 替代效应：维持原效⽤⽔平， ， 4. 收⼊效应： 四、画图要点 ⽆差异曲线与预算线 Y |     U₀ |    /   U₁ |   /  / |  / / | / / |/____________ X 切点E 关键要素： ⽆差异曲线：负斜率、凸向原点 预算线： 切点条件： 替代效应与收⼊效应分解 Y |     E₀      E_comp    E₁ |    /        /        / |   /  SE   /        / |  /       /       / | /       /      / |/______/_____/______ X 分解步骤： 1. 初始均衡 E₀ 2. 作补偿预算线（平⾏于新预算线，与原⽆差异曲线相切）→ E_comp 3. 新均衡 E₁ 4. SE：E₀ → E_comp 5. IE：E_comp → E₁ 完全替代/互补品 完全替代品          完全互补品 Y                   Y | /                 |     ┌── | /                 |    / |/                  |   / |________________ X  |  / | / |/____________ X",
          ],
          tips: "",
          pitfalls: "",
          tags: ["消费者剩余"]
        },
      ]
    },
    {
      id: "ch3",
      name: "专题3：企业⽣产理论",
      questionTypes: [
        {
          id: "ch3-qt1",
          badge: "专题3",
          title: "企业⽣产理论",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$\n- $X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$\n- $MRS = \\frac{MU_x}{MU_y}$\n- $P_x X + P_y Y = I$",
          conceptsTable: [
            { item: "消费者均衡", content: "$\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$" },
            { item: "Cobb-Douglas需求", content: "$X^* = \\frac{\\alpha I}{(\\alpha+\\beta)P_x}$" },
            { item: "边际替代率", content: "$MRS = \\frac{MU_x}{MU_y}$" },
            { item: "预算约束", content: "$P_x X + P_y Y = I$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】最优要素组合 例题： ⽣产函数 ， ， ， 。求最优L、K。",
            "步骤： 1. 由均衡条件： 2. 代⼊成本约束： 3. 验证： 四、画图要点 TP、AP、MP曲线 Q |      TP |     /  \\ |    /    \\    MP=0 |   /      \\__/ |  /   B |/A______________ L C(AP=MP)  E(MP=0) 关键要素： A点：TP的拐点，MP最⼤ C点：AP最⼤，AP=MP E点：TP最⼤，MP=0 等产量曲线与等成本线 K |     Q₀    Q₁ |    /     / |   /    / |  /   / | /  /  E (均衡) |/_/________ L 切点",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch4",
      name: "专题4：企业成本理论",
      questionTypes: [
        {
          id: "ch4-qt1",
          badge: "专题4",
          title: "企业成本理论",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $\\frac{MP_L}{w} = \\frac{MP_K}{r}$\n- $MC = \\frac{w}{MP_L}$\n- $MRTS = \\frac{w}{r}$",
          conceptsTable: [
            { item: "要素最优组合", content: "$\\frac{MP_L}{w} = \\frac{MP_K}{r}$" },
            { item: "边际成本", content: "$MC = \\frac{w}{MP_L}$" },
            { item: "成本最小化", content: "$MRTS = \\frac{w}{r}$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】短期成本函数推导 例题： 短期⽣产函数 ，⼯资率 ，固定成本 。",
            "步骤： 1. 求L关于Q的函数：由⽣产函数反解（复杂时⽤数值法） 2. 求TVC： 3. 求各类成本： 四、画图要点 短期成本曲线族 成本 |    AC |   / \\ |  /   \\  MC | /     \\ |/_______\\________ Q AVC",
          ],
          tips: "",
          pitfalls: "",
          tags: ["成本"]
        },
      ]
    },
    {
      id: "ch5",
      name: "专题5：完全竞争市场",
      questionTypes: [
        {
          id: "ch5-qt1",
          badge: "专题5",
          title: "完全竞争市场",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $P = MC$（$P \\ge AVC$）\n- $P = LMC = LAC_{\\min}$\n- $MR = MC$\n- $MR = a - 2bQ$（$D: P = a - bQ$）\n- $\\frac{P-MC}{P} = \\frac{1}{|E_d|}$\n- $MR_1 = MR_2 = MC$",
          conceptsTable: [
            { item: "完全竞争短期", content: "$P = MC$（$P \\ge AVC$）" },
            { item: "完全竞争长期", content: "$P = LMC = LAC_{\\min}$" },
            { item: "垄断均衡", content: "$MR = MC$" },
            { item: "垄断MR", content: "$MR = a - 2bQ$（$D: P = a - bQ$）" },
            { item: "勒纳指数", content: "$\\frac{P-MC}{P} = \\frac{1}{|E_d|}$" },
            { item: "古诺均衡", content: "$MR_1 = MR_2 = MC$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】完全竞争短期均衡 例题： ⼚商 TC = Q³ - 6Q² + 15Q + 10，P = 11。",
            "步骤： 1. 求MC： 2. 利润最⼤化条件： 3. ⼆阶条件： Q = 2 时： ✓ Q = 2/3 时： ✗ 4. 计算利润： 亏损但继续⽣产（因为P > AVC）",
            "【计算题】⻓期均衡 例题： 典型⼚商 ，⾏业需求 。",
            "步骤： 1. LAC最低点： 或 2. ⻓期均衡价格： 3. ⾏业⼚商数量： 四、画图要点 完全竞争⼚商短期均衡 P |    P=AR=MR=D | |         E |        / \\ |       /   \\  SMC |      /     \\ |     /       \\  SAC |    /         \\ |___/___________\\\\____ Q Q* 停⽌营业点 P |    P=AVC_min |   / |  /  MC | / |/____________ Q 完全竞争⻓期均衡 P |    P=LAC_min=LMC |   / |  / SMC=SAC | / |/____________ Q Q* (LAC最低点)",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch6",
      name: "专题6：政府政策的福利分析",
      questionTypes: [
        {
          id: "ch6-qt1",
          badge: "专题6",
          title: "政府政策的福利分析",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $DWL = \\frac{1}{2} \\times t \\times (Q^* - Q_t)$\n- $P_c - P_s = t$\n- $CS = \\int_0^Q [D(P) - P^*]\\, dQ$\n- $PS = P^* \\times Q - VC$",
          conceptsTable: [
            { item: "无谓损失", content: "$DWL = \\frac{1}{2} \\times t \\times (Q^* - Q_t)$" },
            { item: "税收归宿", content: "$P_c - P_s = t$" },
            { item: "消费者剩余", content: "$CS = \\int_0^Q [D(P) - P^*]\\, dQ$" },
            { item: "生产者剩余", content: "$PS = P^* \\times Q - VC$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】征税的福利分析 例题： ， ，征收 t = 10 的从量税。",
            "步骤： 1. 建⽴⽅程： 2. 求解： 3. 计算剩余变化： 征税前： 生产者承担 消费者承担 征税后： 变化： 等等，这计算有问题，让我重新算⼀下⽆谓损失的正确值 ⽆谓损失（正确计算）： 四、画图要点 最⾼限价 P |    P_min(限价) |   / |  / S | /   E(均衡) |/________________ Q Q_s  Q_e 征税 政府收入 税收收入 税收 无谓损失 实际上 P |    P_D |   /| |  / | | /  | t |/   | |    P_S |________________ Q Q*",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
    {
      id: "ch7",
      name: "专题7：完全垄断市场",
      questionTypes: [
        {
          id: "ch7-qt1",
          badge: "专题7",
          title: "完全垄断市场",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $P = MC$（$P \\ge AVC$）\n- $P = LMC = LAC_{\\min}$\n- $MR = MC$\n- $MR = a - 2bQ$（$D: P = a - bQ$）\n- $\\frac{P-MC}{P} = \\frac{1}{|E_d|}$\n- $MR_1 = MR_2 = MC$",
          conceptsTable: [
            { item: "完全竞争短期", content: "$P = MC$（$P \\ge AVC$）" },
            { item: "完全竞争长期", content: "$P = LMC = LAC_{\\min}$" },
            { item: "垄断均衡", content: "$MR = MC$" },
            { item: "垄断MR", content: "$MR = a - 2bQ$（$D: P = a - bQ$）" },
            { item: "勒纳指数", content: "$\\frac{P-MC}{P} = \\frac{1}{|E_d|}$" },
            { item: "古诺均衡", content: "$MR_1 = MR_2 = MC$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】垄断⼚商均衡 例题： 需求函数 ，TC = 50 + 20Q。",
            "步骤： 1. 求TR和MR： 2. 求MC： 3. 利润最⼤化： 4. 求P和利润： 四、画图要点 垄断⼚商均衡 P |    D=AR |   / |  /  MR | / / |/MR |  \\ |   \\   MC |    \\  (ATC) |     \\ |______\\_________ Q Q*    P*",
          ],
          tips: "",
          pitfalls: "",
          tags: ["垄断"]
        },
      ]
    },
    {
      id: "ch8",
      name: "专题8：有垄断势⼒的定价",
      questionTypes: [
        {
          id: "ch8-qt1",
          badge: "专题8",
          title: "有垄断势⼒的定价",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $P = MC$（$P \\ge AVC$）\n- $P = LMC = LAC_{\\min}$\n- $MR = MC$\n- $MR = a - 2bQ$（$D: P = a - bQ$）\n- $\\frac{P-MC}{P} = \\frac{1}{|E_d|}$\n- $MR_1 = MR_2 = MC$",
          conceptsTable: [
            { item: "完全竞争短期", content: "$P = MC$（$P \\ge AVC$）" },
            { item: "完全竞争长期", content: "$P = LMC = LAC_{\\min}$" },
            { item: "垄断均衡", content: "$MR = MC$" },
            { item: "垄断MR", content: "$MR = a - 2bQ$（$D: P = a - bQ$）" },
            { item: "勒纳指数", content: "$\\frac{P-MC}{P} = \\frac{1}{|E_d|}$" },
            { item: "古诺均衡", content: "$MR_1 = MR_2 = MC$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】三级价格歧视 例题： 两市场需求分别为 ， ， ， 。",
            "步骤： 1. 求各市场MR： 2. 求MC： 3. 均衡条件 ： 4. 求价格：",
          ],
          tips: "",
          pitfalls: "",
          tags: ["垄断"]
        },
      ]
    },
    {
      id: "ch9",
      name: "专题9：垄断竞争与寡头垄断市场",
      questionTypes: [
        {
          id: "ch9-qt1",
          badge: "专题9",
          title: "垄断竞争与寡头垄断市场",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $P = MC$（$P \\ge AVC$）\n- $P = LMC = LAC_{\\min}$\n- $MR = MC$\n- $MR = a - 2bQ$（$D: P = a - bQ$）\n- $\\frac{P-MC}{P} = \\frac{1}{|E_d|}$\n- $MR_1 = MR_2 = MC$",
          conceptsTable: [
            { item: "完全竞争短期", content: "$P = MC$（$P \\ge AVC$）" },
            { item: "完全竞争长期", content: "$P = LMC = LAC_{\\min}$" },
            { item: "垄断均衡", content: "$MR = MC$" },
            { item: "垄断MR", content: "$MR = a - 2bQ$（$D: P = a - bQ$）" },
            { item: "勒纳指数", content: "$\\frac{P-MC}{P} = \\frac{1}{|E_d|}$" },
            { item: "古诺均衡", content: "$MR_1 = MR_2 = MC$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】古诺均衡 例题： 市场需求 ， ， 。",
            "步骤： 1. ⼚商1利润最⼤化： 2. ⼚商2反应函数（对称）： 3. 联⽴求解： 4. 验证：",
            "【计算题】斯塔克伯格均衡 例题： 同上，⼚商1为领导者。",
            "步骤： 1. 追随者反应函数（同上）： 2. 领导者利润最⼤化： 3. 追随者产量： 4. 结果： 四、画图要点 古诺均衡 q₁ |    45 |   / |  /  q₁* = (90-q₂)/2 | / / |/____________ q₂ 22.5  45 (均衡点) 囚徒困境⽀付矩阵 B 坦白    不坦白 A 坦白 (-5,-5)  (-1,-10) 不坦白(-10,-1)  (-2,-2)",
          ],
          tips: "",
          pitfalls: "",
          tags: ["垄断"]
        },
      ]
    },
    {
      id: "ch10",
      name: "专题10：要素市场理论",
      questionTypes: [
        {
          id: "ch10-qt1",
          badge: "专题10",
          title: "要素市场理论",
          difficulty: "中等",
          examPattern: "选择/判断/计算/画图",
          knowledge: "\n\n**本节公式：**\n- $\\frac{MP_L}{w} = \\frac{MP_K}{r}$\n- $MC = \\frac{w}{MP_L}$\n- $MRTS = \\frac{w}{r}$",
          conceptsTable: [
            { item: "要素最优组合", content: "$\\frac{MP_L}{w} = \\frac{MP_K}{r}$" },
            { item: "边际成本", content: "$MC = \\frac{w}{MP_L}$" },
            { item: "成本最小化", content: "$MRTS = \\frac{w}{r}$" },
          ],
          examMethods: [],
          steps: [
            "【计算题】要素需求 例题： ⽣产函数 ，产品 ， ， ， 。",
            "步骤： 1. 求MP_L： 2. 求VMP： 3. 均衡条件 ： 4. 求产量： 四、画图要点 竞争性要素市场均衡 w |    S_L |   / |  / | /   E(均衡) |/____________ L L* 边际产品价值 P, MRP |    VMP=MP·P |   / |  /  MRP=MP·MR | / |/___________ L 经济租 要素收入 机会成本 附录：考场技巧 ⼀、选择题技巧 1. 弹性判断：优先使⽤弹性与收益的关系 2. 均衡条件：MR=MC 是核⼼ 3. 图形识别：熟悉各市场类型的均衡图形 4. 概念辨析：注意相近概念的区分 ⼆、判断题技巧 1. 说法绝对：出现\"⼀定\"\"必然\"需谨慎 2. 逆向思维：从特例⻆度找反例 3. 条件限定：注意前提条件 三、计算题格式 1. 写公式：先写公式再代⼊数字 2. 写过程：保留中间步骤 3. 写结论：最后明确给出答案 4. 单位检查：确保单位⼀致 四、画图题规范 1. 标清坐标轴：P、Q 或相应变量名 2. 标注曲线：D、S、MC 等 3. 标注均衡点：⽤字⺟ E 或 * 标注 4. 标注关键值：均衡价格、数量 5. 图例说明：必要时给出简短说明 常⻅公式速查表 弹性公式 消费者均衡（基数） 消费者均衡（序数） 垄断定价（拇指法则） 勒纳指数 完全竞争均衡 古诺均衡（双寡头） 要素使⽤原则 祝考试顺利！",
          ],
          tips: "",
          pitfalls: "",
          tags: ["通用"]
        },
      ]
    },
  ]
};