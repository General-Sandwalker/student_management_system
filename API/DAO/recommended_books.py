from lib.db import get_cursor

def add_book(title, price, category, availability,img_url):
    with get_cursor() as cur:
        cur.execute(
            """
            INSERT INTO recommended_books (title, price, category, availability,img_url)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (title, price, category, availability,img_url)
        )
        return cur.fetchone()[0]

def get_book_by_id(book_id):
    with get_cursor() as cur:
        cur.execute(
            "SELECT * FROM recommended_books WHERE id = %s",
            (book_id,)
        )
        columns = [desc[0] for desc in cur.description]
        row = cur.fetchone()
        return dict(zip(columns, row)) if row else None

def get_all_books(category=None, price_min=None, price_max=None):
    query = "SELECT * FROM recommended_books"
    conditions = []
    params = []
    
    if category:
        conditions.append("category = %s")
        params.append(category)
    if price_min is not None:
        conditions.append("price >= %s")
        params.append(price_min)
    if price_max is not None:
        conditions.append("price <= %s")
        params.append(price_max)
        
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
        
    query += " ORDER BY title"
    
    with get_cursor() as cur:
        cur.execute(query, params)
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]

def clear_all_books():
    with get_cursor() as cur:
        cur.execute("TRUNCATE TABLE recommended_books RESTART IDENTITY CASCADE")