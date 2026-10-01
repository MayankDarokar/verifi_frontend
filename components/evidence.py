import streamlit as st
from models.analysis_result import EvidenceItem


def render_evidence(evidence: list[EvidenceItem]):
    """Render the evidence section with bullet items."""
    if not evidence:
        st.caption("No additional evidence detected.")
        return

    st.markdown("**Evidence**")
    for item in evidence:
        st.markdown(f"- **{item.title}**: {item.detail}")