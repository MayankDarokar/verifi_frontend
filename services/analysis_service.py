"""Analysis Service for VeriFi.

Provides high-level methods called by the Streamlit frontend.
Delegates execution to the configured AgentAdapter (initially MockAgentAdapter).
When Aditya's real agent is ready, this is the single point of wiring.
"""

from typing import Optional
from models.analysis_result import AnalysisResult
from services.agent_adapter import AgentAdapter
from services.mock_agent_adapter import MockAgentAdapter


class AnalysisService:
    """Service coordinator between frontend and agent adapter."""

    def __init__(self, adapter: Optional[AgentAdapter] = None):
        # Default to MockAgentAdapter until real agent is plugged in
        self.adapter: AgentAdapter = adapter or MockAgentAdapter()

    def run_analysis(
        self,
        user_input: str,
        input_type: str = "text",
        language: str = "English",
        scenario_key: Optional[str] = None,
    ) -> AnalysisResult:
        """
        Execute analysis via the configured agent adapter.

        Args:
            user_input: Raw text / URL / identifier.
            input_type: 'text', 'url', or 'qr'.
            language: Language preference for response framing.
            scenario_key: Optional key to force a hermetic demo scenario.

        Returns:
            Structured AnalysisResult.
        """
        return self.adapter.analyze(
            user_input=user_input,
            input_type=input_type,
            language=language,
            scenario_key=scenario_key,
        )


# Singleton instance for easy import in components
analysis_service = AnalysisService()
