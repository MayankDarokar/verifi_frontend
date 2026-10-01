"""Input panel component for VeriFi Analyze mode."""

import streamlit as st
from typing import Tuple, Optional, Dict, Any
from utils.validators import validate_text_input, validate_url, validate_qr_image


def render_input_panel(preset_scenario: Optional[str] = None) -> Tuple[str, Any, bool]:
    """
    Render input mode selection (Text, URL, QR Code) and input controls.

    Args:
        preset_scenario: If set from sidebar, can prefill or suggest input.

    Returns:
        Tuple of (input_type, input_payload, submit_clicked)
    """
    st.markdown("### 🔍 Analyze Suspicious Interaction")
    st.markdown(
        "Submit a suspicious message, payment request, link, or QR code to investigate the underlying financial mechanism."
    )

    tab_text, tab_url, tab_qr = st.tabs(["💬 Text / Message", "🔗 Link / URL", "📷 QR Code Image"])

    input_type = "text"
    user_payload: Any = None

    with tab_text:
        st.caption("Paste SMS, WhatsApp message, Telegram offer, or payment request:")
        
        # Pre-fill suggestions based on scenario preset if active
        default_text = ""
        if preset_scenario == "electricity_bill_scam":
            default_text = "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact our officer at 9876543210 or visit https://bses-bill-update.xyz/pay"
        elif preset_scenario == "legitimate_merchant_receipt":
            default_text = "Paid ₹450 to Nature Fresh Grocery via UPI on 01 Oct 2026. UPI Ref: 427819203810. For order support, visit naturefresh.in/orders"

        text_input = st.text_area(
            "Message Content:",
            value=default_text,
            height=120,
            placeholder='"Congratulations! You have received ₹5,000 cashback. Scan this QR code or click here to claim your reward immediately."',
            help="Enter the exact text received.",
            key="input_text_area",
        )

        col1, col2 = st.columns([1, 4])
        with col1:
            if st.button("Load Scam Sample", key="btn_sample_scam"):
                text_input = "Congratulations! You have received ₹5,000 cashback from PhonePe. Scan the QR code to receive money into your bank."
                st.session_state["input_text_area"] = text_input
                st.rerun()

    with tab_url:
        st.caption("Enter a suspicious link, payment portal, or website address:")
        default_url = "https://kbc-lucky-winner-draw-2026.online/claim-prize?user_id=89234" if preset_scenario == "lottery_prize_url" else ""
        url_input = st.text_input(
            "Website URL:",
            value=default_url,
            placeholder="https://bses-bill-update.xyz/pay or https://lottery-claim.online",
            key="input_url_field",
        )

    with tab_qr:
        st.caption("Upload a QR code screenshot or image (PNG, JPG, JPEG, WebP):")
        qr_file = st.file_uploader(
            "Upload QR Image",
            type=["png", "jpg", "jpeg", "webp"],
            key="input_qr_uploader",
        )
        if qr_file is not None:
            if validate_qr_image(qr_file.name):
                st.image(qr_file, caption=f"Uploaded: {qr_file.name}", width=200)
                st.success("QR image attached for mechanism investigation.")
            else:
                st.error("Unsupported file format. Please upload a standard image.")

    # Determine which tab was used
    if qr_file is not None:
        input_type = "qr"
        user_payload = {"filename": qr_file.name, "file_data": qr_file}
    elif url_input.strip():
        input_type = "url"
        user_payload = url_input.strip()
    else:
        input_type = "text"
        user_payload = text_input.strip()

    st.markdown("<br/>", unsafe_allow_html=True)
    analyze_btn = st.button("🛡️ Run VeriFi Deep Investigation", type="primary", use_container_width=True)

    return input_type, user_payload, analyze_btn