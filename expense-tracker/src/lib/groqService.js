export const parseInvoiceWithGroq = async (imageBase64DataUrl) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GROQ_API_KEY in .env file");
  }

  const prompt = `You are a strict financial OCR assistant extracting invoice details.
Find the final "Grand Total". CRITICAL RULE: If there is a subtotal and GST/taxes/fees, you MUST return the absolute final total after all additions. Do NOT return the subtotal.
Do NOT itemize single entries, I only want the overall final expense total.

Extract the following:
- date: The date on the invoice (formatting: YYYY-MM-DD if possible).
- category: Pick ONLY ONE of these exactly: 'Food & Drink', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Education', 'Other'.
- amount: The final grand total numeric value (e.g., 104.50). Only numbers and decimals.
- currency: The recognized standard currency code (e.g. INR, USD, EUR, GBP, JPY).
- note: The name of the vendor, store, or place the invoice is from.

Return ONLY a valid JSON object matching this schema perfectly format:
{
  "date": "2024-11-20",
  "category": "Food & Drink",
  "amount": 104.5,
  "currency": "USD",
  "note": "Starbucks"
}
Do NOT include any extra conversational text, markdown formatting blocks like \`\`\`json, or explanations outside the JSON block. Return just the JSON string perfectly formatted.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64DataUrl
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API Error: ${err}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Strip markdown formatting if the model disobeys
    if (content.startsWith("\`\`\`json")) {
      content = content.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (content.startsWith("\`\`\`")) {
      content = content.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    return JSON.parse(content);

  } catch (error) {
    console.error("OCR parsing failed:", error);
    throw error;
  }
};
