from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import httpx
import json

# --- Config ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://placeholder.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "placeholder-key")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "placeholder-anon-key")

app = FastAPI(title="Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helpers ---
def supabase_headers(token: Optional[str] = None):
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {token or SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

async def verify_admin(authorization: str = Header(None)):
    """Verify JWT from Supabase auth."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "")
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {token}",
            },
        )
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return res.json()

# --- Models ---
class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str] = []
    category: str = "frontend"
    image_url: str = ""
    live_url: str = ""
    github_url: str = ""

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None

class SkillCreate(BaseModel):
    name: str
    level: int = 50
    category: str = "frontend"

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

# --- PUBLIC ROUTES ---

@app.get("/api/projects")
async def get_projects():
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/projects?order=created_at.desc",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            },
        )
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch projects")
    return res.json()

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/projects?id=eq.{project_id}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            },
        )
    data = res.json()
    if not data:
        raise HTTPException(status_code=404, detail="Project not found")
    return data[0]

@app.get("/api/skills")
async def get_skills():
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/skills?order=created_at.asc",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            },
        )
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail="Failed to fetch skills")
    return res.json()

@app.post("/api/contact")
async def submit_contact(msg: ContactMessage):
    payload = {"name": msg.name, "email": msg.email, "message": msg.message}
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_URL}/rest/v1/messages",
            headers=supabase_headers(),
            content=json.dumps(payload),
        )
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Failed to save message")
    return {"status": "ok", "message": "Message sent successfully"}

# --- ADMIN ROUTES (require auth) ---

@app.post("/api/projects")
async def create_project(project: ProjectCreate, user=Depends(verify_admin)):
    payload = project.model_dump()
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_URL}/rest/v1/projects",
            headers=supabase_headers(),
            content=json.dumps(payload),
        )
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Failed to create project")
    return res.json()

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project: ProjectUpdate, user=Depends(verify_admin)):
    payload = {k: v for k, v in project.model_dump().items() if v is not None}
    async with httpx.AsyncClient() as client:
        res = await client.patch(
            f"{SUPABASE_URL}/rest/v1/projects?id=eq.{project_id}",
            headers=supabase_headers(),
            content=json.dumps(payload),
        )
    if res.status_code not in (200, 204):
        raise HTTPException(status_code=500, detail="Failed to update project")
    return res.json() if res.content else {"status": "updated"}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, user=Depends(verify_admin)):
    async with httpx.AsyncClient() as client:
        res = await client.delete(
            f"{SUPABASE_URL}/rest/v1/projects?id=eq.{project_id}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            },
        )
    if res.status_code not in (200, 204):
        raise HTTPException(status_code=500, detail="Failed to delete project")
    return {"status": "deleted"}

@app.post("/api/skills")
async def create_skill(skill: SkillCreate, user=Depends(verify_admin)):
    payload = skill.model_dump()
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_URL}/rest/v1/skills",
            headers=supabase_headers(),
            content=json.dumps(payload),
        )
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Failed to create skill")
    return res.json()

@app.delete("/api/skills/{skill_id}")
async def delete_skill(skill_id: str, user=Depends(verify_admin)):
    async with httpx.AsyncClient() as client:
        res = await client.delete(
            f"{SUPABASE_URL}/rest/v1/skills?id=eq.{skill_id}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            },
        )
    if res.status_code not in (200, 204):
        raise HTTPException(status_code=500, detail="Failed to delete skill")
    return {"status": "deleted"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), user=Depends(verify_admin)):
    contents = await file.read()
    filename = f"projects/{file.filename}"
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_URL}/storage/v1/object/project-images/{filename}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": file.content_type or "image/png",
            },
            content=contents,
        )
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Failed to upload image")
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/project-images/{filename}"
    return {"url": public_url}

# --- Root & Health ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running", "docs": "/docs", "health": "/api/health"}

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
