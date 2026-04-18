"""
Load gold_prices_latest100.xlsx and generate PNG chart images under charts/.
"""

from __future__ import annotations

import statistics
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from openpyxl import load_workbook

from excel_stats_report import SOURCE_XLSX, load_numeric_columns

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "charts"

# 한글 폰트 (Windows 기본 맑은 고딕)
plt.rcParams["font.family"] = "Malgun Gothic"
plt.rcParams["axes.unicode_minus"] = False


def short_labels(full: list[str]) -> list[str]:
    mapping = {
        "내가 살 때(3.75g) 순금 (원)": "순금·살 때",
        "내가 팔 때(3.75g) 순금 (원)": "순금·팔 때",
        "내가 팔 때(3.75g) 18K (원)": "18K",
        "내가 팔 때(3.75g) 14K (원)": "14K",
    }
    return [mapping.get(h, h[:12] + "…" if len(h) > 12 else h) for h in full]


def ensure_source() -> None:
    if not SOURCE_XLSX.is_file():
        raise SystemExit(f"원본 파일이 없습니다: {SOURCE_XLSX}")


def chart_timeseries(headers: list[str], columns: list[list[int]]) -> None:
    """고시 순번(최신=왼쪽)에 따른 가격 추이."""
    fig, ax = plt.subplots(figsize=(11, 5.5))
    idx = np.arange(1, len(columns[0]) + 1)
    labels = short_labels(headers)
    colors = ["#2e7d32", "#c62828", "#1565c0", "#6a1b9a"]
    for col, lab, c in zip(columns, labels, colors):
        ax.plot(idx, col, label=lab, linewidth=1.8, alpha=0.9, color=c)
    ax.set_xlabel("고시 순번 (1=가장 최근)")
    ax.set_ylabel("가격 (원)")
    ax.set_title("금 시세 추이 (최근 100건)")
    ax.legend(loc="upper right", fontsize=9)
    ax.grid(True, alpha=0.35)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_01_timeseries.png", dpi=150)
    plt.close(fig)


def chart_mean_bars(headers: list[str], columns: list[list[int]]) -> None:
    """항목별 평균 비교."""
    means = [statistics.mean(c) for c in columns]
    labels = short_labels(headers)
    fig, ax = plt.subplots(figsize=(9, 5))
    x = np.arange(len(labels))
    bars = ax.bar(x, means, color=["#43a047", "#e53935", "#1e88e5", "#8e24aa"], edgecolor="white")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=15, ha="right")
    ax.set_ylabel("평균 가격 (원)")
    ax.set_title("항목별 평균 시세")
    for b, m in zip(bars, means):
        ax.text(b.get_x() + b.get_width() / 2, m, f"{m:,.0f}", ha="center", va="bottom", fontsize=9)
    ax.grid(True, axis="y", alpha=0.35)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_02_mean_comparison.png", dpi=150)
    plt.close(fig)


def chart_min_max(headers: list[str], columns: list[list[int]]) -> None:
    """항목별 최소·최대 막대."""
    mins = [min(c) for c in columns]
    maxs = [max(c) for c in columns]
    labels = short_labels(headers)
    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(labels))
    w = 0.35
    ax.bar(x - w / 2, mins, w, label="최소", color="#90caf9", edgecolor="#1565c0")
    ax.bar(x + w / 2, maxs, w, label="최대", color="#ef9a9a", edgecolor="#c62828")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=15, ha="right")
    ax.set_ylabel("가격 (원)")
    ax.set_title("항목별 최소·최대 시세")
    ax.legend()
    ax.grid(True, axis="y", alpha=0.35)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_03_min_max.png", dpi=150)
    plt.close(fig)


