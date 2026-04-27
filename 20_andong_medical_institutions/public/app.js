const statusText = document.getElementById("statusText");
const keywordInput = document.getElementById("keywordInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.getElementById("hospitalTableBody");

function renderRows(hospitals) {
  if (!hospitals.length) {
    tableBody.innerHTML =
      "<tr><td colspan='4'>표시할 의료기관 데이터가 없습니다.</td></tr>";
    return;
  }

  tableBody.innerHTML = hospitals
    .map(
      (h) => `
      <tr>
        <td>${h.name || "-"}</td>
        <td>${h.address || "-"}</td>
        <td>${h.phone || "-"}</td>
        <td>${h.type || "-"}</td>
      </tr>
    `
    )
    .join("");
}

async function loadHospitals(keyword = "") {
  try {
    statusText.textContent = "데이터를 불러오는 중...";

    const query = new URLSearchParams({
      pageNo: "1",
      numOfRows: "200",
      keyword,
    });

    const response = await fetch(`/api/hospitals?${query.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || data?.error || "API 요청 실패");
    }

    renderRows(data.hospitals || []);
    if (data.source === "sample") {
      statusText.textContent = `[샘플 모드] 총 ${data.count}건 표시 중 - ${data.message || ""}`;
    } else {
      statusText.textContent = `[실데이터] 총 ${data.count}건 표시 중`;
    }
  } catch (error) {
    tableBody.innerHTML = "<tr><td colspan='4'>데이터를 불러오지 못했습니다.</td></tr>";
    statusText.textContent =
      "서버가 꺼져 있거나 연결에 실패했습니다. '실행하기.bat'를 더블클릭한 뒤 3~5초 후 새로고침(F5) 해주세요.";
  }
}

searchBtn.addEventListener("click", () => {
  loadHospitals(keywordInput.value.trim());
});

resetBtn.addEventListener("click", () => {
  keywordInput.value = "";
  loadHospitals();
});

keywordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadHospitals(keywordInput.value.trim());
  }
});

loadHospitals();
