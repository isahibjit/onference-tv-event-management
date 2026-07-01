import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const events = [
    {
      eventName: 'Future of Frontend Frameworks',
      eventDate: new Date('2026-08-15T10:00:00Z'),
      speakerName: 'Sarah Jenkins',
      speakerDesignation: 'Principal Engineer, Vercel',
      description: 'An in-depth look at how React Server Components are changing the way we build web applications.',
      speakerIntro: 'Sarah Jenkins is a core team member of Next.js and has over 10 years of experience building scalable frontend architectures.',
    },
    {
      eventName: 'AI in Enterprise SaaS',
      eventDate: new Date('2026-09-01T14:00:00Z'),
      speakerName: 'Dr. Alan Turing',
      speakerDesignation: 'Head of AI, OpenAI',
      description: 'Exploring the practical applications of large language models in B2B software products.',
      speakerIntro: 'Dr. Turing leads the applied AI research group and specializes in generative models for enterprise workflows.',
    },
    {
      eventName: 'Mastering Prisma and Postgres',
      eventDate: new Date('2026-09-20T11:00:00Z'),
      speakerName: 'David Kim',
      speakerDesignation: 'Senior Backend Engineer, Stripe',
      description: 'Best practices for optimizing database queries, handling migrations, and scaling relational data.',
      speakerIntro: 'David Kim has scaled database infrastructure at Stripe for millions of concurrent users.',
    }
  ];

  // Clear existing events
  await prisma.event.deleteMany();
  console.log('Cleared existing events.');

  // Insert seed data
  for (const event of events) {
    const createdEvent = await prisma.event.create({
      data: event,
    });
    console.log(`Created event with id: ${createdEvent.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
