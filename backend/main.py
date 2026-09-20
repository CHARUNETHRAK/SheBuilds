from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import os
import urllib.request
import json

app = FastAPI(
    title="ShieldHer Backend API",
    description="Privacy-preserving API architecture for ShieldHer Digital Safety Toolkit",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConsentRequest(BaseModel):
    consentGiven: bool
    scope: str
    version: str = "1.0"
    timestamp: Optional[str] = None

class ConsentResponse(BaseModel):
    status: str
    recordId: str
    recordedAt: str

class SafeVoiceContextPayload(BaseModel):
    caseStatus: Optional[str] = None
    detectionLikelihood: Optional[str] = None
    shieldScanStatus: Optional[str] = None
    selectedLanguage: str = "en"

class SafeVoiceChatRequest(BaseModel):
    message: str = Field(..., max_length=2000) # Input size validation
    context: Optional[SafeVoiceContextPayload] = None

class SafeVoiceChatResponse(BaseModel):
    message: str
    riskCategory: str
    suggestedActions: List[str]
    isDemoFallback: bool = False
    timestamp: str

SYSTEM_PROMPT = """You are SafeVoice, a trauma-informed digital support guide for women facing image-based abuse.
RULES:
1. Acknowledge user feelings without blaming them.
2. Give one clear next step at a time.
3. Never claim legal certainty or tell the user someone is definitely guilty.
4. Never identify or target alleged perpetrators.
5. If immediate danger or self-harm is mentioned, encourage local emergency support (112 / 1930) and trusted contacts.
6. Keep responses calm, concise, and in the user's requested language.
7. Remind the user that SafeVoice provides decision-support information, not legal advice or emergency response."""

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ShieldHer Backend API",
        "phase": 6,
        "privacyMode": "zero_media_upload_default",
        "claudeKeyConfigured": bool(os.getenv("CLAUDE_API_KEY"))
    }

@app.get("/api/config")
def get_client_config():
    return {
        "appName": "ShieldHer",
        "supportedLanguages": ["en", "ta", "hi", "te", "kn", "ml"],
        "clientEncryption": {
            "algorithm": "AES-GCM-256",
            "mediaHashAlgorithm": "SHA-256"
        },
        "privacyPolicyVersion": "1.0",
        "zeroUploadDefault": True
    }

@app.post("/api/consent", response_model=ConsentResponse)
def record_consent(request: ConsentRequest):
    recorded_at = request.timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()
    record_id = f"consent_{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    return ConsentResponse(
        status="recorded",
        recordId=record_id,
        recordedAt=recorded_at
    )

@app.post("/api/safevoice/chat", response_model=SafeVoiceChatResponse)
def safevoice_chat(req: SafeVoiceChatRequest):
    # Input Sanitization & Validation
    cleaned_msg = req.message.strip()
    if not cleaned_msg:
        raise HTTPException(status_code=400, detail="Empty message payload.")

    api_key = os.getenv("CLAUDE_API_KEY")
    lang = req.context.selectedLanguage if req.context else "en"

    if not api_key:
        # Clearly labeled Demo Fallback Mode
        return SafeVoiceChatResponse(
            message="I am here to help you navigate this safely. Let us take one clear step at a time.\n\nFirst: Preserve original raw files and URLs before requesting platform takedowns.\n\n[Demo Mode — Server CLAUDE_API_KEY not set]",
            riskCategory="NORMAL_SUPPORT",
            suggestedActions=[
                "What should I do first?",
                "How can I document this?",
                "How can I report this?"
            ],
            isDemoFallback=True,
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

    try:
        # Call Anthropic Claude API securely from backend
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 500,
            "system": SYSTEM_PROMPT,
            "messages": [
                {"role": "user", "content": f"Language: {lang}\nUser query: {cleaned_msg}"}
            ]
        }
        req_data = json.dumps(payload).encode("utf-8")
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        api_req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=req_data, headers=headers)
        
        with urllib.request.urlopen(api_req, timeout=10) as resp:
            resp_body = json.loads(resp.read().decode("utf-8"))
            claude_text = resp_body["content"][0]["text"]

            return SafeVoiceChatResponse(
                message=claude_text,
                riskCategory="NORMAL_SUPPORT",
                suggestedActions=["What should I do first?", "How can I document this?"],
                isDemoFallback=False,
                timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
            )
    except Exception:
        return SafeVoiceChatResponse(
            message="I am experiencing a temporary connection delay, but you remain safe here.\n\n1. Preserve raw original evidence in SafeDoc.\n2. Report to Cyber Crime Helpline 1930.",
            riskCategory="NORMAL_SUPPORT",
            suggestedActions=["What should I do first?", "How can I document this?"],
            isDemoFallback=True,
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
