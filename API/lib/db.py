import psycopg
from contextlib import contextmanager
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "autocommit": True
}

def get_connection():
    return psycopg.connect(**DB_CONFIG)

@contextmanager
def get_cursor():
    with get_connection() as conn:
        with conn.cursor() as cur:
            yield cur

def table_exists(table_name: str) -> bool:
    with get_cursor() as cur:
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = %s
            );
        """, (table_name,))
        return cur.fetchone()[0]

def create_tables_if_not_exist():
    tables_sql = {
        "department": """
            CREATE TABLE department (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                description VARCHAR(255)
            );
        """,
        "student": """
            CREATE TABLE student (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                department_id INT REFERENCES department(id) ON DELETE SET NULL,
                is_blocked BOOLEAN DEFAULT FALSE,
                about TEXT DEFAULT 'I am a student',
                create_at DATE DEFAULT CURRENT_DATE
            );
        """,
        "course": """
            CREATE TABLE course (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                description VARCHAR(255),
                level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
                duration VARCHAR(255)
            );
        """,
        "module": """
            CREATE TABLE module (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                course_id INT REFERENCES course(id) ON DELETE CASCADE
            );
        """,
        "lesson": """
            CREATE TABLE lesson (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                content TEXT,
                module_id INT REFERENCES module(id) ON DELETE CASCADE
            );
        """,
        "enrollment": """
            CREATE TABLE enrollment (
                course_id INT REFERENCES course(id) ON DELETE CASCADE,
                user_id INT REFERENCES student(id) ON DELETE CASCADE,
                last_lesson_id INT,
                last_activity_date DATE,
                enrollment_date DATE DEFAULT CURRENT_DATE,
                PRIMARY KEY (course_id, user_id)
            );
        """,
        "reports": """
            CREATE TABLE reports (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES student(id) ON DELETE CASCADE,
                subject VARCHAR(255),
                content TEXT,
                read BOOLEAN DEFAULT FALSE,
                date DATE DEFAULT CURRENT_DATE
            );
        """,
        "recommended_books": """
            CREATE TABLE recommended_books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                availability VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                img_url VARCHAR(255)
            );
        """,
    }

    for table_name, sql in tables_sql.items():
        if not table_exists(table_name):
            with get_cursor() as cur:
                cur.execute(sql)
                print(f"[DB] Created table: {table_name}")
        else:
            print(f"[DB] Table '{table_name}' already exists — skipping.")

def truncate_all_tables():
    tables = ["enrollment", "reports", "lesson", "module", "course", "student", "department"]
    with get_cursor() as cur:
        for table in tables:
            cur.execute(f"TRUNCATE TABLE {table} CASCADE;")
            print(f"[DB] Truncated table: {table}")
