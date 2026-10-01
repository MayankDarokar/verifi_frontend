"""Interface definition for the VeriFi Agent Adapter.

This module defines the contract that bridges the Streamlit frontend with the
underlying AI agent / backend intelligence layer.

Aditya's real agent (using LangGraph, tools, and the deterministic risk engine)
will implement this interface. Until then, `MockAgentAdapter` is used.
"""

from typing import Protocol, runtime_checkable, Optional
from models.analysis_result import AnalysisResult


@runtime_checkable
class AgentAdapter(Protocol):
    """Protocol that any VeriFi Agent Adapter must fulfill."""

    def analyze(
        self,
        user_input: str,
        input_type: str = "text",
        language: str = "English",
        scenario_key: Optional[str] = None,
    ) -> AnalysisResult:
        """
        Analyze suspicious user input and return a structured AnalysisResult.

        Args:
            user_input: Raw text, URL, or identifier for uploaded media.
            input_type: 'text', 'url', or 'qr'.
            language: 'English', 'Hinglish', or 'Hindi'.
            scenario_key: Optional fixture key for deterministic testing/demos.

        Returns:
            A complete AnalysisResult fulfilling the VeriFi contract.
        """
        ...
