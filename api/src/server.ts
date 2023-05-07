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

  const response = await fetch(url);
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

  const markdownUrlRegex = /\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;
  const trimmedMarkdown = markdown.replace(markdownUrlRegex, '[$1]()');

  res.status(200).json({ markdown: trimmedMarkdown });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
