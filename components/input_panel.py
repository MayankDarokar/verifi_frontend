"""Input panel component for VeriFi Analyze mode."""

import streamlit as st
from typing import Tuple, Optional, Any
from utils.validators import validate_qr_image, validate_qr_size


def render_input_panel(preset_scenario: Optional[str] = None) -> Tuple[str, Any, bool]:
    """
    Render input mode selection (Text, URL, QR Code) and input controls.

    Args:
        preset_scenario: If set from sidebar, prefill corresponding input field.

    Returns:
        Tuple of (input_type, input_payload, submit_clicked)
    """
    st.markdown("### 🔍 Analyze Suspicious Interaction")
    st.markdown(
        "Submit a suspicious message, payment request, link, or QR code to investigate the underlying financial mechanism."
    )

    # Determine default tab based on preset scenario
    default_tab_idx = 0
    if preset_scenario == "lottery_prize_url":
        default_tab_idx = 1
    elif preset_scenario == "cashback_qr_mismatch":
        default_tab_idx = 2

    tab_text, tab_url, tab_qr = st.tabs(["💬 Text / Message", "🔗 Link / URL", "📷 QR Code Image"])

    input_type = "text"
    user_payload: Any = None

    with tab_text:
        st.caption("Paste SMS, WhatsApp message, Telegram offer, or payment request:")
        
        default_text = ""
        if preset_scenario == "electricity_bill_scam":
            default_text = "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact our officer at 9876543210 or visit https://bses-bill-update.xyz/pay"
        elif preset_scenario == "legitimate_merchant_receipt":
            default_text = "Paid ₹450 to Nature Fresh Grocery via UPI on 01 Oct 2026. UPI Ref: 427819203810. For order support, visit naturefresh.in/orders"
        elif preset_scenario == "cashback_qr_mismatch":
            default_text = "Congratulations! You have received ₹5,000 cashback from PhonePe. Scan the QR code to receive money into your bank."

        # Initialize session state for text input if needed
        if "input_text_area" not in st.session_state:
            st.session_state["input_text_area"] = default_text

        # If scenario changed, update session state text
        if "prev_preset_scenario" not in st.session_state or st.session_state["prev_preset_scenario"] != preset_scenario:
            st.session_state["prev_preset_scenario"] = preset_scenario
            if default_text:
                st.session_state["input_text_area"] = default_text
            elif preset_scenario is None:
                st.session_state["input_text_area"] = ""

        text_input = st.text_area(
            "Message Content:",
            height=120,
            placeholder='"Congratulations! You have received ₹5,000 cashback. Scan this QR code or click here to claim your reward immediately."',
            help="Enter the exact text received.",
            key="input_text_area",
        )

    with tab_url:
        st.caption("Enter a suspicious link, payment portal, or website address:")
        default_url = "https://kbc-lucky-winner-draw-2026.online/claim-prize?user_id=89234" if preset_scenario == "lottery_prize_url" else ""
        
        if "input_url_field" not in st.session_state:
            st.session_state["input_url_field"] = default_url
        elif preset_scenario == "lottery_prize_url" and st.session_state["input_url_field"] != default_url:
            st.session_state["input_url_field"] = default_url

        url_input = st.text_input(
            "Website URL:",
            placeholder="e.g., https://bses-bill-update.xyz/pay or https://kbc-lucky-winner-draw-2026.online",
            help="Enter the full link received in the message.",
            key="input_url_field",
        )

    with tab_qr:
        st.caption("Upload a QR code image containing a payment request or URL.")
        st.markdown(
            "<div style='font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem;'>"
            "Supported: <b>PNG, JPG/JPEG, WebP</b> • Maximum size: <b>10 MB</b>"
            "</div>",
            unsafe_allow_html=True,
        )
        
        qr_file = st.file_uploader(
            "Upload QR Image",
            type=["png", "jpg", "jpeg", "webp"],
            key="input_qr_uploader",
            label_visibility="collapsed",
        )
        
        qr_valid = False
        if qr_file is not None:
            if not validate_qr_size(qr_file):
                st.error("❌ File exceeds 10 MB limit. Please upload an image under 10 MB.")
            elif not validate_qr_image(qr_file.name):
                st.error("❌ Unsupported file format. Please upload a PNG, JPG, or WebP image.")
            else:
                qr_valid = True
                st.image(qr_file, caption=f"Attached: {qr_file.name} ({qr_file.size / 1024:.1f} KB)", width=220)
                st.info("📷 QR image attached. Click 'Run VeriFi Deep Investigation' to analyze the payment payload.")

    # Determine input payload according to priority of active content
    if qr_file is not None and qr_valid:
        input_type = "qr"
        user_payload = {"filename": qr_file.name, "file_data": qr_file}
    elif url_input and url_input.strip() and default_tab_idx == 1:
        input_type = "url"
        user_payload = url_input.strip()
    elif text_input and text_input.strip():
        input_type = "text"
        user_payload = text_input.strip()
    elif url_input and url_input.strip():
        input_type = "url"
        user_payload = url_input.strip()
    else:
        input_type = "text"
        user_payload = text_input.strip() if text_input else ""

    st.markdown("<br/>", unsafe_allow_html=True)
    analyze_btn = st.button("🛡️ Run VeriFi Deep Investigation", type="primary", use_container_width=True)

    return input_type, user_payload, analyze_btn