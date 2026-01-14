#!/usr/bin/env python3
"""
Mindbody API Documentation Scraper
Scrapes all API documentation from developers.mindbodyonline.com
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import os
import time
import re
from collections import deque
from datetime import datetime

class MindbodyDocsScraper:
    def __init__(self, output_dir="mindbody_docs"):
        self.base_url = "https://developers.mindbodyonline.com"
        self.output_dir = output_dir
        self.visited_urls = set()
        self.api_data = {
            "scraped_at": datetime.now().isoformat(),
            "base_url": self.base_url,
            "pages": [],
            "endpoints": [],
            "models": []
        }
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/pages", exist_ok=True)
        os.makedirs(f"{output_dir}/endpoints", exist_ok=True)
        
    def is_valid_url(self, url):
        """Check if URL belongs to the Mindbody developers site"""
        parsed = urlparse(url)
        return parsed.netloc in ["developers.mindbodyonline.com", ""]
    
    def normalize_url(self, url):
        """Normalize URL to avoid duplicates"""
        url = urljoin(self.base_url, url)
        parsed = urlparse(url)
        # Remove fragments and normalize
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
    
    def fetch_page(self, url, retries=3):
        """Fetch a page with retry logic"""
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except requests.RequestException as e:
                print(f"  Attempt {attempt + 1} failed for {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
        return None
    
    def extract_links(self, soup, current_url):
        """Extract all relevant links from a page"""
        links = set()
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            full_url = self.normalize_url(urljoin(current_url, href))
            if self.is_valid_url(full_url) and full_url not in self.visited_urls:
                # Filter to documentation-related paths
                if any(path in full_url for path in ["/api/", "/docs/", "/reference/", "/guide/", "/v5/", "/v6/"]):
                    links.add(full_url)
                elif full_url.startswith(self.base_url):
                    links.add(full_url)
        return links
    
    def extract_page_content(self, soup, url):
        """Extract structured content from a documentation page"""
        page_data = {
            "url": url,
            "title": "",
            "description": "",
            "content": "",
            "code_examples": [],
            "tables": [],
            "sections": []
        }
        
        # Extract title
        title = soup.find("h1") or soup.find("title")
        if title:
            page_data["title"] = title.get_text(strip=True)
        
        # Extract meta description
        meta_desc = soup.find("meta", {"name": "description"})
        if meta_desc:
            page_data["description"] = meta_desc.get("content", "")
        
        # Extract main content area
        main_content = (
            soup.find("main") or 
            soup.find("article") or 
            soup.find(class_=re.compile(r"content|documentation|api-docs", re.I)) or
            soup.find("div", {"role": "main"})
        )
        
        if main_content:
            # Extract text content
            page_data["content"] = main_content.get_text(separator="\n", strip=True)
            
            # Extract code examples
            for code_block in main_content.find_all(["code", "pre"]):
                code_text = code_block.get_text(strip=True)
                if len(code_text) > 20:  # Filter out small inline code
                    lang = code_block.get("class", [])
                    lang = [c for c in lang if "language-" in c or "lang-" in c]
                    page_data["code_examples"].append({
                        "language": lang[0] if lang else "unknown",
                        "code": code_text
                    })
            
            # Extract tables (often contain parameter info)
            for table in main_content.find_all("table"):
                table_data = []
                headers = [th.get_text(strip=True) for th in table.find_all("th")]
                for row in table.find_all("tr"):
                    cells = [td.get_text(strip=True) for td in row.find_all("td")]
                    if cells:
                        if headers:
                            table_data.append(dict(zip(headers, cells)))
                        else:
                            table_data.append(cells)
                if table_data:
                    page_data["tables"].append(table_data)
            
            # Extract sections with headers
            for header in main_content.find_all(["h2", "h3", "h4"]):
                section = {
                    "level": int(header.name[1]),
                    "title": header.get_text(strip=True),
                    "content": ""
                }
                # Get content until next header
                content_parts = []
                for sibling in header.find_next_siblings():
                    if sibling.name in ["h2", "h3", "h4"]:
                        break
                    content_parts.append(sibling.get_text(strip=True))
                section["content"] = "\n".join(content_parts)
                page_data["sections"].append(section)
        
        return page_data
    
    def extract_api_endpoint(self, soup, url):
        """Extract API endpoint information if this is an endpoint page"""
        endpoint_data = None
        
        # Look for common API endpoint patterns
        method_patterns = ["GET", "POST", "PUT", "DELETE", "PATCH"]
        
        # Check if page contains endpoint documentation
        content_text = soup.get_text()
        has_endpoint = any(method in content_text for method in method_patterns)
        
        if has_endpoint and ("/api/" in url or "/reference/" in url or "/v5/" in url or "/v6/" in url):
            endpoint_data = {
                "url": url,
                "method": "",
                "path": "",
                "description": "",
                "parameters": [],
                "request_body": "",
                "response": "",
                "examples": []
            }
            
            # Try to find method and path
            for method in method_patterns:
                pattern = re.compile(rf"{method}\s+(/[^\s<]+)", re.I)
                match = pattern.search(content_text)
                if match:
                    endpoint_data["method"] = method
                    endpoint_data["path"] = match.group(1)
                    break
            
            # Extract parameters from tables
            for table in soup.find_all("table"):
                headers = [th.get_text(strip=True).lower() for th in table.find_all("th")]
                if any(h in headers for h in ["parameter", "name", "field", "property"]):
                    for row in table.find_all("tr"):
                        cells = [td.get_text(strip=True) for td in row.find_all("td")]
                        if cells:
                            param = dict(zip(headers, cells)) if headers else {"raw": cells}
                            endpoint_data["parameters"].append(param)
            
            # Extract code examples
            for pre in soup.find_all("pre"):
                code = pre.get_text(strip=True)
                if code:
                    endpoint_data["examples"].append(code)
        
        return endpoint_data
    
    def save_page(self, page_data, filename):
        """Save page data to JSON file"""
        filepath = f"{self.output_dir}/pages/{filename}.json"
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(page_data, f, indent=2, ensure_ascii=False)
    
    def scrape(self, max_pages=500):
        """Main scraping method using BFS"""
        print(f"Starting scrape of {self.base_url}")
        print(f"Output directory: {self.output_dir}")
        print("-" * 50)
        
        # Start with the base URL and common documentation entry points
        start_urls = [
            self.base_url,
            f"{self.base_url}/api/",
            f"{self.base_url}/docs/",
            f"{self.base_url}/reference/",
            f"{self.base_url}/guides/",
            f"{self.base_url}/v5/",
            f"{self.base_url}/v6/",
        ]
        
        queue = deque(start_urls)
        pages_scraped = 0
        
        while queue and pages_scraped < max_pages:
            url = queue.popleft()
            normalized_url = self.normalize_url(url)
            
            if normalized_url in self.visited_urls:
                continue
            
            self.visited_urls.add(normalized_url)
            print(f"[{pages_scraped + 1}/{max_pages}] Scraping: {normalized_url}")
            
            html = self.fetch_page(normalized_url)
            if not html:
                print(f"  ❌ Failed to fetch")
                continue
            
            soup = BeautifulSoup(html, "html.parser")
            
            # Extract page content
            page_data = self.extract_page_content(soup, normalized_url)
            if page_data["content"]:
                self.api_data["pages"].append(page_data)
                
                # Create safe filename
                safe_name = re.sub(r'[^\w\-]', '_', urlparse(normalized_url).path)[:100]
                safe_name = safe_name.strip("_") or "index"
                self.save_page(page_data, f"{pages_scraped:04d}_{safe_name}")
            
            # Extract API endpoint info
            endpoint_data = self.extract_api_endpoint(soup, normalized_url)
            if endpoint_data and endpoint_data.get("path"):
                self.api_data["endpoints"].append(endpoint_data)
                print(f"  📡 Found endpoint: {endpoint_data['method']} {endpoint_data['path']}")
            
            # Find new links
            new_links = self.extract_links(soup, normalized_url)
            for link in new_links:
                if link not in self.visited_urls:
                    queue.append(link)
            
            pages_scraped += 1
            
            # Be polite - add delay between requests
            time.sleep(0.5)
        
        # Save complete data
        self.save_complete_data()
        
        print("-" * 50)
        print(f"✅ Scraping complete!")
        print(f"   Pages scraped: {len(self.api_data['pages'])}")
        print(f"   Endpoints found: {len(self.api_data['endpoints'])}")
        print(f"   Output directory: {self.output_dir}")
        
        return self.api_data
    
    def save_complete_data(self):
        """Save all scraped data to files"""
        # Save complete JSON
        with open(f"{self.output_dir}/complete_api_data.json", "w", encoding="utf-8") as f:
            json.dump(self.api_data, f, indent=2, ensure_ascii=False)
        
        # Save endpoints summary
        if self.api_data["endpoints"]:
            with open(f"{self.output_dir}/endpoints_summary.json", "w", encoding="utf-8") as f:
                json.dump(self.api_data["endpoints"], f, indent=2, ensure_ascii=False)
        
        # Save markdown summary
        self.save_markdown_summary()
    
    def save_markdown_summary(self):
        """Create a markdown summary of all documentation"""
        md_content = f"""# Mindbody API Documentation

