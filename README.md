# VeriFi — Frontend Prototype

<p align="center">
  <img src="./public/verifi-banner.png" alt="VeriFi — Evidence-Driven Financial Safety Agent" width="100%" />
</p>

**Hackathon Project | Evidence-Driven Financial Safety Agent**

---

## What VeriFi Is

VeriFi is an AI-powered verification system that analyzes suspicious financial/digital interactions by examining:

**User Intent → Actual Mechanism → Evidence → Risk → Recommended Action**

The core idea: compare what a message claims will happen (e.g., "Receive ₹5,000") with what the actual payment mechanism does (e.g., "QR code debits ₹5,000"). When they conflict, VeriFi flags the mismatch and assesses risk deterministically.

---

## Current Frontend Scope

This repository contains the **Streamlit frontend prototype** only. The backend intelligence layer (Aditya's agent) is **not** included and will be integrated later.

### What This Frontend Does

- Accepts three input types: **Text/Message**, **URL**, and **QR Code** image
- Calls a **mock analysis service** that simulates the structured response the real agent will provide
- Displays a complete verification result including:
  - Risk level (CRITICAL / HIGH / SUSPICIOUS / NO_STRONG_INDICATORS)
  - Numerical risk score (0–135)
  - Stated financial intent
  - Detected payment mechanism
  - Intent–Mechanism mismatch visualization
  - Supporting evidence
  - Agent Decision Trace (observable record of what the agent did)
  - Recommended user action
- Demonstrates **multiple mock scenarios** (safe, suspicious, high-risk) without requiring the real agent
- Includes loading, error, and empty states
- Structured for future connection to Aditya's real agent

### What This Frontend Does NOT Do

- ❌ Build or run the AI agent/backend
- ❌ Perform live URL scanning or WHOIS lookups
- ❌ Decode QR codes using pyzbar (OpenCV path only, not yet implemented)
- ❌ Make claims about blocking payments
- ❌ Require user accounts or authentication
- ❌ Include payment integration or database storage

---

## Project Structure

```
verifi_frontend/
├── app.py                    # Main Streamlit entry point
├── requirements.txt          # Python dependencies
├── README.md                 # This file
│
├── components/               # Reusable UI components
│   ├── header.py           # VeriFi branding banner
│   ├── input_panel.py      # Input type selection + input fields
│   ├── input_panel.py      # Input type selection + input fields
│   ├── risk_result.py      # Risk level + score display
│   ├── evidence.py         # Evidence bullet items
│   ├── mismatch_card.py    # Intent vs Mechanism centerpiece
│   ├── decision_trace.py   # Agent Decision Trace
│   └── recommendation.py   # Recommended action
│
├── services/               # Analysis service adapters
│   ├── mock_analysis.py    # Provisional mock analysis service
│
├── models/                 # Data structure definitions
│   └── analysis_result.py  # MockAnalysisResult (Pydantic model)
│
├── utils/                  # Utility helpers
│   └── validators.py       # Input validation helpers
```

---

## Installation & Setup

1. **Clone / download this repository**

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   Required packages: `streamlit`, `qrcode`, `pillow`, `python-dotenv`, `tldextract`

3. **Run the application:**

   ```bash
   streamlit run app.py
   ```

   The app will open at `http://localhost:8501` in your default browser.

---

## Mock Analysis Service

The frontend uses a **provisional mock analysis service** (`services/mock_analysis.py`) that generates deterministic results for three scenarios:

| Scenario | Risk Level | Score | Description |
|----------|------------|-------|-------------|
| **safe** | NO_STRONG_INDICATORS | 5 | Message and mechanism align; no deception signals |
| **suspicious** | SUSPICIOUS | 35 | Mismatch between intent and mechanism; urgency present |
| **high_risk** | CRITICAL | 82 | Direct Intent–Mechanism mismatch; clear evidence of deception |

The mock service is designed to be **easily replaceable** with the real agent:

```python
# Future: replace with real agent call
from services.mock_analysis import mock_analysis
result = mock_analysis(user_input=user_text, input_type="text")
# Later:
# from services.agent_adapter import agent_analysis
# result = agent_analysis(user_input=user_text, input_type="text")
```

The integration layer is intentionally isolated so the contract can be adjusted once Aditya provides the real agent output.

---

## Adding a New Mock Scenario

Edit `services/mock_analysis.py` and add a new scenario dict to the `SCENARIOS` list, or create a new named scenario via `get_scenario_by_name()`. The UI will randomly select from the pool unless a specific scenario is passed.

---

## Future Agent Integration

The frontend is architected with a clear separation of responsibilities:

```
Frontend
    ↓
analysis_service (mock or real)
    ↓
agent_adapter (to be implemented by Aditya)
    ↓
Aditya's real agent
```

For now, the `analysis_service` calls `mock_analysis()`. When ready, the adapter can swap in the real agent without rewriting UI code — the `MockAnalysisResult` model and all component renderers will work with the real agent's output as long as it conforms to the same Pydantic structure.

---

## Demo Experience

The complete application allows demonstration of the following flow:

1. Open VeriFi
2. Enter a suspicious financial message/URL/QR
3. Click **Analyze**
4. See analysis/loading state
5. See risk result (level + score)
6. See user intent
7. See mechanism (what QR/request actually does)
8. See intent–mechanism mismatch (if present)
9. See evidence supporting the result
10. See agent decision trace
11. See recommended action

Even though the intelligence is temporarily mocked, the flow feels like a real product.

---

## Design Notes

- **Visual style**: Modern, premium, trustworthy — appropriate for a cybersecurity/financial verification product
- **Priority**: clarity > decorative effects; strong information hierarchy; readable risk indicators
- **Typography**: Clean, professional; risk levels prominently displayed
- **Responsiveness**: Streamlit layout adapts to mobile and desktop widths
- **No "safe" wording**: The risk engine explicitly avoids calling anything "safe"; lowest level is "NO_STRONG_INDICATORS"
```

---

## Current Limitations

- The intelligence layer is **totally mocked** — results are deterministic and selected from a small predefined pool
- QR code **decoding is not yet implemented** — the UI accepts image uploads but uses mock data for demonstration
- No live external API calls (URL scanning, WHOIS, urlscan) — all evidence is simulated
- The mock scenarios are limited to three predefined outcomes (safe/suspicious/critical)

These limitations are intentional for the hackathon deadline. The frontend is fully functional and structured for seamless integration with the real agent later.