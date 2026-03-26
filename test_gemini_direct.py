import google.generativeai as genai

api_key = "AIzaSyBer1XKXqrOZk7nVEROAWcaj34EN2irJaQ"

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Classify this email as phishing or safe: Click here to verify account")
    print("SUCCESS! Gemini response:")
    print(response.text)
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
