# Instructs Docker Engine to use official python:3.11 as the Base image 
FROM python:3.11

# Creates a working directiory (app) for the Docker image and container
WORKDIR /app

# Copies the framework and the dependencies in the requirements.txt file 
COPY requirements.txt .

# Install the framework and the dependencies in the requirements.txt file 
RUN pip install -r requirements.txt

#Copy the remaining files and the source code from the host folder to the app container working directory
COPY . .

# Expose the FastAPI application on port 8000 inside the container 
#EXPOSE 8000

# Start and run the FastAPI application container
#CMD ["uvicorn", "keylogging:app", "--host", "0.0.0.0"]