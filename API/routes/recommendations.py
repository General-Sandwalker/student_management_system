from fastapi import APIRouter, Query, HTTPException
from DAO.recommended_books import get_all_books
from lib.scraper import scrape_books

router = APIRouter()

@router.post("/scrape")
async def scrape_books_route():
    result = scrape_books()
    if result['status'] == 'error':
        raise HTTPException(status_code=500, detail=result['message'])
    return {"message": "Books scraped and stored successfully"}

@router.get("/")
async def get_recommendations(
    category: str = Query(None, description="Filter by category"),
    price_min: float = Query(None, description="Minimum price filter"),
    price_max: float = Query(None, description="Maximum price filter")
):
    books = get_all_books(category, price_min, price_max)
    return {"books": books}