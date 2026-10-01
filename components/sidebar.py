"""Sidebar navigation and demo controls for VeriFi."""

import streamlit as st
from typing import Tuple, Optional


def render_sidebar() -> Tuple[str, str, Optional[str]]:
    """
    Render sidebar navigation, language switcher, and demo quick-picker.

    Returns:
        Tuple of (active_mode, selected_language, selected_demo_scenario)
    """
    with st.sidebar:
        st.markdown("### 🛡️ **VeriFi Hub**")
        st.caption("AI-Powered Financial Defense")
        st.markdown("---")

        # Primary Navigation Mode
        mode = st.radio(
            "Select Workflow:",
            ["🔍 Analyze Suspicious Content", "🚨 I've Already Been Scammed"],
            index=0,
            key="nav_workflow_mode",
        )

        st.markdown("---")

        # Tier-2 Language Support
        st.markdown("##### 🌐 Language / भाषा")
        language = st.selectbox(
            "Select Language:",
            ["English", "Hinglish (Hindi + English)", "Hindi (हिंदी)"],
            index=0,
            key="nav_language",
        )

        st.markdown("---")

        # Demo Scenario Quick Loader for Judges
        st.markdown("##### ⚡ Quick Demo Scenarios")
        st.caption("Load verified test cases across all 4 risk tiers:")

        scenario_choice = st.selectbox(
            "Choose Scenario:",
            [
                "Custom User Input",
                "CRITICAL: Cashback QR Mismatch",
                "HIGH: Electricity Disconnection Scam",
                "SUSPICIOUS: Unverified Prize URL",
                "NO_STRONG_INDICATORS: Clean Receipt",
            ],
            index=0,
            key="demo_scenario_choice",
        )

        scenario_key_map = {
            "CRITICAL: Cashback QR Mismatch": "cashback_qr_mismatch",
            "HIGH: Electricity Disconnection Scam": "electricity_bill_scam",
            "SUSPICIOUS: Unverified Prize URL": "lottery_prize_url",
            "NO_STRONG_INDICATORS: Clean Receipt": "legitimate_merchant_receipt",
        }
        selected_scenario = scenario_key_map.get(scenario_choice, None)

        st.markdown("---")
        st.markdown(
            """
            <div style="font-size: 0.8rem; color: #94a3b8;">
                <b>Core Principle:</b><br/>
                Intent → Mechanism → Evidence → Risk → Action
            </div>
            """,
            unsafe_allow_html=True,
        )

    return mode, language, selected_scenario
