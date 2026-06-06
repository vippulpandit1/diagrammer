import os
import datetime
from anthropic import Anthropic

# Configuration
SOURCE_FILE = "../../src/app.py"
OUTPUT_FILE = "tests/test_app.py"

def run_automated_test_gen():
    with open(SOURCE_FILE, "r") as f:
        code = f.read()

    prompt = f"""
    <system>You are an automated code quality agent.</system>
    <instructions>Generate a test suite targeting 100% code coverage.</instructions>
    <source_code>{code}</source_code>
    """

    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    message = client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extract code between <test_suite> tags and save it
    response_text = message.content[0].text
    test_code = response_text.split("<test_suite>")[1].split("</test_suite>")[0].strip()
    
    with open(OUTPUT_FILE, "w") as f:
        f.write(test_code)

if __name__ == "__main__":
    run_automated_test_gen()
