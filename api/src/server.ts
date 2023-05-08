import express, { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import TurndownService from 'turndown';

const app = express();

const port = 8080;

app.use(express.json());

app.get('/api', async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.status(400).send('Missing url parameter');
    return;
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    redirect: 'follow',
  });
  const html = await response.text();
  const { window } = new JSDOM(html);
  const { document } = window;

  const body = document.body;

  const tags = ['header', 'footer', 'style', 'script', 'noscript'];

  for (const tag of tags) {
    const elements = body.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      const parentNode = elements[i].parentNode;
      if (parentNode) {
        elements[i].parentNode?.removeChild(elements[i]);
      }
    }
  }

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(body.innerHTML);

  // We remove the contents of the parentheses
  // because we believe that they often contain URLs, supplementary information,
  // and other strings that are meaningless to ChatGPT.
  const trimmedMarkdown = markdown.replace(/\([^()]*\)/g, '');

  res.status(200).json({ markdown: trimmedMarkdown });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
