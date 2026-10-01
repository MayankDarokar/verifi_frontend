"""Intent vs Mechanism Mismatch Card — Tier-1 Core Product Feature."""

import streamlit as st
from models.analysis_result import AnalysisResult


def render_mismatch_card(result: AnalysisResult):
    """
    Render the centerpiece comparison: What the message says vs what the payment mechanism does.
    """
    intent = result.intent
    mechanism = result.mechanism
    mismatch = result.mismatch

    card_class = "mismatch-hero-card" if mismatch.detected else "mismatch-matched-card"

    st.markdown("#### ⚡ Core Analysis: Intent vs Mechanism Verification")
    st.caption("VeriFi isolates the user's perceived intent from the technical payment payload.")

    col1, col_mid, col2 = st.columns([5, 1, 5])

    with col1:
        st.markdown(
            f"""
            <div class="comparison-box">
                <div class="comparison-title">💬 What the Message Claims</div>
                <div class="comparison-val-intent">{intent.label.replace('_', ' ')}</div>
                <div style="color: #cbd5e1; font-size: 0.9rem; margin-top: 0.5rem;">
                    {intent.summary}
                </div>
                {f'<div style="color: #38bdf8; font-weight: 700; margin-top: 0.5rem; font-size: 1.1rem;">Claimed: ₹{intent.stated_amount:,.0f}</div>' if intent.stated_amount else ''}
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col_mid:
        symbol = "≠" if mismatch.detected else "="
        color = "#ef4444" if mismatch.detected else "#10b981"
        st.markdown(
            f"""
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-size: 2.5rem;
                font-weight: 900;
                color: {color};
                padding-top: 1.5rem;
            ">
                {symbol}
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col2:
        mech_val_class = "comparison-val-mechanism" if mismatch.detected else "comparison-val-mechanism-clean"
        vpa_html = f'<div style="font-family: monospace; font-size: 0.85rem; color: #fca5a5; margin-top: 0.25rem;">UPI ID: {mechanism.target_upi_id}</div>' if mechanism.target_upi_id else ''
        st.markdown(
            f"""
            <div class="comparison-box">
                <div class="comparison-title">⚙️ What the Mechanism Executes</div>
                <div class="{mech_val_class}">{mechanism.label.replace('_', ' ')}</div>
                <div style="color: #cbd5e1; font-size: 0.9rem; margin-top: 0.5rem;">
                    {mechanism.summary}
                </div>
                {f'<div style="color: #f87171; font-weight: 700; margin-top: 0.5rem; font-size: 1.1rem;">Actual Debit: ₹{mechanism.actual_amount:,.0f}</div>' if mechanism.actual_amount else ''}
                {vpa_html}
            </div>
            """,
            unsafe_allow_html=True,
        )

    # Mismatch Banner
    if mismatch.detected:
        st.markdown(
            f"""
            <div class="mismatch-banner-critical">
                <span>🚨 INTENT–MECHANISM MISMATCH DETECTED</span>
            </div>
            <div style="background: rgba(239, 68, 68, 0.05); border-left: 3px solid #ef4444; padding: 0.75rem 1rem; margin-top: 0.5rem; color: #fca5a5; font-size: 0.9rem;">
                <b>Agent Finding:</b> {mismatch.explanation}
            </div>
            """,
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            f"""
            <div class="mismatch-banner-clean">
                <span>✓ INTENT AND PAYMENT MECHANISM ARE ALIGNED</span>
            </div>
            <div style="background: rgba(16, 185, 129, 0.05); border-left: 3px solid #10b981; padding: 0.75rem 1rem; margin-top: 0.5rem; color: #a7f3d0; font-size: 0.9rem;">
                <b>Agent Finding:</b> {mismatch.explanation}
            </div>
            """,
            unsafe_allow_html=True,
        )