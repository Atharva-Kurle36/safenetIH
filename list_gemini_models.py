import google.generativeai as genai

api_key = "AIzaSyBer1XKXqrOZk7nVEROAWcaj34EN2irJaQ"

try:
    genai.configure(api_key=api_key)
    models = genai.list_models()
    print("Available models:")
    for model in models:
        print(f"  - {model.name}")
        if hasattr(model, 'supported_generation_methods'):
            print(f"    Methods: {model.supported_generation_methods}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