def chart_boxplot(headers: list[str], columns: list[list[int]]) -> None:
    labels = short_labels(headers)
    fig, ax = plt.subplots(figsize=(9, 5.5))
    bp = ax.boxplot(columns, patch_artist=True)
    ax.set_xticklabels(labels, rotation=15, ha="right")
    colors = ["#c8e6c9", "#ffcdd2", "#bbdefb", "#e1bee7"]
    for patch, c in zip(bp["boxes"], colors):
        patch.set_facecolor(c)
    ax.set_ylabel("가격 (원)")
    ax.set_title("항목별 가격 분포 (상자그림)")
    ax.grid(True, axis="y", alpha=0.35)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_04_boxplot.png", dpi=150)
    plt.close(fig)


def chart_histograms(headers: list[str], columns: list[list[int]]) -> None:
    labels = short_labels(headers)
    fig, axes = plt.subplots(2, 2, figsize=(10, 9))
    axes = axes.flatten()
    colors = ["#43a047", "#e53935", "#1e88e5", "#8e24aa"]
    for ax, col, lab, c in zip(axes, columns, labels, colors):
        ax.hist(col, bins=18, color=c, edgecolor="white", alpha=0.85)
        ax.set_title(lab)
        ax.set_xlabel("가격 (원)")
        ax.set_ylabel("빈도")
        ax.grid(True, axis="y", alpha=0.35)
    fig.suptitle("항목별 가격 분포 (히스토그램)", fontsize=13, y=1.02)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_05_histograms.png", dpi=150)
    plt.close(fig)


def chart_scatter_buy_sell(columns: list[list[int]]) -> None:
    """순금 매입(s_pure) vs 순금 매도(p_pure) 산점도."""
    if len(columns) < 2:
        return
    buy, sell = columns[0], columns[1]
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.scatter(buy, sell, alpha=0.55, c="#5c6bc0", edgecolors="white", s=38)
    lo = min(min(buy), min(sell))
    hi = max(max(buy), max(sell))
    ax.plot([lo, hi], [lo, hi], "k--", alpha=0.25, label="y=x (참고)")
    ax.set_xlabel("순금·살 때 (원)")
    ax.set_ylabel("순금·팔 때 (원)")
    ax.set_title("순금 매입가 vs 매도가")
    ax.legend(loc="upper left")
    ax.grid(True, alpha=0.35)
    ax.set_aspect("equal", adjustable="datalim")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_06_scatter_buy_sell.png", dpi=150)
    plt.close(fig)


def chart_stats_radar(headers: list[str], columns: list[list[int]]) -> None:
    """
    정규화된 평균을 이용한 레이더(각 항목 상대 비교).
    원 단위가 달라도 형태만 비교하기 위해 0~1 스케일.
    """
    means = np.array([statistics.mean(c) for c in columns], dtype=float)
    mn, mx = means.min(), means.max()
    if mx - mn < 1e-9:
        normed = np.ones_like(means)
    else:
        normed = (means - mn) / (mx - mn)
    labels = short_labels(headers)
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False)
    normed = np.concatenate((normed, [normed[0]]))
    angles = np.concatenate((angles, [angles[0]]))

    fig, ax = plt.subplots(figsize=(7, 7), subplot_kw=dict(projection="polar"))
    ax.plot(angles, normed, "o-", linewidth=2, color="#00897b")
    ax.fill(angles, normed, alpha=0.22, color="#00897b")
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    ax.set_title("항목별 평균 상대 비교 (정규화)", y=1.08)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "viz_07_radar_normalized.png", dpi=150)
    plt.close(fig)


def main() -> None:
    ensure_source()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    wb = load_workbook(SOURCE_XLSX, data_only=True)
    ws = wb.active
    headers, columns = load_numeric_columns(ws)

    if not columns or not columns[0]:
        raise SystemExit("가격 데이터가 비어 있습니다.")

    chart_timeseries(headers, columns)
    chart_mean_bars(headers, columns)
    chart_min_max(headers, columns)
    chart_boxplot(headers, columns)
    chart_histograms(headers, columns)
    chart_scatter_buy_sell(columns)
    chart_stats_radar(headers, columns)

    print(f"PNG 이미지 저장 위치: {OUT_DIR}")
    for p in sorted(OUT_DIR.glob("viz_*.png")):
        print(f"  - {p.name}")


if __name__ == "__main__":
    main()
