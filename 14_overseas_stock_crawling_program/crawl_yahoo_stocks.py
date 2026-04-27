import argparse
from pathlib import Path
from typing import List
from openpyxl import Workbook
import requests
from bs4 import BeautifulSoup


DEFAULT_URL = "https://finance.yahoo.com/markets/stocks/most-active/"
DEFAULT_OUTPUT = "yahoo_most_active_stocks.xlsx"


def extract_table_rows(html: str) -> List[List[str]]:
    soup = BeautifulSoup(html, "html.parser")

    # Match the section by stable class name only. Ignore random suffix classes.
    main_section = soup.find("section", class_=lambda classes: classes and "mainContent" in classes)
    if not main_section:
        raise ValueError("Could not find section with class including 'mainContent'.")

    table = main_section.find("table")
    if not table:
        raise ValueError("Could not find stock table inside the mainContent section.")

    headers = [th.get_text(strip=True) for th in table.select("thead th")]
    if not headers:
        raise ValueError("Could not find table headers.")

    rows: List[List[str]] = []
    for tr in table.select("tbody tr"):
        cells = [td.get_text(" ", strip=True) for td in tr.select("td")]
        if cells:
            rows.append(cells)

    if not rows:
        raise ValueError("Could not find table rows.")

    return [headers] + rows


def crawl_to_excel(url: str, output_path: Path) -> None:
    response = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
        timeout=20,
    )
    response.raise_for_status()

    table_data = extract_table_rows(response.text)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "stocks"

    for row in table_data:
        sheet.append(row)

    workbook.save(output_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Crawl Yahoo Finance stock table in mainContent section and export to Excel."
    )
    parser.add_argument("--url", default=DEFAULT_URL, help="Yahoo Finance URL to crawl.")
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT,
        help="Output Excel file path.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_path = Path(args.output).resolve()
    crawl_to_excel(args.url, output_path)
    print(f"Excel file saved: {output_path}")


if __name__ == "__main__":
    main()
