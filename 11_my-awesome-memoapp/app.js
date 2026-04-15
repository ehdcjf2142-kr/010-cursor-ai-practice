const memoInput = document.getElementById("memoInput");
const addMemoBtn = document.getElementById("addMemoBtn");
const memoList = document.getElementById("memoList");
const memoCount = document.getElementById("memoCount");
const memoComposerSection = document.getElementById("memoComposerSection");
const memoListSection = document.getElementById("memoListSection");
const authStatus = document.getElementById("authStatus");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetSearchBtn = document.getElementById("resetSearchBtn");
const openDevModeBtn = document.getElementById("openDevModeBtn");
const devModeSection = document.getElementById("devModeSection");
const devStatus = document.getElementById("devStatus");
const devIdInput = document.getElementById("devIdInput");
const devPasswordInput = document.getElementById("devPasswordInput");
const devLoginBtn = document.getElementById("devLoginBtn");
const devLogoutBtn = document.getElementById("devLogoutBtn");
const refreshDevDataBtn = document.getElementById("refreshDevDataBtn");
const devData = document.getElementById("devData");

let memos = [];
let devMode = false;
let currentQuery = "";

function renderMemos() {
  memoList.innerHTML = "";

  if (memos.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-message";
    emptyItem.textContent = "아직 메모가 없어요. 첫 메모를 추가해보세요!";
    memoList.appendChild(emptyItem);
    memoCount.textContent = "0개";
    return;
  }

  memos.forEach((memo) => {
    const item = document.createElement("li");
    item.className = "memo-item";

    const memoText = document.createElement("p");
    memoText.textContent = memo.content;

    const actionWrap = document.createElement("div");
    actionWrap.className = "memo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", async () => {
      const edited = window.prompt("수정할 내용을 입력하세요.", memo.content);
      if (edited === null) return;
      await updateMemo(memo.id, edited);
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "삭제";
    removeBtn.addEventListener("click", async () => {
      await deleteMemo(memo.id);
    });

    actionWrap.appendChild(editBtn);
    actionWrap.appendChild(removeBtn);
    item.appendChild(memoText);
    item.appendChild(actionWrap);
    memoList.appendChild(item);
  });

  memoCount.textContent = `${memos.length}개`;
}

function setAuthUi(authenticated, email = "") {
  memoComposerSection.classList.toggle("hidden", !authenticated);
  memoListSection.classList.toggle("hidden", !authenticated);
  authStatus.textContent = authenticated
    ? `${email} 계정으로 로그인되었습니다.`
    : "로그인이 필요합니다.";
}

function getCredentials() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };
}

async function postAuth(url) {
  const payload = getCredentials();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data;
}

async function checkSession() {
  const response = await fetch("/api/session");
  const data = await response.json();
  devMode = !!data.devMode;
  setDevModeUi(devMode);
  if (data.authenticated) {
    setAuthUi(true, data.user.email);
    await fetchMemos();
    return;
  }
  setAuthUi(false);
  memos = [];
  renderMemos();
}

async function signup() {
  try {
    const data = await postAuth("/api/signup");
    setAuthUi(true, data.user.email);
    passwordInput.value = "";
    authStatus.textContent = "회원가입 및 자동 로그인이 완료되었습니다.";
    await fetchMemos();
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function login() {
  try {
    const data = await postAuth("/api/login");
    setAuthUi(true, data.user.email);
    passwordInput.value = "";
    authStatus.textContent = "로그인에 성공했습니다.";
    await fetchMemos();
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  setAuthUi(false);
  memos = [];
  renderMemos();
}

async function fetchMemos(query = "") {
  const response = await fetch(`/api/memos?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (!response.ok) {
    authStatus.textContent = data.message || "메모를 불러오지 못했습니다.";
    return;
  }
  memos = data.memos;
  renderMemos();
}

async function addMemo() {
  const text = memoInput.value.trim();
  if (!text) {
    memoInput.focus();
    return;
  }

  const response = await fetch("/api/memos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text }),
  });
  const data = await response.json();
  if (!response.ok) {
    authStatus.textContent = data.message || "메모 저장에 실패했습니다.";
    return;
  }

  memos.unshift(data.memo);
  memoInput.value = "";
  memoInput.focus();
  renderMemos();
}

async function updateMemo(id, content) {
  const trimmed = String(content || "").trim();
  if (!trimmed) return;

  const response = await fetch(`/api/memos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: trimmed }),
  });
  const data = await response.json();
  if (!response.ok) {
    authStatus.textContent = data.message || "메모 수정에 실패했습니다.";
    return;
  }
  memos = memos.map((memo) => (memo.id === id ? data.memo : memo));
  renderMemos();
}

async function deleteMemo(id) {
  const response = await fetch(`/api/memos/${id}`, { method: "DELETE" });
  const data = await response.json();
  if (!response.ok) {
    authStatus.textContent = data.message || "메모 삭제에 실패했습니다.";
    return;
  }
  memos = memos.filter((memo) => memo.id !== id);
  renderMemos();
}

function renderDevData(users = []) {
  if (!users.length) {
    devData.innerHTML = "<p>조회할 회원 데이터가 없습니다.</p>";
    return;
  }

  devData.innerHTML = users
    .map((user) => {
      const memoListHtml = user.memos.length
        ? user.memos.map((memo) => `<li>${memo.content}</li>`).join("")
        : "<li>메모 없음</li>";
      return `
        <div class="dev-user">
          <p><strong>회원 ID:</strong> ${user.id}</p>
          <p><strong>이메일:</strong> ${user.email}</p>
          <p><strong>비밀번호(해시):</strong> ${user.passwordHash}</p>
          <p><strong>메모 목록:</strong></p>
          <ul>${memoListHtml}</ul>
        </div>
      `;
    })
    .join("");
}

function setDevModeUi(enabled) {
  devModeSection.classList.toggle("hidden", !enabled);
  if (!enabled) {
    devData.innerHTML = "";
  }
}

async function activateDevMode() {
  const response = await fetch("/api/dev/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      developerId: devIdInput.value.trim(),
      developerPassword: devPasswordInput.value,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    devStatus.textContent = data.message || "개발자모드 인증에 실패했습니다.";
    return;
  }
  devMode = true;
  setDevModeUi(true);
  devStatus.textContent = data.message;
  await refreshDevDashboard();
}

async function refreshDevDashboard() {
  const response = await fetch("/api/dev/dashboard");
  const data = await response.json();
  if (!response.ok) {
    devStatus.textContent = data.message || "개발자 데이터를 가져오지 못했습니다.";
    return;
  }
  devStatus.textContent = data.note;
  renderDevData(data.users);
}

async function deactivateDevMode() {
  await fetch("/api/dev/logout", { method: "POST" });
  devMode = false;
  setDevModeUi(false);
  devStatus.textContent =
    "개발자 인증을 진행하면 회원 정보와 메모를 확인할 수 있습니다.";
}

addMemoBtn.addEventListener("click", addMemo);
memoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addMemo();
  }
});
searchBtn.addEventListener("click", async () => {
  currentQuery = searchInput.value.trim();
  await fetchMemos(currentQuery);
});
resetSearchBtn.addEventListener("click", async () => {
  searchInput.value = "";
  currentQuery = "";
  await fetchMemos("");
});
signupBtn.addEventListener("click", signup);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
openDevModeBtn.addEventListener("click", () => {
  devModeSection.classList.toggle("hidden");
});
devLoginBtn.addEventListener("click", activateDevMode);
refreshDevDataBtn.addEventListener("click", refreshDevDashboard);
devLogoutBtn.addEventListener("click", deactivateDevMode);

renderMemos();
checkSession();
