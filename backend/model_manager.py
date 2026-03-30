from flask import current_app
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, AutoConfig
import gc

class ModelManager:
    """Manages the loading and unloading of ML models."""
    
    def __init__(self):
        self.models = {}
        self.tokenizers = {}
        
    def get_model_and_tokenizer(self, model_path: str, model_name: str, huggingface_model: str):
        """Get or load a model and its tokenizer."""
        if model_name in self.models and model_name in self.tokenizers:
            return self.models[model_name], self.tokenizers[model_name]
            
        model, tokenizer = self._load_model(model_path, model_name, huggingface_model)
        self.models[model_name] = model
        self.tokenizers[model_name] = tokenizer
        return model, tokenizer
        
    def _load_model(self, model_path: str, model_name: str, huggingface_model: str):
        """Load a model and its tokenizer with proper memory management."""
        try:
            # Clear CUDA cache first
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                
            # Clear some memory
            gc.collect()
            
            # Load tokenizer first
            tokenizer = AutoTokenizer.from_pretrained(
                model_path,
                model_max_length=512,
                padding_side="right",
                truncation=True
            )
            
            # Load model with memory optimization
            config = AutoConfig.from_pretrained(model_path)
            model = AutoModelForSeq2SeqLM.from_pretrained(
                model_path,
                config=config,
                torch_dtype=torch.float16,  # Use half precision
                device_map="auto",  # Automatically handle device placement
                low_cpu_mem_usage=True
            )
            
            # Put model in eval mode
            model.eval()
            
            return model, tokenizer
            
        except Exception as e:
            current_app.logger.error(f"Error loading model {model_name}: {str(e)}")
            # Try loading from HuggingFace as fallback
            try:
                tokenizer = AutoTokenizer.from_pretrained(huggingface_model)
                model = AutoModelForSeq2SeqLM.from_pretrained(
                    huggingface_model,
                    torch_dtype=torch.float16,
                    device_map="auto",
                    low_cpu_mem_usage=True
                )
                model.eval()
                return model, tokenizer
            except Exception as e2:
                current_app.logger.error(f"Fallback failed for {model_name}: {str(e2)}")
                raise
                
    def clear_model(self, model_name: str):
        """Clear a specific model from memory."""
        if model_name in self.models:
            del self.models[model_name]
        if model_name in self.tokenizers:
            del self.tokenizers[model_name]
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        gc.collect()
        
    def clear_all(self):
        """Clear all models from memory."""
        self.models.clear()
        self.tokenizers.clear()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        gc.collect()