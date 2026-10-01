"""Header component for VeriFi UI."""

import streamlit as st


def render_header():
    """Render the top-level VeriFi branding banner."""
    st.markdown(
        """
        <div class="verifi-header">
            <div class="verifi-badge-tag">Bharat Agentic 2026 • FinTech Safety</div>
            <div class="verifi-title">🛡️ VeriFi</div>
            <div class="verifi-subtitle">
                Evidence-Driven Financial Safety Agent for Digital Payments
            </div>
            <div class="verifi-quote">
                "Don't just ask whether a message looks suspicious. Check what the payment mechanism actually executes."
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )