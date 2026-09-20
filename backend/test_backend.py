import unittest
from main import health_check, get_client_config, record_consent, safevoice_chat, ConsentRequest, SafeVoiceChatRequest, SafeVoiceContextPayload

class TestFastAPIBackend(unittest.TestCase):
    def test_health_check(self):
        data = health_check()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "ShieldHer Backend API")
        self.assertEqual(data["phase"], 6)

    def test_api_config(self):
        data = get_client_config()
        self.assertEqual(data["appName"], "ShieldHer")
        self.assertTrue("en" in data["supportedLanguages"])
        self.assertTrue(data["zeroUploadDefault"])

    def test_record_consent(self):
        payload = ConsentRequest(
            consentGiven=True,
            scope="local_only",
            version="1.0"
        )
        res = record_consent(payload)
        self.assertEqual(res.status, "recorded")
        self.assertTrue(res.recordId.startswith("consent_"))

    def test_safevoice_chat_demo_fallback(self):
        req = SafeVoiceChatRequest(
            message="What should I do first?",
            context=SafeVoiceContextPayload(selectedLanguage="en")
        )
        res = safevoice_chat(req)
        self.assertEqual(res.riskCategory, "NORMAL_SUPPORT")
        self.assertTrue(res.isDemoFallback)
        self.assertTrue(len(res.suggestedActions) > 0)

if __name__ == "__main__":
    unittest.main()
