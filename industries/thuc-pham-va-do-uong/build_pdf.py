import os
import sys
import subprocess
import asyncio

def install_package(package, pip_name=None):
    if pip_name is None:
        pip_name = package
    try:
        __import__(package)
    except ImportError:
        print(f"Installing {pip_name}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])

# Make sure playwright is installed
install_package("playwright")

# Install playwright browser binaries if they are not present
try:
    print("Checking/installing Playwright Chromium browser...")
    subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
except Exception as e:
    print(f"Playwright browser installation warning: {e}")

from playwright.async_api import async_playwright

async def generate_pdf():
    root_dir = r"d:\T&TVina\Campain\F&B"
    html_path = os.path.join(root_dir, "build_pdf_brochure.html")
    pdf_path = os.path.join(root_dir, "f&b_hygienic_cabling_murrplastik.pdf")
    
    if not os.path.exists(html_path):
        print(f"Error: HTML brochure template not found at {html_path}")
        return
        
    print(f"Opening HTML file: {html_path}")
    
    async with async_playwright() as p:
        # Launch headless browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Load the HTML file using absolute file:// URI
        file_url = f"file:///{html_path.replace(os.sep, '/')}"
        await page.goto(file_url, wait_until="networkidle")
        
        # Wait a small duration to ensure fonts and images are fully rendered
        await page.wait_for_timeout(2000)
        
        print(f"Printing to PDF: {pdf_path}")
        try:
            # Print page as PDF with 16:9 dimensions matching the CSS
            await page.pdf(
                path=pdf_path,
                print_background=True,
                prefer_css_page_size=True
            )
            print(f"PDF successfully generated and saved to: {pdf_path}")
        except PermissionError:
            alternative_path = os.path.join(root_dir, "f&b_hygienic_cabling_murrplastik_updated.pdf")
            print(f"Warning: {pdf_path} is locked/open. Saving alternative to: {alternative_path}")
            await page.pdf(
                path=alternative_path,
                print_background=True,
                prefer_css_page_size=True
            )
            print(f"PDF successfully generated and saved to: {alternative_path}")
        
        await browser.close()
    
    print(f"PDF successfully generated and saved to: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(generate_pdf())
