"""Incident Mode Component for VeriFi: 'I've Already Been Scammed'."""

import streamlit as st
from datetime import datetime


def render_incident_view():
    """
    Render the guided incident response interview and emergency response plan.
    Provides immediate emergency triage for victims of financial fraud.
    """
    st.markdown("### 🚨 Emergency Incident Response")
    st.markdown(
        """
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 0.75rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
            <b style="color: #fca5a5; font-size: 1.05rem;">Immediate Golden-Hour Protection:</b><br/>
            <span style="color: #cbd5e1; font-size: 0.9rem;">
                If money was debited within the last 2 to 4 hours, immediate notification to your bank and <b>1930</b> can freeze the recipient account before funds are laundered.
            </span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("#### Step 1: Tell Us What Happened")

    col1, col2 = st.columns(2)
    with col1:
        bank_name = st.selectbox(
            "Your Bank / Payment App:",
            ["State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Paytm Payments Bank", "PhonePe / GPay (UPI)", "Other"],
            index=0,
        )
        amount_lost = st.number_input(
            "Approximate Amount Lost (₹):",
            min_value=1.0,
            value=10000.0,
            step=500.0,
        )

    with col2:
        utr_number = st.text_input(
            "Transaction ID / UPI Ref / UTR (if available):",
            placeholder="e.g. 427819203810",
            help="Found in your bank SMS or UPI payment history.",
        )
        incident_time = st.selectbox(
            "When did this happen?",
            ["Within the last 2 hours (Critical Golden Hour)", "Today (2-12 hours ago)", "1-2 days ago", "More than 2 days ago"],
            index=0,
        )

    incident_narrative = st.text_area(
        "Brief description of the incident:",
        placeholder="e.g., 'Received a call claiming my electricity would be disconnected. They sent a link and asked me to pay ₹10. Then ₹25,000 was debited.'",
        height=100,
    )

    if st.button("🛡️ Generate Emergency Action Plan & Complaint Draft", type="primary", use_container_width=True):
        st.markdown("---")
        st.markdown("### 📋 Emergency Action Plan & Official Complaint Draft")

        # Priority 1: Dial 1930
        st.markdown(
            """
            <div style="background: #1e1b4b; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1rem;">
                <div style="font-size: 1.2rem; font-weight: 800; color: #a5b4fc;">
                    📞 STEP 1: Call 1930 Immediately
                </div>
                <p style="color: #e2e8f0; font-size: 0.9rem; margin-top: 0.5rem;">
                    Dial <b>1930</b> (National Cyber Crime Reporting Helpline). Report the transaction UTR <b>{}</b> and bank account details. The operator will initiate a fund-freeze request across the beneficiary bank.
                </p>
            </div>
            """.format(utr_number if utr_number else "[Your Transaction ID]"),
            unsafe_allow_html=True,
        )

        # Priority 2: Bank Freeze
        st.markdown("#### 🏦 STEP 2: Contact Your Bank's Fraud Prevention Cell")
        st.markdown(
            f"""
            1. Call **{bank_name}** 24x7 toll-free fraud helpline.
            2. Request an **immediate freeze on your debit card/UPI handle** to prevent subsequent unauthorized debits.
            3. Ask for the **Fraud Acknowledgment / Ticket Reference Number**.
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
- Bank / Payment Service: {bank_name}
- Transaction Amount: ₹{amount_lost:,.2f}
- Transaction ID / UTR: {utr_number if utr_number else "Attached in bank statement"}
- Timeline: {incident_time}

BRIEF SUMMARY OF FRAUD:
{incident_narrative if incident_narrative else "The scammer coerced payment through deceptive messaging and fake payment triggers."}

REQUEST:
I request the Cyber Crime Cell and the concerned banks to immediately initiate a lien/freeze on the beneficiary account to prevent withdrawal and help recover the defrauded funds.

Thank you.
[Complainant Name]
[Complainant Mobile Number]
"""
        st.code(complaint_draft, language="text")
