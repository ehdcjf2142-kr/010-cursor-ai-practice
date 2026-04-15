require("dotenv/config");
const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const DEV_MODE_ID = "ehdcjf2142";
const DEV_MODE_PASSWORD = "1q2w3e4r";

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.get("/api/session", (req, res) => {
  if (!req.session.userId || !req.session.email) {
    return res.json({ authenticated: false, devMode: !!req.session.devMode });
  }

  return res.json({
    authenticated: true,
    devMode: !!req.session.devMode,
    user: { id: req.session.userId, email: req.session.email },
  });
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !password || password.length < 6) {
    return res.status(400).json({
      message: "이메일과 6자 이상 비밀번호를 입력해주세요.",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, passwordHash },
    });

    req.session.userId = user.id;
    req.session.email = user.email;

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다." });
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    return res.json({
      message: "로그인 성공",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "로그인 중 오류가 발생했습니다." });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "로그아웃에 실패했습니다." });
    }
    return res.clearCookie("connect.sid").json({ message: "로그아웃 되었습니다." });
  });
});

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  return next();
}

app.get("/api/memos", requireAuth, async (req, res) => {
  const query = String(req.query.query || "").trim();
  const likeValue = `%${query}%`;
  const memos = await prisma.$queryRawUnsafe(
    "SELECT id, content, createdAt, updatedAt, userId FROM Memo WHERE userId = ? AND content LIKE ? ORDER BY updatedAt DESC",
    req.session.userId,
    likeValue,
  );
  return res.json({ memos });
});

app.post("/api/memos", requireAuth, async (req, res) => {
  const content = String(req.body?.content || "").trim();
  if (!content) {
    return res.status(400).json({ message: "메모 내용을 입력해주세요." });
  }

  await prisma.$executeRawUnsafe(
    "INSERT INTO Memo (content, userId, createdAt, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
    content,
    req.session.userId,
  );
  const newestRows = await prisma.$queryRawUnsafe(
    "SELECT id, content, createdAt, updatedAt, userId FROM Memo WHERE userId = ? ORDER BY id DESC LIMIT 1",
    req.session.userId,
  );
  const memo = newestRows[0];
  return res.status(201).json({ memo });
});

app.put("/api/memos/:id", requireAuth, async (req, res) => {
  const memoId = Number(req.params.id);
  const content = String(req.body?.content || "").trim();
  if (!Number.isInteger(memoId) || !content) {
    return res.status(400).json({ message: "수정할 메모 정보를 확인해주세요." });
  }

  const updatedCount = await prisma.$executeRawUnsafe(
    "UPDATE Memo SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?",
    content,
    memoId,
    req.session.userId,
  );
  if (updatedCount === 0) {
    return res.status(404).json({ message: "메모를 찾을 수 없습니다." });
  }

  const rows = await prisma.$queryRawUnsafe(
    "SELECT id, content, createdAt, updatedAt, userId FROM Memo WHERE id = ? LIMIT 1",
    memoId,
  );
  return res.json({ memo: rows[0] });
});

app.delete("/api/memos/:id", requireAuth, async (req, res) => {
  const memoId = Number(req.params.id);
  if (!Number.isInteger(memoId)) {
    return res.status(400).json({ message: "삭제할 메모 ID가 올바르지 않습니다." });
  }

  const deletedCount = await prisma.$executeRawUnsafe(
    "DELETE FROM Memo WHERE id = ? AND userId = ?",
    memoId,
    req.session.userId,
  );
  if (deletedCount === 0) {
    return res.status(404).json({ message: "메모를 찾을 수 없습니다." });
  }

  return res.json({ message: "메모가 삭제되었습니다." });
});

app.post("/api/dev/login", (req, res) => {
  const { developerId, developerPassword } = req.body || {};
  if (developerId === DEV_MODE_ID && developerPassword === DEV_MODE_PASSWORD) {
    req.session.devMode = true;
    return res.json({ message: "개발자모드가 활성화되었습니다." });
  }
  return res.status(401).json({ message: "개발자모드 인증 정보가 올바르지 않습니다." });
});

app.post("/api/dev/logout", (req, res) => {
  req.session.devMode = false;
  return res.json({ message: "개발자모드가 비활성화되었습니다." });
});

app.get("/api/dev/dashboard", async (req, res) => {
  if (!req.session.devMode) {
    return res.status(403).json({ message: "개발자모드 권한이 필요합니다." });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, passwordHash: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const allMemos = await prisma.$queryRawUnsafe(
    "SELECT id, content, createdAt, updatedAt, userId FROM Memo ORDER BY updatedAt DESC",
  );
  const memosByUser = new Map();
  for (const memo of allMemos) {
    const bucket = memosByUser.get(memo.userId) || [];
    bucket.push(memo);
    memosByUser.set(memo.userId, bucket);
  }
  const dashboardUsers = users.map((user) => ({
    ...user,
    memos: memosByUser.get(user.id) || [],
  }));

  return res.json({
    users: dashboardUsers,
    note: "비밀번호 원문은 저장되지 않아 조회할 수 없고, 해시 값만 확인 가능합니다.",
  });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Memo app server running on http://localhost:${PORT}`);
});
