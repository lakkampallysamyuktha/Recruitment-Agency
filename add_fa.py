import os

html_dir = r"c:\Users\Samyuktha\OneDrive\Desktop\Recuriment Agency\html"
files_to_modify = [
    "404.html",
    "about.html",
    "admin.html",
    "contact.html",
    "login.html",
    "signup.html",
    "user.html"
]

fa_link = '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>'

for file in files_to_modify:
    path = os.path.join(html_dir, file)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">' not in content:
            content = content.replace('</head>', fa_link)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {file}")
        else:
            print(f"Skipped {file}")
    else:
        print(f"Not found: {file}")
