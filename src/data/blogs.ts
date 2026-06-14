export interface ContentBlock {
  type: 'intro' | 'heading' | 'paragraph' | 'numbered_list' | 'code';
  text?: string;
  items?: { title: string; text: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  content?: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'choosing-what-to-build',
    title: 'What to Build: The Best Idea Is the Problem You Already Have',
    excerpt: 'The secret to your first great project is not finding the right problem of the world — it is solving a problem of your own.',
    author: 'OmG.',
    date: 'March 15, 2026',
    category: 'Building',
    image: '/blog_whattobuild.png',
    content: [
      {
        type: 'intro',
        text: 'When you are just starting out and want to make your first project — something nice, something useful, something that actually solves a problem for society — the instinct is to go hunting for the big problems the world is facing. But here is the secret: the idea is not to find the right problem of the world. The idea is to solve a problem of your own.',
      },
      {
        type: 'heading',
        text: 'Start with your own problem',
      },
      {
        type: 'paragraph',
        text: 'Instead of looking at the problems society is facing, look at the problems you are facing. Then build a kick-ass solution for it — a solution that genuinely helps you a lot with the exact thing you were struggling with. When the user is you, you know precisely what good looks like.',
      },
      {
        type: 'heading',
        text: 'You are not that special — and that is great news',
      },
      {
        type: 'paragraph',
        text: 'Here is the thing: you are no one special for facing the issue. There are already thousands of people facing the same issue. The only question is who takes the initiative to build the solution for it. If no one has stepped up yet, this is your golden chance. And even if someone already has — build a better one. The market always has space for new.',
      },
      {
        type: 'numbered_list',
        items: [
          {
            title: 'Solve your problem',
            text: 'Build the solution you personally need. You understand the pain better than any market report could explain it.',
          },
          {
            title: 'You just solved it for the world',
            text: 'By solving a problem of your own, you have actually built a solution for the thousands of people facing the same thing. Now it is only about making the product better and getting it to people.',
          },
          {
            title: 'You will refuse to compromise',
            text: 'If you were building it for someone else, you might cut corners and rush to finish. But when you build for yourself, the standard is always: I will make the best one.',
          },
        ],
      },
      {
        type: 'heading',
        text: 'The bottom line',
      },
      {
        type: 'paragraph',
        text: 'Don’t wait for the perfect world-changing idea. Look at what frustrates you today, build the best possible fix for it, and you will have accidentally built something the whole world needed. The rest is just making it better and putting it in front of people.',
      },
    ],
  },
  {
    id: '2',
    slug: 'react-performance-optimization',
    title: 'The CTO Prompt: Plan Before You Build',
    excerpt: 'Before handing your idea to an AI coding agent, use this prompt template to think like a CTO and generate a clear masterplan for your app.',
    author: 'OmG.',
    date: 'April 2, 2026',
    category: 'AI & Building',
    image: '/cto%20prompt%20blog%20image%20.png',
    content: [
      {
        type: 'intro',
        text: 'Instead of directly jumping to your AI agent with your problem and telling it to blindly make the project, make sure you have a good understanding about what you actually want to build and a plan of steps for the same. This prompt template helps you with exactly that.',
      },
      {
        type: 'heading',
        text: 'How to use it',
      },
      {
        type: 'numbered_list',
        items: [
          {
            title: 'Paste this prompt inside ChatGPT',
            text: 'Drop the template below into ChatGPT to kick off the planning conversation.',
          },
          {
            title: 'Answer its questions',
            text: 'It will ask you multiple questions regarding your project, your idea, your audience, the features you want, and many more.',
          },
          {
            title: 'Get your masterplan',
            text: 'Like a professional CTO, it will generate a masterplan.md file that we can then give to our AI coding agent — and it will generate a much better version of the application.',
          },
        ],
      },
      {
        type: 'heading',
        text: 'The prompt template',
      },
      {
        type: 'code',
        text: `You are a professional CTO who is very friendly and supportive. Your task is to help a developer understand and plan their app idea through a series of questions. Follow these instructions:

Begin by explaining to the developer that you'll be asking them a series of questions to understand their app idea at a high level, and that once you have a clear picture, you'll generate a comprehensive masterplan.md file as a blueprint for their application.

Ask questions one at a time in a conversational manner. Use the developer's previous answers to inform your next questions.

Your primary goal (70% of your focus) is to fully understand what the user is trying to build at a conceptual level. The remaining 30% is dedicated to educating the user about available options and their associated pros and cons.

When discussing technical aspects (e.g., choosing a database or framework), offer high-level alternatives with pros and cons for each approach. Always provide your best suggestion along with a brief explanation of why you recommend it, but keep the discussion conceptual rather than technical.

Be proactive in your questioning. If the user's idea seems to require certain technologies or services (e.g., image storage, real-time updates), ask about these even if the user hasn't mentioned them.

Try to understand the 'why' behind what the user is building. This will help you offer better advice and suggestions.

Ask if the user has any diagrams or wireframes of the app they would like to share or describe to help you better understand their vision.

Remember that developers may provide unorganized thoughts as they brainstorm. Help them crystallize the goal of their app and their requirements through your questions and summaries.

Cover key aspects of app development in your questions, including but not limited to: • Core features and functionality • Target audience • Platform (web, mobile, desktop) • User interface and experience concepts • Data storage and management needs • User authentication and security requirements • Potential third-party integrations • Scalability considerations • Potential technical challenges

After you feel you have a comprehensive understanding of the app idea, inform the user that you'll be generating a masterplan.md file.

Generate the masterplan.md file. This should be a high-level blueprint of the app, including: • App overview and objectives • Target audience • Core features and functionality • High-level technical stack recommendations (without specific code or implementation details) • Conceptual data model • User interface design principles • Security considerations • Development phases or milestones • Potential challenges and solutions • Future expansion possibilities

Present the masterplan.md to the user and ask for their feedback. Be open to making adjustments based on their input.

Important: Do not generate any code during this conversation. The goal is to understand and plan the app at a high level, focusing on concepts and architecture rather than implementation details.

Remember to maintain a friendly, supportive tone throughout the conversation. Speak plainly and clearly, avoiding unnecessary technical jargon unless the developer seems comfortable with it. Your goal is to help the developer refine and solidify their app idea while providing valuable insights and recommendations at a conceptual level.

Begin the conversation by introducing yourself and asking the developer to describe their app idea.`,
      },
    ],
  },
  {
    id: '3',
    slug: 'mastering-tailwind-css',
    title: 'Mastering Tailwind CSS',
    excerpt: 'Deep dive into Tailwind CSS and learn how to build complex layouts quickly.',
    author: 'Jane Smith',
    date: 'April 10, 2026',
    category: 'CSS',
    image: 'https://picsum.photos/800/602',
  },
  {
    id: '4',
    slug: 'typescript-best-practices',
    title: 'TypeScript Best Practices',
    excerpt: 'Essential TypeScript patterns and best practices for writing maintainable code.',
    author: 'BuildC3 Team',
    date: 'April 18, 2026',
    category: 'TypeScript',
    image: 'https://picsum.photos/800/603',
  },
  {
    id: '5',
    slug: 'nodejs-express-guide',
    title: 'Building with Node.js and Express',
    excerpt: 'A practical guide to building robust backend APIs with Node.js and Express.',
    author: 'Alex Johnson',
    date: 'May 1, 2026',
    category: 'Backend',
    image: 'https://picsum.photos/800/604',
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(b => b.slug === slug);
}
