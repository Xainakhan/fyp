flowchart TD

    A[👤 User Question\n(e.g., 'I have fever and headache')] --> B[🧠 Query Embedding\nSentenceTransformer MiniLM]

    B --> C[📚 ChromaDB Vector Search\nRetrieve Top-k Relevant Medical Docs]

    C --> D[📄 Retrieved Context\n(symptoms, diseases, precautions)]

    D --> E[🤖 LLM Generation (OpenAI GPT-4o-mini)\nContext + Question → Final Answer]

    E --> F[💬 Final Bot Response\n- Diagnosis suggestion\n- Explanation\n- Precautions\n- Next steps]

    %% Optional: Symptom Checker Flow
    A --> G{Did user type\n'medical symptoms'?}
    G -->|Yes| H[🩺 Symptom Parser\nExtract structured symptoms]
    G -->|No| A

    H --> I[📊 Symptom Logic / Local Rules\n(Fallback if backend offline)]
    I --> F
