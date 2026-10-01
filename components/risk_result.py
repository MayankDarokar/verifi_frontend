import streamlit as st
from models.analysis_result import MockAnalysisResult


def render_risk_result(result: MockAnalysisResult):
    """Render the risk level and score card."""
    level = result.risk_level
    score = result.risk_score

    # Color mapping
    colors = {
        "CRITICAL": "#ef4444",
        "HIGH": "#f97316",
        "SUSPICIOUS": "#eab308",
        "NO_STRONG_INDICATORS": "#10b981",
    }
    color = colors.get(level, "#1e293b")

    bg = "#fee2e2" if level == "CRITICAL" else "#fef3c7" if level == "HIGH" else "#fef3c7" if level == "SUSPICIOUS" else "#d1fae5"
    border_color = "#f87171" if level == "CRITICAL" else "#f6ad56" if level == "HIGH" else "#fbbf24" if level == "SUSPICIOUS" else "#34d399"

    st.markdown(
        f"""
        <div style="
        background: {bg};
        border: 1px solid {border_color};
        border-radius: 0.75rem;
        padding: 1rem 1.25rem;
        margin: 1rem 0;
        text-align: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        ">
        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">
            ⚠ {level}
        </div>
        <div style="font-size: 2rem; font-weight: 700; color: {color}">
            {score} / 100
        </div>
    </div>
        """,
        unsafe_allow_html=True,
    )