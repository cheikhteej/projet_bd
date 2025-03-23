import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

class DeepSeekLocal:
    def __init__(self, model_path="/deepseek_model"):
        """Charge le modèle DeepSeek en local."""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForCausalLM.from_pretrained(model_path).to(self.device)

    def generate_response(self, prompt):
        """Génère une réponse à partir d'un prompt."""
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)

        outputs = self.model.generate(inputs["input_ids"], max_length=512)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)


    def evaluate_sql_query(self, sql_query):
        """Évalue une requête SQL en utilisant DeepSeek."""
        prompt = f"Évalue cette requête SQL : {sql_query}"
        
        return self.generate_response(prompt)