FROM python:3.12.3-alpine

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=kratosuniversity \
    DB_USER=user \
    DB_PASSWORD=password \
    SECRET_KEY=Ju15FVCXV9aB3dE7gH2kLmNpQrStUvWx \
    GROQ_API_KEY=your_groq_api_key

# Command to run the FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
