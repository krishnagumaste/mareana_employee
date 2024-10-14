from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Define OAuth2 Bearer token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define the Pydantic model for the request body
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

# Dummy function to verify token (Replace with actual implementation)
def verify_token(token: str):
    if token != "valid-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

# Protected route
@app.post("/items/")
async def create_item(item: Item, token: str = Depends(oauth2_scheme)):
    verify_token(token)  # Call token verification function
    return {"token": token, "item_name": item.name, "item_price": item.price}