Scraped from: {self.base_url}
Date: {self.api_data['scraped_at']}

## Summary
- Total pages scraped: {len(self.api_data['pages'])}
- API endpoints found: {len(self.api_data['endpoints'])}

## Endpoints

"""
        # Group endpoints by path prefix
        endpoints_by_category = {}
        for endpoint in self.api_data['endpoints']:
            path = endpoint.get('path', '')
            category = path.split('/')[1] if '/' in path else 'other'
            if category not in endpoints_by_category:
                endpoints_by_category[category] = []
            endpoints_by_category[category].append(endpoint)
        
        for category, endpoints in sorted(endpoints_by_category.items()):
            md_content += f"\n### {category.title()}\n\n"
            for ep in endpoints:
                md_content += f"- `{ep.get('method', 'GET')} {ep.get('path', '')}` - [Source]({ep.get('url', '')})\n"
        
        md_content += "\n## Pages Index\n\n"
        for page in self.api_data['pages']:
            title = page.get('title', 'Untitled')
            url = page.get('url', '')
            md_content += f"- [{title}]({url})\n"
        
        with open(f"{self.output_dir}/README.md", "w", encoding="utf-8") as f:
            f.write(md_content)


def main():
    print("=" * 60)
    print("MINDBODY API DOCUMENTATION SCRAPER")
    print("=" * 60)
    
    scraper = MindbodyDocsScraper(output_dir="mindbody_docs")
    
    # You can adjust max_pages based on how much you want to scrape
    data = scraper.scrape(max_pages=500)
    
    print("\nFiles created:")
    print(f"  - mindbody_docs/complete_api_data.json (all data)")
    print(f"  - mindbody_docs/endpoints_summary.json (endpoints only)")
    print(f"  - mindbody_docs/README.md (markdown summary)")
    print(f"  - mindbody_docs/pages/*.json (individual pages)")


if __name__ == "__main__":
    main()
