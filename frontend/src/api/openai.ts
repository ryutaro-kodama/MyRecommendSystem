import axios from 'axios';

export const getEmbedding = async (text: string, apiKey: string): Promise<number[]> => {
    const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
            model: 'text-embedding-3-small',
            input: text,
            dimensions: 1024,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );
    return response.data.data[0].embedding;
};

export const describeImage = async (imageUrl: string, apiKey: string): Promise<string> => {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-5',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `画像の商品を日本語で詳しく説明してください。説明の形式は以下のJSON形式で出力してください。{'color': '商品の色', 'quantity': '商品の質感','genre': '商品のジャンル', 'description': 'その他商品の見た目の説明'}`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_completion_tokens: 2000,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );

    const content = response.data.choices[0].message.content;
    return content;
};
