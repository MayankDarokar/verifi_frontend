"""Action Plan & Recommendation Component for VeriFi."""

import streamlit as st
import textwrap
from models.analysis_result import ActionPlan


def render_recommendation(action_plan: ActionPlan):
    """
    Render the personalized action plan and official defensive guidance.
    """
    st.markdown("#### 🎯 Recommended Action Plan")

    box_html = textwrap.dedent(f"""
<div class="action-box">
    <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">
        🛡️ {action_plan.summary}
    </div>
</div>
""").strip()
    st.markdown(box_html, unsafe_allow_html=True)

    if action_plan.steps:
        st.markdown("**Next Steps Checklist:**")
        for i, step in enumerate(action_plan.steps, 1):
            st.markdown(f"{i}. {step}")

    if action_plan.helpline:
        st.markdown("<br/>", unsafe_allow_html=True)
        st.info(f"📞 **Official Help:** {action_plan.helpline}")