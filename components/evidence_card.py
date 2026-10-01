"""Evidence Presentation Component for VeriFi."""

import streamlit as st
import textwrap
from typing import List
from models.analysis_result import EvidenceItem


def render_evidence_card(evidence: List[EvidenceItem]):
    """
    Render verifiable factual evidence items grouped by category.
    Clearly separates verifiable facts from subjective speculation.
    """
    st.markdown("#### 🔍 Discovered Evidence & Signals")
    st.caption("Factual technical artifacts discovered during agent investigation:")

    if not evidence:
        st.info("No anomalous technical evidence detected in this interaction.")
        return

    # Group items by category
    categories = {}
    for item in evidence:
        cat = item.category or "General Evidence"
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(item)

    for cat_name, items in categories.items():
        st.markdown(f"**{cat_name}**")
        for item in items:
            severity_colors = {
                "CRITICAL": "#ef4444",
                "HIGH": "#f97316",
                "SUSPICIOUS": "#f59e0b",
                "INFO": "#38bdf8",
            }
            border_col = severity_colors.get(item.severity, "#38bdf8")

            box_html = textwrap.dedent(f"""
<div class="evidence-box" style="border-left: 3px solid {border_col}; margin-bottom: 0.5rem; background: #1e293b; border-radius: 0.5rem; padding: 0.75rem 1rem;">
    <div style="font-weight: 700; color: #f1f5f9; font-size: 0.95rem;">
        {item.title}
    </div>
    <div style="color: #cbd5e1; font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.35;">
        {item.detail}
    </div>
</div>
""").strip()
            st.markdown(box_html, unsafe_allow_html=True)
