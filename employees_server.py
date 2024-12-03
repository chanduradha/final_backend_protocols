from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from faker import Faker
import random
import pandas as pd

# Create an instance of FastAPI
app = FastAPI()

# Initialize Faker to generate random data (still useful for generating random data in other parts)
fake = Faker()


# Pydantic model for employee data
class Employee(BaseModel):
    id: int
    name: str
    age: int
    position: str


# In-memory employee database (simulating a database)
employees = []


# Function to export employee data to an Excel file
def export_to_excel():
    # Convert the list of Employee objects to a list of dictionaries
    employees_data = [employee.dict() for employee in employees]

    # Create a pandas DataFrame from the list of dictionaries
    df = pd.DataFrame(employees_data)

    # Define the file path where the Excel sheet will be saved
    file_path = "employees_data.xlsx"

    # Write the DataFrame to an Excel file
    df.to_excel(file_path, index=False, engine="openpyxl")
    print(f"Data exported to {file_path}")


# Populate the list with some random employees (5 random employees)
for i in range(1, 6):
    employees.append(Employee(id=i, name=fake.name(), age=random.randint(20, 60), position=fake.job()))

# Export initial data to Excel
export_to_excel()


# CRUD Operation: Get all employees
@app.get("/employees/", response_model=List[Employee])
async def get_employees():
    return employees


# CRUD Operation: Get a specific employee by ID
@app.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(employee_id: int):
    for employee in employees:
        if employee.id == employee_id:
            return employee
    raise HTTPException(status_code=404, detail="Employee not found")


# CRUD Operation: Create a new employee with user-provided data
@app.post("/employees/", response_model=Employee)
async def create_employee(employee: Employee):
    new_id = len(employees) + 1  # Assign a new unique ID
    employee.id = new_id  # Set the ID of the new employee
    employees.append(employee)  # Add the new employee to the list
    export_to_excel()  # Export to Excel after creating a new employee
    return employee  # Return the newly created employee


# CRUD Operation: Update an existing employee with optional fields
@app.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(employee_id: int, updated_employee: Employee):
    for idx, employee in enumerate(employees):
        if employee.id == employee_id:
            # Update only the fields that are provided (non-None)
            if updated_employee.name is not None:
                employees[idx].name = updated_employee.name
            if updated_employee.age is not None:
                employees[idx].age = updated_employee.age
            if updated_employee.position is not None:
                employees[idx].position = updated_employee.position
            export_to_excel()  # Export to Excel after updating employee
            return employees[idx]
    raise HTTPException(status_code=404, detail="Employee not found")


# CRUD Operation: Delete an employee
@app.delete("/employees/{employee_id}", response_model=Employee)
async def delete_employee(employee_id: int):
    for idx, employee in enumerate(employees):
        if employee.id == employee_id:
            removed_employee = employees.pop(idx)
            export_to_excel()  # Export to Excel after deleting employee
            return removed_employee
    raise HTTPException(status_code=404, detail="Employee not found")
# TO RUN  USE uvicorn employees_server:app --reload