#!/usr/bin/env python
import os
from pathlib import Path
from dotenv import load_dotenv

# Load from backend .env
env_file = Path('backend') / '.env'
load_dotenv(env_file)

key = os.getenv('GROQ_API_KEY')
if key:
    print(f'Key loaded: {key[:25]}...')
    try:
        from groq import Groq
        client = Groq(api_key=key)
        print('Groq client OK')
        
        response = client.chat.completions.create(
            model='mixtral-8x7b-32768',
            messages=[{'role': 'user', 'content': 'Say okay'}],
            max_tokens=20
        )
        print('SUCCESS!')
        print(response.choices[0].message.content)
    except Exception as e:
        print(f'ERROR: {e}')
else:
    print('Key not found')

