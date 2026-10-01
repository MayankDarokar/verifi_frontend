"""Agent Decision Trace Component for VeriFi."""

import streamlit as st
from typing import List
from models.analysis_result import TraceEvent


def render_decision_trace(trace: List[TraceEvent]):
    """
    Render the Agent Decision Trace.
    Shows observable actions taken by the autonomous agent without exposing raw CoT.
    """
    st.markdown("#### 🧠 Agent Decision Trace")
    st.caption("Observable trail of autonomous investigation steps and tool executions:")

    if not trace:
        st.caption("No trace events recorded.")
        return

    icon_map = {
        "done": ("✓", "#10b981", ""),
        "warning": ("⚠", "#ef4444", "trace-item-warning"),
        "action": ("→", "#6366f1", "trace-item-action"),
        "pending": ("○", "#94a3b8", ""),
    }

    for event in trace:
        icon, icon_color, extra_class = icon_map.get(event.status, ("✓", "#10b981", ""))
        detail_html = f'<div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.2rem;">{event.detail}</div>' if event.detail else ''

        st.markdown(
            f"""
            <div class="trace-item {extra_class}">
                <div style="font-weight: 800; font-family: monospace; color: #64748b; min-width: 2rem;">
                    {event.step_number:02d}
                </div>
                <div style="color: {icon_color}; font-weight: 900; font-size: 1.1rem; line-height: 1;">
                    {icon}
                </div>
                <div style="flex-grow: 1;">
                    <div style="color: #f1f5f9; font-size: 0.9rem; font-weight: 600;">
                        {event.title}
                    </div>
                    {detail_html}
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )