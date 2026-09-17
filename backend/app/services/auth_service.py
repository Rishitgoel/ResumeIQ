from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.core.security import create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)

    async def register(self, user_in: UserRegister) -> Token:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
        user = await self.user_repo.create(user_in)
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserOut.model_validate(user)
        )

    async def login(self, login_in: UserLogin) -> Token:
        user = await self.user_repo.authenticate(login_in.email, login_in.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is inactive."
            )
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserOut.model_validate(user)
        )
