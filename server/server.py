from fastapi import FastAPI, HTTPException, status # type: ignore
from fastapi import Request # type: ignore
import pandas as pd# type: ignore
from fastapi import UploadFile, File# type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel, Field # type: ignore
from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from bson import ObjectId # type: ignore
import jwt # type: ignore
import logging
from passlib.context import CryptContext # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

secret_key = 'krishna_gumaste'

# Create an instance of the FastAPI application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


uri = os.getenv("MONGO_URI")
import certifi # type: ignore

try:
    MONGO_DETAILS = uri
    client = AsyncIOMotorClient(MONGO_DETAILS, tlsCAFile=certifi.where())
    database = client.Mareana  # Only initialize the database
    print("Successfully connected to MongoDB:", database.name)
except Exception as e:
    print("MongoDB connection failed:", e)

class userModel(BaseModel):
    name: str
    email: str
    password: str

# Define a root route
@app.post("/test")
async def test(req: Request):
    try:
        # Extract the token from the request body
        body = await req.json()
        token = body['token']
        if not token:
            raise HTTPException(status_code=401, detail="Token is required")

        # Decode the JWT token to get the user_id
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Check if the user_id is present
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Find the user's CSV document
        csv_collection = database.csv
        user_csv = await csv_collection.find_one({"user_id": user_id})

        if not user_csv:
            raise HTTPException(status_code=404, detail="No CSV data found for the user")

        return {
            'message': 'User data retrieved successfully',
            'data': user_csv['data'],  # Return the user CSV data
            'filename': user_csv.get('filename', 'User Data')  # Return the filename if available
        }

    except Exception as e:
        logging.error("Error fetching user data: %s", e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching user data")

@app.post('/register')
async def register(req: Request):
    data = await req.json()
    
    # Define the users collection
    users_collection = database.users

    # Check if a user with the given email already exists
    existing_user = await users_collection.find_one({"email": data['email']})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")

    # Hash the password before storing it
    hashed_password = pwd_context.hash(data['password'])
    
    # Create the new user document with the hashed password
    new_user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password
    }
    
    result = await users_collection.insert_one(new_user)
    
    return {
        'message': 'User registered successfully',
        'user_id': str(result.inserted_id)
    }


@app.post('/login')
async def login(req: Request):
    data = await req.json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password are required")

    # Access the users collection
    users_collection = database.users

    # Find a user with a matching email
    user = await users_collection.find_one({"email": email})

    if user and pwd_context.verify(password, user.get('password')):
        # Generate a JWT token for the user using their user_id
        token = jwt.encode({'user_id': str(user['_id'])}, secret_key, algorithm='HS256')
        return {
            'message': 'User Logged In',
            'token': token,
            'name': user.get('name')
        }

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

# @app.get("/test")
# async def test():
#     try:
#         # Decode the JWT token to get the user_id
#         decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
#         user_id = decoded_token.get('user_id')
#         print(user_id)
#     except Exception as e:
#         logging.error("Error :", e)
#         raise HTTPException(status_code=500, detail="An error occurred while fetching user data")

class CsvDataRequest(BaseModel):
    fileContent: str  # The CSV file content as a string
    token: str        # JWT token

