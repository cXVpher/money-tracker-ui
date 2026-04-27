## Budget Tracker UI

Frontend for a budget tracking app built with Next.js, TypeScript, Tailwind CSS, and `pnpm`.

## How To Run

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Other Commands

Run lint:

```bash
pnpm lint
```

Create a production build:

```bash
pnpm build
```

Run the production server after building:

```bash
pnpm start
```

## Notes

- Main app code lives in `src/app`.
- The main landing page is `src/app/page.tsx`.
- This project loads fonts through `next/font/google`, so `pnpm build` needs network access to fetch those fonts unless they are vendored locally.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
