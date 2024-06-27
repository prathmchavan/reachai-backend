import { Request, Response } from 'express';
import Reply, { IReply, IReplies } from '../models/Reply';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ;


const createTag = async (req: Request, res: Response) => {
    const { emailId, emailContent, provider } = req.body;
  
    try {
      // Generate tag using OpenAI API
      const tag = await generateTag(emailContent);
  
      // Save reply with generated tag
      const reply = new Reply({
        provider,
        emailId,
        content: emailContent,
        tag,
        replies: [],
      });
  
      await reply.save();
  
      res.json({ tag });
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Error creating tag' });
    }
  };
  
  const generateTag = async (content: string): Promise<string> => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/classifications',
        {
          model: 'davinci-002', // Example model, adjust as per OpenAI API capabilities
          examples: [['email content', content]],
          labels: ['interested', 'not interested', 'more information'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
  
      const { data } = response;
      const { label } = data;
  
      return label;
    } catch (error) {
      console.error('Error generating tag from OpenAI:', error);
      throw new Error('Error generating tag');
    }
  };
  

const generateResponse = async (req: Request, res: Response) => {
  const { emailId, emailContent, provider, tag } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Generate a response for the email with tag ${tag}: ${emailContent}`,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const replyContent = response.data.choices[0].text;

    const reply = await Reply.findOne({ emailId, provider });
    if (reply) {
      reply.replies.push({ content: replyContent });
      await reply.save();
    }

    res.json({ replyContent });
  } catch (error : string | any) {
    res.status(500).json({ error: error.message });
  }
};

const listReplies = async (req: Request, res: Response) => {
  const { emailId, provider, tag } = req.body;

  try {
    const reply = await Reply.findOne({ emailId, provider, tag });

    if (reply) {
      res.json({ replies: reply.replies });
    } else {
      res.status(404).json({ error: 'No replies found' });
    }
  } catch (error : string | any) {
    res.status(500).json({ error: error.message });
  }
};

const getEmails = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  const { page } = req.query;

  // Logic to fetch emails from Gmail or Outlook using accessToken and page
//   const emails = []; // Placeholder for actual email fetching logic

//   res.json({ emails });
};

export { createTag, generateResponse, listReplies, getEmails };
