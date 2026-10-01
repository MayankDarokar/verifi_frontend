"""Investigation Decision Trace Component for VeriFi."""

import streamlit as st
import textwrap
from typing import List
from models.analysis_result import TraceEvent


def render_decision_trace(trace: List[TraceEvent]):
    """
    Render the Investigation Steps.
    Shows observable actions taken by the investigation agent without exposing raw debug logs.
    """
    st.markdown("#### 🧠 How VeriFi Reached This Result")
    st.caption("Key investigation steps used to evaluate this interaction:")

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

        trace_html = textwrap.dedent(f"""
<div class="trace-item {extra_class}" style="background: #1e293b; border-radius: 0 0.5rem 0.5rem 0; padding: 0.75rem 1rem; margin-bottom: 0.5rem; display: flex; align-items: flex-start; gap: 0.75rem;">
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
""").strip()
        st.markdown(trace_html, unsafe_allow_html=True)