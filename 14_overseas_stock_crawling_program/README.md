# Overseas Stock Crawling Program

Yahoo Finance 페이지의 `section.mainContent` 내부 테이블에서 주식 데이터를 크롤링하여 Excel 파일로 저장하는 예제입니다.

## 설치

```bash
pip install -r requirements.txt
```

## 실행

```bash
python crawl_yahoo_stocks.py
```

기본 저장 파일:

- `yahoo_most_active_stocks.xlsx`

옵션:

```bash
python crawl_yahoo_stocks.py --url "https://finance.yahoo.com/markets/stocks/most-active/" --output "result.xlsx"
```
