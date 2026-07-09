import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    replacements = {
        "localStorage.getItem('access_token')": "sessionStorage.getItem('access_token')",
        "localStorage.getItem('refresh_token')": "sessionStorage.getItem('refresh_token')",
        "localStorage.getItem('user_data')": "sessionStorage.getItem('user_data')",
        "localStorage.setItem('access_token'": "sessionStorage.setItem('access_token'",
        "localStorage.setItem('refresh_token'": "sessionStorage.setItem('refresh_token'",
        "localStorage.setItem('user_data'": "sessionStorage.setItem('user_data'",
        "localStorage.removeItem('access_token')": "sessionStorage.removeItem('access_token')",
        "localStorage.removeItem('refresh_token')": "sessionStorage.removeItem('refresh_token')",
        "localStorage.removeItem('user_data')": "sessionStorage.removeItem('user_data')",
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def main():
    src_dir = r"c:\Users\madhan\OneDrive\Desktop\praveenelectro world\frontend\src"
    
    # Search for all js and jsx files
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.js') or file.endswith('.jsx'):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
