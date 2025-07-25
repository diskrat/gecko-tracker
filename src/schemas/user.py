from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserDTO(BaseModel):

    id: Optional[int] = None
    name: str
    password: str
    role: Optional[str] = None

    class ConfigDict:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "password": "securepassword",
            }
        }

class UserCreateDTO(UserDTO):
    password: str
    role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserSchemaUp(UserDTO):
    name: Optional[str]
    password: Optional[str]
    role: Optional[str]

    model_config = ConfigDict(from_attributes=True)