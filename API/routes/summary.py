from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from DAO.recommended_books import get_book_by_id
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
import os
from dotenv import load_dotenv

load_dotenv()

# Modèle de réponse
class SummaryResponse(BaseModel):
    summary_text: str

# Route
router = APIRouter()

@router.get("/{book_id}", response_model=SummaryResponse)
def generate_book_summary(book_id: int):

    book = get_book_by_id(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    prompt_text = (
        f"Generate an engaging and fun summary for the book titled '{book['title']}' using emojis and modern language. 🌟 "
        f"This book falls into the '{book['category']}' category 📚. "
        f"Create a vibrant description that will grab readers' attention, using emojis where appropriate! "
        f"The book is currently {book['availability']} ✨ and costs {book['price']} 💰. "
        f"Write 2-3 entertaining paragraphs that capture the essence of this {book['category']} book, "
        f"making it sound exciting and unmissable! Include at least 5 relevant emojis throughout the summary. "
        f"Make sure the tone is friendly and engaging! 🎯"
    )

    # Initialiser le LLM (Groq dans cet exemple)
    llm = ChatGroq(
        temperature=0.7,
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama3-70b-8192"
    )

    # Créer la chaîne de traitement
    prompt = PromptTemplate.from_template("{text}")
    chain = prompt | llm | RunnablePassthrough()

    # Exécuter
    result = chain.invoke({"text": prompt_text})

    return SummaryResponse(summary_text=result.content)