@app.post("/addcsvdata")
async def add_csv_file(req: Request):
    try:
        data = await req.json()
        # Decode the JWT token to get the user_id
        decoded_token = jwt.decode(data['token'], secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Check if the user_id is present
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Prepare the document to be stored in MongoDB with the CSV string
        csv_data = {
            "user_id": user_id,
            "filename": data['filename'],
            "data": data['csvData']  # Store the CSV string directly
        }

        # Define the csv collection
        csv_collection = database.csv  # Ensure this is correctly set up to your MongoDB collection

        # Update the document for the user_id, replacing if it exists
        result = await csv_collection.update_one(
            {"user_id": user_id},  # Filter by user_id
            {"$set": csv_data},  # Replace with new data
            upsert=True  # Insert if no existing document is found
        )

        # Check whether the data was inserted or updated
        action = "inserted" if result.upserted_id else "updated"

        # Return the message, with data and filename
        return {
            'message': f'CSV file {action} successfully',
            'csv_id': str(result.upserted_id) if result.upserted_id else None,
        }
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the CSV file")

    
@app.post("/user_data")
async def get_user_data(req: Request):
    try:
        # Extract the token from the request body
        body = await req.json()
        token = body.get('token')
        if not token:
            raise HTTPException(status_code=401, detail="Token is required")

        # Decode the JWT token to get the user_id
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Check if the user_id is present
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Find the user's CSV document
        csv_collection = database.csv
        user_csv = await csv_collection.find_one({"user_id": user_id})

        if not user_csv:
            raise HTTPException(status_code=404, detail="No CSV data found for the user")

        return {
            'message': 'User data retrieved successfully',
            'data': user_csv['data'],  # Return the user CSV data
            'filename': user_csv['filename']  # Return the filename if available
        }

    except Exception as e:
        logging.error("Error fetching user data: %s", e)
        raise HTTPException(status_code=500, detail="An error occurred while fetching user data")

    
@app.post("/searchdata")
async def search_data(req: Request):
    try:
        # Extract the token from the request headers
        body = await req.json()
        token = body['token']
        if not token:
            raise HTTPException(status_code=401, detail="Token is required")

        # Decode the JWT token to get the user_id
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Check if the user_id is present
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Get the search parameters from the request body
        employeeId = body.get("employeeId")
        firstName = body.get("firstName")
        lastName = body.get("lastName")

        # Find the user's CSV document
        csv_collection = database.csv
        user_csv = await csv_collection.find_one({"user_id": user_id})

        if not user_csv:
            raise HTTPException(status_code=404, detail="No CSV data found for the user")

        # Filter employee data based on provided parameters
        employee_data = user_csv['data']
        result = []

        for employee in employee_data:
            if (employeeId and employee['employeeId'] == employeeId) or \
               (firstName and employee['firstName'].lower() == firstName.lower()) or \
               (lastName and employee['lastName'].lower() == lastName.lower()):
                result.append(employee)

        if not result:
            raise HTTPException(status_code=404, detail="No matching employee found")

        return {
            'message': 'Employee data retrieved successfully',
            'data': result
        }

    except Exception as e:
        logging.error("Error searching employee data: %s", e)
        raise HTTPException(status_code=500, detail="An error occurred while searching for employee data")
    
@app.post("/modifydata")
async def modify_employee(req: Request):
    try:
        # Extract the token from the request body
        body = await req.json()
        token = body.get('token')
        if not token:
            raise HTTPException(status_code=401, detail="Token is required")

        # Decode the JWT token to get the user_id
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Check if the user_id is present
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Get the employee data from the request body
        employeeId = body.get("employeeId")
        updated_fields = {
            "firstName": body.get("firstName"),
            "lastName": body.get("lastName"),
            "dateOfBirth": body.get("dateOfBirth"),
            "dateOfJoining": body.get("dateOfJoining"),
            "grade": body.get("grade")
        }

        # Find the user's CSV document
        csv_collection = database.csv
        user_csv = await csv_collection.find_one({"user_id": user_id})

        if not user_csv:
            raise HTTPException(status_code=404, detail="No CSV data found for the user")

        # Get the employee data
        employee_data = user_csv['data']
        employee_found = False
        updated = False

        for employee in employee_data:
            if employee['employeeId'] == employeeId:
                employee_found = True
                # Check for changes and update if necessary
                for field, new_value in updated_fields.items():
                    if new_value and employee[field].lower() != new_value.lower():
                        employee[field] = new_value
                        updated = True

                if updated:
                    # Update the CSV document in the database
                    await csv_collection.update_one(
                        {"user_id": user_id},
                        {"$set": {"data": employee_data}}
                    )

                break

        if not employee_found:
            raise HTTPException(status_code=404, detail="Employee not found")

        return {
            'message': 'Employee data modified successfully',
            # 'data': employee_data
        }

    except Exception as e:
        logging.error("Error modifying employee data: %s", e)
        raise HTTPException(status_code=500, detail="An error occurred while modifying employee data")