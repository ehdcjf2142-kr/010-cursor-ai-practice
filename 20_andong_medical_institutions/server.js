require("dotenv").config();
const path = require("path");
const express = require("express");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const app = express();
const PORT = process.env.PORT || 3000;

const ENDPOINT = "https://www.andong.go.kr/openapi/service/mediHsptService/getList";
const SAMPLE_HOSPITALS = [
  {
    name: "안동의원",
    address: "경상북도 안동시 퇴계로 100",
    phone: "054-000-1000",
    type: "의원",
  },
  {
    name: "안동치과의원",
    address: "경상북도 안동시 문화광장길 25",
    phone: "054-000-2000",
    type: "치과의원",
  },
  {
    name: "안동한의원",
    address: "경상북도 안동시 경동로 56",
    phone: "054-000-3000",
    type: "한의원",
  },
];

app.use(express.static(path.join(__dirname, "public")));

function normalizeToArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toText(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value[0] ?? "";
  return value;
}

function filterHospitals(hospitals, keyword) {
  if (!keyword) return hospitals;
  return hospitals.filter((hospital) =>
    [hospital.name, hospital.address, hospital.phone, hospital.type]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

app.get("/api/hospitals", async (req, res) => {
  const serviceKey = process.env.DATA_GO_KR_API_KEY;
  const pageNo = Number(req.query.pageNo || 1);
  const numOfRows = Number(req.query.numOfRows || 100);
  const keyword = String(req.query.keyword || "").trim().toLowerCase();

  if (!serviceKey) {
    return res.status(500).json({
      error: "DATA_GO_KR_API_KEY is missing. Please set it in .env",
    });
  }

  try {
    const response = await axios.get(ENDPOINT, {
      params: {
        ServiceKey: serviceKey,
        pageNo,
        numOfRows,
        _type: "json",
      },
      timeout: 10000,
    });

    const xmlParsed =
      typeof response.data === "string"
        ? await parseStringPromise(response.data, {
            explicitArray: false,
            trim: true,
          })
        : response.data;

    const header = xmlParsed?.response?.header;
    const body = xmlParsed?.response?.body;
    const resultMsg = toText(header?.resultMsg);

    if (resultMsg === "NO OPENAPI SERVICE ERROR.") {
      const filteredSample = filterHospitals(SAMPLE_HOSPITALS, keyword);
      return res.json({
        pageNo,
        numOfRows,
        totalCount: SAMPLE_HOSPITALS.length,
        count: filteredSample.length,
        hospitals: filteredSample,
        source: "sample",
        message:
          "OpenAPI 권한 반영 전이라 샘플 데이터를 표시합니다. 잠시 후 자동으로 실데이터가 표시됩니다.",
      });
    }

    const totalCount = Number(body?.totalCount || 0);
    const items = normalizeToArray(body?.items?.item);

    const hospitals = items.map((item) => ({
      name: toText(item?.mediTitle || item?.name),
      address: toText(item?.mediRoad || item?.mediAddr || item?.addr),
      phone: toText(item?.mediTel || item?.tel || item?.phone),
      type: toText(item?.mediGubun || item?.mediType || item?.instType),
    }));

    const filtered = filterHospitals(hospitals, keyword);

    return res.json({
      pageNo,
      numOfRows,
      totalCount,
      count: filtered.length,
      hospitals: filtered,
      source: "api",
    });
  } catch (error) {
    const filteredSample = filterHospitals(SAMPLE_HOSPITALS, keyword);
    return res.json({
      pageNo,
      numOfRows,
      totalCount: SAMPLE_HOSPITALS.length,
      count: filteredSample.length,
      hospitals: filteredSample,
      source: "sample",
      message:
        "API 연결이 잠시 불안정하여 샘플 데이터를 표시합니다. 잠시 후 다시 시도하면 실데이터로 전환됩니다.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
