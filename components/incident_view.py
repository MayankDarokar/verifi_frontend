"""Incident Mode Component for VeriFi: 'I've Already Been Scammed'."""

import streamlit as st
import textwrap
from datetime import datetime


def render_incident_view():
    """
    Render the guided incident response interview and emergency response plan.
    Provides immediate emergency triage for victims of financial fraud.
    """
    st.markdown("### 🚨 Emergency Incident Response")
    
    banner_html = textwrap.dedent("""
<div style="background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 0.75rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
    <b style="color: #fca5a5; font-size: 1.05rem;">Immediate Golden-Hour Protection:</b><br/>
    <span style="color: #cbd5e1; font-size: 0.9rem;">
        If money was debited within the last 0 to 2 hours, immediate notification to your bank and <b>1930</b> can freeze the recipient account before funds are laundered.
    </span>
</div>
""").strip()
    st.markdown(banner_html, unsafe_allow_html=True)

    st.markdown("#### Step 1: Tell Us What Happened")

    col1, col2 = st.columns(2)
    with col1:
        bank_selection = st.selectbox(
            "Your Bank / Payment App:",
            [
                "State Bank of India (SBI)",
                "HDFC Bank",
                "ICICI Bank",
                "Axis Bank",
                "Punjab National Bank",
                "Paytm Payments Bank",
                "PhonePe / GPay (UPI)",
                "Other",
            ],
            index=0,
            key="incident_bank_select",
        )

        # Dynamic Custom Institution Field when 'Other' is selected
        effective_bank_name = bank_selection
        if bank_selection == "Other":
            custom_bank = st.text_input(
                "Specify Bank / Payment App *",
                value=st.session_state.get("incident_custom_bank_val", ""),
                placeholder="e.g., Canara Bank, Bank of Baroda, Google Pay, Amazon Pay",
                help="Enter the exact institution or digital wallet where the transaction occurred.",
                key="incident_custom_bank_input",
            )
            st.session_state["incident_custom_bank_val"] = custom_bank
            effective_bank_name = custom_bank.strip()
        else:
            # Clean up custom bank state when switched away from 'Other'
            st.session_state["incident_custom_bank_val"] = ""

        amount_lost = st.number_input(
            "Approximate Amount Lost (₹):",
            min_value=1.0,
            value=10000.0,
            step=500.0,
            key="incident_amount_input",
        )

    with col2:
        utr_number = st.text_input(
            "Transaction ID / UPI Ref / UTR (if available):",
            placeholder="e.g. 427819203810",
            help="Found in your bank SMS or UPI payment history.",
            key="incident_utr_input",
        )
        incident_time = st.selectbox(
            "When did this happen?",
            [
                "Within the last 2 hours (Critical Golden Hour)",
                "Today (2-12 hours ago)",
                "1-2 days ago",
                "More than 2 days ago",
            ],
            index=0,
            key="incident_time_select",
        )

    incident_narrative = st.text_area(
        "Brief description of the incident:",
        placeholder="e.g., 'Received a call claiming my electricity would be disconnected. They sent a link and asked me to pay ₹10. Then ₹25,000 was debited.'",
        height=100,
        key="incident_narrative_input",
    )

    if st.button("🛡️ Generate Emergency Action Plan & Complaint Draft", type="primary", use_container_width=True):
        # Validation for 'Other' bank selection
        if bank_selection == "Other" and not effective_bank_name:
            st.error("❌ Please specify the bank or payment app involved.")
            return

        st.markdown("---")
        st.markdown("### 📋 Emergency Action Plan & Official Complaint Draft")

        target_bank_display = effective_bank_name if effective_bank_name else "Your Bank"

        # Priority 1: Dial 1930
        utr_display = utr_number.strip() if utr_number and utr_number.strip() else "[Your Transaction ID / UTR]"
        step1_html = textwrap.dedent(f"""
<div style="background: #1e1b4b; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1rem;">
    <div style="font-size: 1.2rem; font-weight: 800; color: #a5b4fc;">
        📞 STEP 1: Call 1930 Immediately
    </div>
    <p style="color: #e2e8f0; font-size: 0.9rem; margin-top: 0.5rem; line-height: 1.4;">
        Dial <b>1930</b> (National Cyber Crime Reporting Helpline). Report the transaction UTR <b>{utr_display}</b> and your account details with <b>{target_bank_display}</b>. The operator will initiate a lien/freeze request with the beneficiary bank.
    </p>
</div>
""").strip()
        st.markdown(step1_html, unsafe_allow_html=True)

        # Priority 2: Bank Freeze
        st.markdown("#### 🏦 STEP 2: Contact Your Bank's Fraud Prevention Cell")
        st.markdown(
            f"""
            1. Call **{target_bank_display}** 24x7 toll-free fraud helpline immediately.
            2. Request an **immediate block on your UPI ID, net banking, or debit card** to prevent subsequent debits.
            3. Request an official **Fraud Acknowledgment / Ticket Reference Number**.
            """
        )

        # Priority 3: Complaint Draft Generator
        st.markdown("#### 📝 STEP 3: Auto-Generated Formal Cyber Crime Complaint Draft")
        st.caption("Copy this text and submit it directly at https://cybercrime.gov.in:")

        current_date_str = datetime.now().strftime("%d-%b-%Y")
        complaint_draft = f"""SUBJECT: Urgent Complaint regarding Financial Fraud / Cyber Deception of ₹{amount_lost:,.2f}

To,
The Cyber Crime Reporting Cell / National Cybercrime Portal (cybercrime.gov.in)

Respected Officer,

I am writing to report an unauthorized financial fraud incident that occurred on {current_date_str}.

INCIDENT DETAILS:
- Bank / Payment Service: {target_bank_display}
- Transaction Amount: ₹{amount_lost:,.2f}
- Transaction ID / UTR: {utr_display}
- Timeline: {incident_time}

BRIEF SUMMARY OF FRAUD:
{incident_narrative.strip() if incident_narrative and incident_narrative.strip() else "The scammer coerced payment through deceptive messaging and fake payment triggers."}

REQUEST:
I request the Cyber Crime Cell and the concerned banks to immediately initiate a lien/freeze on the beneficiary account to prevent withdrawal and help recover the defrauded funds.

Thank you.
[Complainant Name]
[Complainant Mobile Number]
"""
        st.code(complaint_draft, language="text")
