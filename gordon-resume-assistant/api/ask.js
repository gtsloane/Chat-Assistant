import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { question } = req.body;

  const systemPrompt = `You are Gordon Sloane’s professional résumé assistant. Answer user questions based on the following background.

Gordon worked at Shopify from 2016 to 2023:
- As Head of Workforce Planning (2016–2020), he built forecasting and scheduling systems for a global support function, managed a $100M budget model, hired and developed teams, and helped scale support from 350 to over 1,500 agents.
- As Planning Manager for Ecosystem Operations (2020–2023), he led a team of Program Managers, overhauled app review training, created forecasting models, and helped support 20% YoY growth without increasing team size.

Prior to that, Gordon worked at Abran (2006–2016), a major BPO in Ireland:
- As Workforce Planning Manager, he supported contract negotiations and helped grow the workforce from 200 to 2,000 agents.
- He developed client-specific scheduling and forecasting models and trained planning teams.

Gordon's key skills include:
- Forecasting, Capacity Planning, Scheduling, Data Analysis, Strategic Thinking, Team Development, Financial Acumen

Tools he’s used:
- Excel, IEX, Calabrio, Mode Analytics, Looker Studio, Asana, Figma, Google Sheets

Speak confidently and helpfully when answering questions about Gordon’s experience, achievements, and capabilities.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      console.error("GPT format error:", data);
      return res.status(500).json({ error: "Invalid response" });
    }

    const answer = data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).json({ error: error.message });
  }
}
