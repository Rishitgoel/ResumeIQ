from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    auth_service = AuthService(db)
    return await auth_service.register(user_in)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """OAuth2 compatible token login, getting an access token for future requests."""
    auth_service = AuthService(db)
    login_in = UserLogin(email=form_data.username, password=form_data.password)
    return await auth_service.login(login_in)

@router.post("/login/json", response_model=Token)
async def login_json(login_in: UserLogin, db: AsyncSession = Depends(get_db)):
    """JSON body login endpoint for single-page applications."""
    auth_service = AuthService(db)
    return await auth_service.login(login_in)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    """Fetch profile of current authenticated user."""
    return current_user
