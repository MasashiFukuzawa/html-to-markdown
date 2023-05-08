import { exec } from 'child_process';
import express, { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const app = express();
const port = 8080;

app.use(express.json());

const curlRequest = (url: string): Promise<string> => {
  return new Promise((resolve, _) => {
    exec(`curl -sS -L ${url.trim()}`, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      if (stderr) {
        throw new Error(stderr);
      }
      resolve(stdout);
    });
  });
};

const removeTags = (body: HTMLElement, tags: string[]) => {
  for (const tag of tags) {
    const elements = body.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      const parentNode = elements[i].parentNode;
      if (parentNode) {
        elements[i].parentNode?.removeChild(elements[i]);
      }
    }
  }
};

const removeParenthesesContents = (text: string): string => {
  return text.replace(/\([^()]*\)/g, '');
};

app.get('/api', async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.status(400).send('Missing url parameter');
    return;
  }

  const html = await curlRequest(url);
  console.log(`Result: ${html}`);

  const { window } = new JSDOM(html);
  const { document } = window;
  const body = document.body;

  const tags = ['header', 'footer', 'style', 'script', 'noscript'];
  removeTags(body, tags);

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(body.innerHTML);

  const trimmedMarkdown = removeParenthesesContents(markdown);

  res.status(200).json({ markdown: trimmedMarkdown });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
