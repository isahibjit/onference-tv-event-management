import { prisma } from '../lib/prisma';
import { EventInput } from '../validators/event.validator';
import { env } from '../config/env';

export const getEvents = async () => {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
  });
};

export const createEvent = async (data: EventInput) => {
  return prisma.event.create({
    data: {
      ...data,
      eventDate: new Date(data.eventDate),
    },
  });
};

export const updateEvent = async (id: string, data: EventInput) => {
  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      eventDate: new Date(data.eventDate),
    },
  });
};

export const deleteEvent = async (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};

export const generateContent = async (id: string, clientApiKey?: string, clientAiModel?: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return null;

  let description = '';
  let speakerIntro = '';

  const finalApiKey = clientApiKey || env.GEMINI_API_KEY;
  const finalModel = clientAiModel || 'gemini-pro';

  if (finalApiKey && (env.AI_PROVIDER === 'gemini' || !env.AI_PROVIDER)) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(finalApiKey);
      const model = genAI.getGenerativeModel({ model: finalModel });

      const descPrompt = `Write an engaging and professional event description for an event named "${event.eventName}". The tone should be Professional. The length should be Medium. The speaker is ${event.speakerName} (${event.speakerDesignation}). Make it sound like a premium industry event.`;
      const descResult = await model.generateContent(descPrompt);
      description = descResult.response.text();

      const introPrompt = `Write a professional speaker introduction for ${event.speakerName}, who is a ${event.speakerDesignation}. They are speaking at the event "${event.eventName}". Highlight their expertise and why attendees should listen to them.`;
      const introResult = await model.generateContent(introPrompt);
      speakerIntro = introResult.response.text();
    } catch (error: any) {
      console.error('Gemini generation failed:', error);
      if (error?.message) {
        throw error;
      }
      // Fallback
      description = `Join us for an insightful session on ${event.eventName}. In this comprehensive talk, our expert speaker will explore the latest trends.`;
      speakerIntro = `We are thrilled to introduce ${event.speakerName}, a highly respected ${event.speakerDesignation}.`;
    }
  } else if (env.OPENAI_API_KEY && env.AI_PROVIDER === 'openai') {
    description = `Join us for an insightful session on ${event.eventName}. In this comprehensive talk, our expert speaker will explore the latest trends, best practices, and innovative strategies shaping the future of the industry. This is a must-attend event for professionals looking to stay ahead of the curve.

During this session, attendees will gain actionable insights and practical knowledge that can be immediately applied to their work. Whether you are a seasoned veteran or new to the field, the content is designed to be accessible and highly valuable.

Don't miss this opportunity to connect with peers, ask questions, and learn from one of the best in the business. We look forward to welcoming you!`;
    speakerIntro = `We are thrilled to introduce ${event.speakerName}, a highly respected ${event.speakerDesignation}. With a wealth of experience and a track record of success, ${event.speakerName} brings a unique perspective and deep expertise to the topic. Prepare to be inspired by their engaging delivery and profound insights.`;
  } else {
    // Deterministic local placeholder
    description = `[AI Placeholder]: Join us for an insightful session on ${event.eventName}. In this comprehensive talk, our expert speaker will explore the latest trends, best practices, and innovative strategies shaping the future of the industry.

During this session, attendees will gain actionable insights and practical knowledge that can be immediately applied to their work.

Don't miss this opportunity to connect with peers, ask questions, and learn from one of the best in the business.`;
    speakerIntro = `[AI Placeholder]: We are thrilled to introduce ${event.speakerName}, a highly respected ${event.speakerDesignation}. With a wealth of experience, ${event.speakerName} brings a unique perspective and deep expertise.`;
  }

  return prisma.event.update({
    where: { id },
    data: {
      description,
      speakerIntro,
    },
  });
};
