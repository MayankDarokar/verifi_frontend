"""Risk Result Card Component for VeriFi."""

import streamlit as st
import textwrap
from models.analysis_result import AnalysisResult


def render_risk_card(result: AnalysisResult):
    """
    Render the deterministic risk level, numerical score, and indicator breakdown.
    Uses dedented HTML strings to prevent Markdown code block indentation bugs.
    """
    level = result.risk.level
    score = result.risk.score

    color_schemes = {
        "CRITICAL": {
            "border": "#ef4444",
            "bg": "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
            "text": "#f87171",
            "badge_bg": "#ef4444",
            "badge_color": "#ffffff",
            "icon": "🚨 CRITICAL RISK",
        },
        "HIGH": {
            "border": "#f97316",
            "bg": "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
            "text": "#fb923c",
            "badge_bg": "#f97316",
            "badge_color": "#ffffff",
            "icon": "⚠ HIGH RISK",
        },
        "SUSPICIOUS": {
            "border": "#f59e0b",
            "bg": "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
            "text": "#fbbf24",
            "badge_bg": "#f59e0b",
            "badge_color": "#000000",
            "icon": "⚡ SUSPICIOUS ACTIVITY",
        },
        "NO_STRONG_INDICATORS": {
            "border": "#10b981",
            "bg": "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
            "text": "#34d399",
            "badge_bg": "#10b981",
            "badge_color": "#ffffff",
            "icon": "✓ NO STRONG INDICATORS OF FRAUD",
        },
    }

    scheme = color_schemes.get(level, color_schemes["SUSPICIOUS"])

    # Build clean HTML without blank line + 4-space indentation issues
    html_content = textwrap.dedent(f"""
<div class="risk-card" style="background: {scheme['bg']}; border: 1px solid {scheme['border']};">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <span style="background: {scheme['badge_bg']}; color: {scheme['badge_color']}; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em;">
            {scheme['icon']}
        </span>
        <span style="color: #94a3b8; font-size: 0.85rem; font-weight: 600;">
            Evidence-Based Risk Assessment
        </span>
    </div>
    <div class="risk-score-num" style="color: {scheme['text']}; font-size: 3.2rem; font-weight: 900; line-height: 1; margin: 0.6rem 0;">
        {score} <span style="font-size: 1.4rem; color: #94a3b8; font-weight: 500;">/ 100</span>
    </div>
    <div style="color: #e2e8f0; font-size: 1.05rem; font-weight: 500; margin-top: 0.5rem; line-height: 1.4;">
        {result.explanation}
    </div>
</div>
""").strip()

    st.markdown(html_content, unsafe_allow_html=True)

    # Score breakdown expander
    if result.risk.score_breakdown:
        with st.expander("📊 View Risk Factors", expanded=False):
            for item in result.risk.score_breakdown:
                st.markdown(f"- **+{item.get('points', 0)} pts**: {item.get('signal', 'Unknown signal')}")
