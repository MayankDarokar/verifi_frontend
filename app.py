"""VeriFi — Evidence-Driven Financial Safety Agent.

Main Streamlit Application Shell.
"""

import os
import streamlit as st

# 1. Page Configuration MUST be the first Streamlit command
st.set_page_config(
    page_title="VeriFi — Financial Safety Agent",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# 2. Load custom CSS
css_path = os.path.join(os.path.dirname(__file__), "styles", "main.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# 3. Component and Service Imports
from components.header import render_header
from components.sidebar import render_sidebar
from components.input_panel import render_input_panel
from components.risk_card import render_risk_card
from components.mismatch_card import render_mismatch_card
from components.evidence_card import render_evidence_card
from components.decision_trace import render_decision_trace
from components.recommendation import render_recommendation
from components.incident_view import render_incident_view

from services.analysis_service import analysis_service
from models.analysis_result import AnalysisResult
from utils.validators import validate_text_input, validate_url, validate_qr_image


def main():
    # Render Sidebar and get navigation state
    active_mode, selected_language, selected_scenario = render_sidebar()

    # Render Header Banner
    render_header()

    if "Analyze" in active_mode:
        # Check if user selected a quick scenario from sidebar
        if selected_scenario and "last_scenario" not in st.session_state:
            st.session_state["last_scenario"] = selected_scenario

        input_type, user_payload, submit_clicked = render_input_panel(preset_scenario=selected_scenario)

        # Trigger analysis if button clicked OR a demo scenario is explicitly selected
        should_run = submit_clicked or (selected_scenario is not None and st.session_state.get("last_run_scenario") != selected_scenario)

        if should_run:
            st.session_state["last_run_scenario"] = selected_scenario
            
            # Input validation
            valid = True
            raw_input_str = ""

            if input_type == "text":
                if isinstance(user_payload, str) and validate_text_input(user_payload):
                    raw_input_str = user_payload
                elif selected_scenario:
                    raw_input_str = "Demo scenario payload"
                else:
                    st.error("Please enter a message of at least 3 characters.")
                    valid = False

            elif input_type == "url":
                if isinstance(user_payload, str) and validate_url(user_payload):
                    raw_input_str = user_payload
                elif selected_scenario:
                    raw_input_str = "https://demo-url.xyz"
                else:
                    st.error("Please enter a valid URL (e.g., https://example.com).")
                    valid = False

            elif input_type == "qr":
                if isinstance(user_payload, dict) and "filename" in user_payload:
                    raw_input_str = f"QR image: {user_payload['filename']}"
                elif selected_scenario:
                    raw_input_str = "QR image upload"
                else:
                    st.error("Please upload a valid QR image file.")
                    valid = False

            if valid:
                with st.spinner("🔎 VeriFi Agent is investigating payment mechanism & evidence..."):
                    result: AnalysisResult = analysis_service.run_analysis(
                        user_input=raw_input_str,
                        input_type=input_type,
                        language=selected_language,
                        scenario_key=selected_scenario,
                    )

                st.markdown("---")
                st.markdown("### 📊 Investigation Results")

                # 1. Deterministic Risk Hero Card
                render_risk_card(result)

                # 2. Centerpiece: Intent vs Mechanism Mismatch (Tier-1 Killer Feature)
                render_mismatch_card(result)

                # Two column layout for Evidence + Decision Trace
                col_left, col_right = st.columns([1, 1])

                with col_left:
                    # 3. Discovered Technical Evidence
                    render_evidence_card(result.evidence)

                with col_right:
                    # 4. Observable Agent Decision Trace
                    render_decision_trace(result.trace)

                # 5. Actionable Guidance & Defense Plan
                st.markdown("---")
                render_recommendation(result.action_plan)

    elif "Scammed" in active_mode:
        # Render Incident Response Workflow
        render_incident_view()

    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style="text-align: center; color: #64748b; font-size: 0.8rem; padding: 1rem 0;">
            ⚠ <b>VeriFi</b> is an evidence-driven financial safety system. 
            Risk scores are deterministic assessments based on observable indicators. 
            Always verify unexpected financial requests with official financial institutions.
        </div>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()