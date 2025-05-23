import requests
from bs4 import BeautifulSoup
from DAO.recommended_books import add_book, clear_all_books

BASE_URL = "https://books.toscrape.com"

def scrape_books():
    try:
        clear_all_books()
        categories = get_categories()
        for category in categories:
            scrape_books_from_category(category['url'])
        return {"status": "success", "message": "Books scraped and stored successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_categories():
    response = requests.get(BASE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    category_list = soup.find('ul', class_='nav-list').find('ul').find_all('li')
    
    categories = []
    for li in category_list:
        a = li.find('a')
        categories.append({
            'name': a.text.strip(),
            'url': BASE_URL + '/' + a['href']
        })
    return categories

def scrape_books_from_category(category_url):
    while category_url:
        response = requests.get(category_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        books = soup.find_all('article', class_='product_pod')
        for book in books:
            title = book.h3.a['title']
            price_text = book.find('p', class_='price_color').text
            price = float(''.join(c for c in price_text if c.isdigit() or c == '.'))
            availability = book.find('p', class_='instock availability').text.strip()
            current_category = soup.find('div', class_='page-header').h1.text
            
            img_tag = book.find('img')
            img_relative_url = img_tag['src']
            img_url = BASE_URL + '/' + img_relative_url.replace('../', '')
            
            add_book(title, price, current_category, availability, img_url)
            
        next_button = soup.find('li', class_='next')
        if next_button:
            next_url = next_button.a['href']
            if 'catalogue' in category_url:
                base = category_url.split('catalogue')[0]
                category_url = base + next_url
            else:
                category_url = BASE_URL + '/catalogue/' + next_url
        else:
            category_url = None