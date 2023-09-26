# Thesis Money Mapper

## Creating the Project

### Initializing the Project

The easiest way to create a Next.js 13 app is by using `create-next-app` ([Next.js 2023](https://nextjs.org/docs/pages/api-reference/create-next-app)).

Open a new terminal window and run the command below. This command will ensure that you initialize your project using the latest version of Next.js.

```shell
npx create-next-app@latest
```

After running this you will be asked the following prompts:

1. Name your project
2. Select "Yes" to use TypeScript
3. Select "Yes" to use ESLint
4. Select "Yes" to use Tailwind CSS
5. Select "No" to omit the usage of the `src/` directory
6. Select "Yes" to use the newer App Router of Next.js
7. Optional but recommended select "Yes" to customize you default import alias

```shell
What is your project named?  thesis-money-mapper
Would you like to use TypeScript?  No / Yes
Would you like to use ESLint?  No / Yes
Would you like to use Tailwind CSS?  No / Yes
Would you like to use `src/` directory?  No / Yes
Would you like to use App Router? (recommended)  No / Yes
Would you like to customize the default import alias?  No / Yes
```

When you are done with the prompts the required dependencies will be installed and the project will get initialized. This process typically takes only a few seconds.

Next `cd` into your project and run the following command `code .` to open the project in Visual Studio Code. Alternatively you can open the project using your operating systems GUI.

---

### Cleaning Up

When setting up a Next.js project, the initial codebase will typically include some boilerplate code that is not necessary for your application.

#### Css

Start by deleting everything except the tailwind specific configuration code from `app/globals.css`.

```css
/* app/globals.css (keep these lines) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Tailwind Config

Next modify the tailwind config in `tailwind.config.js` by assigning the `theme` key to an empty object and remove `'./pages/**/*.{js,ts,jsx,tsx,mdx}'` from the `content` array since the app router does not use a pages directory.

Your config section should look something like this.

```typescript
// tailwind.config.js
const config: Config = {
	content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {},
	plugins: [],
};
```

#### Landing Page

In `app/page.tsx` remove all the boilerplate `jsx` inside of the `main` tag and remove its className. Additionally, eliminate all unused import statements.

```jsx
// app/page.tsx
<main>
	<p>Hello World!</p>
</main>
```

#### Root Layout

Replace the default metadata in the root layout of the project.

```jsx
// app/layout.tsx
export const metadata: Metadata = {
	title: 'Money Mapper',
	description: 'Take control of your finances with Money Mapper, ...',
};
```

#### .env File

In the root of your project create an `.env` file for storing the projects environment variables. Finally, include an exception for the `.env` file in the `.gitignore` to prevent the accidental inclusion of sensitive data in your project's version control (git).

```.gitignore
# .gitignore
.env
```

---

### Version Control

When working on web applications or any project, it's crucial to use a version control tool like Git. Git commits should be made in concise, modular steps to facilitate easy tracking and potential future changes. You can save your changes using the following commands:

```shell
# this is optional
git status
git add .
git commit -m "Initialized application"
```

1. `git status`: This command is optional but often used to check the current status of your Git repository. It provides information about which files have been modified and are ready to be committed (staged), which files are not yet tracked by Git, and other relevant information about the repository's state.

2. `git add .`: This command stages all the changes in your working directory for the next commit. The . represents the current directory, so it stages all the changes in the current directory and its subdirectories. This step prepares your changes to be included in the upcoming commit.

3. `git commit -m "Initialized application"`: This command creates a new commit with a descriptive message. The -m flag is used to specify a commit message enclosed in double quotes. The commit message should briefly describe the changes or the purpose of the commit. In this example, the commit message is "Initialized application," which suggests that this commit marks the initial setup of the project.

Alternatively, you can perform these steps using the Visual Studio Code's user interface (UI). This process should be carried out whenever you believe the project needs to be saved or when a feature is complete.

---

### Creating a MongoDB Database

This app uses a MongoDB database. To create a database login or create an account at [account.mongodb.com/account/login](https://account.mongodb.com/account/login).

Next create a new project. After that, create a new database from your projects dashboard. While configuring the database create a new database user (this is used to connect with the db Prisma later).

---

### Connecting to the Database with Prisma

#### Database Connection String

In the root of the project create a new `.env` file (make sure that you have an entry for it in the `.gitignore` file so you dont accidentally leak sensitive data from your app).

In your MongoDB dashboard select "Connect" to prompt a connect modal. From the UI select "MongoDB for VS Code" this will generate the correct `DATABASE_URL` for your `.env` file.

Copy the connection string provided to you by MongoDB and at it to your `.env` file:

```
DATABASE_URL=mongodb+srv://<USERNAME>:<PASSWORD>@<HOST>/<DATABASE_NAME>
```

Modify the connection string with your own configurations from your database.

#### Insalling Prisma

This app connects to the database using Prisma ORM. To start using Prisma add the Prisma CLI as a development dependency to your project: ([Prisma docs](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/mongodb-typescript-mongodb))

```shell
npm install prisma --save-dev
```

You can now invoke the Prisma CLI by prefixing it with npx:

```shell
npx prisma
```

Next, set up your Prisma project by creating your Prisma schema file template with the following command:

```shell
npx prisma init
```

This command will auto generate a [schema.prisma file](prisma\schema.prisma) in in `prisma\schema.prisma`.

#### Initialize the Prisma Schema

By default, the generated `schema.prisma` file will have its `provider` set to `postgresql`. Since the app uses MongoDB as its database, replace the providers value to `mongodb`:

```
datasource db {
  provider = "mongodb" <--
  url      = env("DATABASE_URL")
}
```

The value for the `url` is fetched from your `.env` file.

This app has user authentication and the ability to record users financial data. Users and their financial records are saved to the database, so their respective Prisma models must be defined.

These models auto-generate types for our application based on the models structure. Additionally, the `User` and `Account` models include fields for `next-auth`'s Prisma adapter which will be used when authenticating users later on.

#### Users model

```prisma
model User {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  email          String    @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  accounts         Account[]
  FinancialRecords FinancialRecord[]
}
```

#### Account model

```prisma
model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.String
  access_token      String? @db.String
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.String
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

#### FinancialRecord model

```prisma
model FinancialRecord {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  date           DateTime
  currency       String
  grossIncomeYtd Float
  taxesPaidYtd   Float
  assetsExCash   Float
  cash           Float
  debt           Float
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  User User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Install and generate Prisma Client

Prisma Client is an auto-generated and type-safe query builder that's tailored to your data. To get started with Prisma Client, you need to install the `@prisma/client` package:

```shell
npm install @prisma/client
```

Whenever you make changes to your Prisma schema in the future, you manually need to invoke prisma generate in order to accommodate the changes in your Prisma Client API:

```shell
npx prisma generate
```

Lastly, you can push your Prisma schema to MongoDB with the following command:

```shell
npx prisma db push
```

Now your MongoDB database should have the collections you defined in your Prisma schema file and connecting to the database is possible.

If you encouter any problems with the last step please that ensure your `.env` file has the correct connection string and that your IP address is allowed to connect to the database (you might have a dynamic IP address so allowing access from anywhere might me needed in development).

---

### shadcn/ui

[shadcn/ui](https://ui.shadcn.com/) provides accessible and customizable components that you can copy and paste into your apps. It's free & open source.

This project will use shadcn/ui for its UI and styling is done with Tailwind CSS.

#### Installation

To start using shadcn/ui run the shadcn-ui init command to setup your project:

```shell
npx shadcn-ui@latest init
```

You will be asked a few questions to configure `components.json`. Below is the selected answers for this project, feel free to change some of them.

```shell
Would you like to use TypeScript (recommended)? yes
Which style would you like to use? › New York
Which color would you like to use as base color? › Slate
Where is your global CSS file? › app/globals.css
Do you want to use CSS variables for colors? › yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › yes
```

#### Installing new components

Various shadcn/ui components are used throughout the app. Each component along with its dependencies needs to be installed seperately. Some of the components used are: `toast`, `button`, and `card` you can install them with the following commands:

```shell
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

Its easier to install components as you find the need for them with a single command. Check out the shadcn/ui [documentation](https://ui.shadcn.com/docs/components/) on how to install each component.

---

### Login Page

The login page of the app is the landing page (pathname `/`), so it needs to be created in the root `page.tsx` file.

For oragnizational purposes you can create a new `(site)` directory in the root of the project and place all the landing page specific files in it like its `page.tsx` file. This will keep the original functionality of the root `page.tsx` but structures the project differently ([route groups](https://nextjs.org/docs/app/building-your-application/routing/colocation#route-groups) are completely optional in Next.js 13).

In `app/(site)/page.tsx` create the login page:

#### page.tsx

This is the login page with a wrapper styled with Tailwind CSS. It has a header and the actual login form component for user authentication.

```jsx
import { TypographyH1 } from '@/components/TypographyH1';
import AuthForm from './components/AuthForm';

export default function Home() {
	return (
		<div className="container flex flex-col items-center justify-center pb-[117px] py-12 min-h-[calc(100vh-69px)]">
			<TypographyH1 center>Sign in to your account</TypographyH1>

			<AuthForm />
		</div>
	);
}
```

The login page uses the `TypographyH1` and `AuthForm` components.

#### TypographyH1.tsx

This is a reusable `h1` component that is used whenever an `h1` tag needs to be rendered on a page. Additionally, it can be centered with a prop.

```jsx
import { cn } from '@/lib/utils';

interface TypographyH1Props {
	children: React.ReactNode;
	center?: boolean;
}

export function TypographyH1({ children, center }: TypographyH1Props) {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl underline decoration-lime-800 dark:decoration-lime-400',
				center && 'text-center'
			)}
		>
			{children}
		</h1>
	);
}
```

#### AuthForm.tsx

This component is used to authenticate users. Since user authentication is yet to be implemented all the `next-auth` logic is commented out for now.

```jsx
'use client';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { useToast } from '@/components/ui/use-toast';
// import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const AuthForm = () => {
	const [googleIsLoading, setGoogleIsLoading] = useState(false);
	const [githubIsLoading, setGithubIsLoading] = useState(false);

	const { toast } = useToast();

	const socialAction = async (provider: string) => {
		if (provider === 'google') {
			setGoogleIsLoading(true);
		}

		if (provider === 'github') {
			setGithubIsLoading(true);
		}

		// await signIn(provider, { callbackUrl: '/money' }).then((callback) => {
		// 	if (callback?.error) {
		// 		toast({
		// 			description: 'Invalid credentials. Please try again.',
		// 		});
		// 	}
		// });
	};

	return (
		<form
			className="gap-4 flex flex-col mt-4 lg:mt-8 px-4 py-6 sm:px-10 w-full sm:max-w-lg max-w-md rounded-xl border bg-card text-card-foreground shadow"
			onSubmit={(e) => e.preventDefault()}
		>
			<ButtonWithIcon
				loading={googleIsLoading}
				disabled={googleIsLoading || githubIsLoading}
				type="button"
				className="w-full"
				icon={FaGoogle}
				onClick={() => socialAction('google')}
			>
				Continue with Google
			</ButtonWithIcon>

			<ButtonWithIcon
				loading={githubIsLoading}
				disabled={googleIsLoading || githubIsLoading}
				type="button"
				className="w-full"
				icon={FaGithub}
				onClick={() => socialAction('github')}
			>
				Continue with Github
			</ButtonWithIcon>
		</form>
	);
};

export default AuthForm;
```

#### ButtonWithIcon.tsx

This component renders a shadcn/ui `button` element with either a loader or another `react-icons` icon and is used throughout the app.

This component needs the `react-icons` npm package install it with:

```shell
npm install react-icons
```

```jsx
import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner8 } from 'react-icons/im';

interface ButtonWithIconProps extends ButtonProps {
	children?: React.ReactNode;
	icon?: IconType;
	loading?: boolean;
}

export function ButtonWithIcon({ icon: Icon, loading, children, ...props }: ButtonWithIconProps) {
	return (
		<Button {...props} disabled={loading || props.disabled}>
			{children}{' '}
			{loading ? (
				<ImSpinner8 className="ml-2 h-4 w-4 animate-spin" />
			) : Icon ? (
				<Icon className="ml-2 h-4 w-4" />
			) : (
				<></>
			)}
		</Button>
	);
}
```

#### RootLayout.tsx

Lastly, update the `RootLayout.tsx` to have some Tailwind CSS classes. Optionally, create a helper function for genereating the title for you app and store the description in a different file for easier use in other sections of the app:

```jsx
import { mainAppDescription } from '@/constants';
import { cn } from '@/lib/utils';
import createAppTitle from '@/utils/createAppTitle';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: createAppTitle('Sign in'),
	description: mainAppDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={cn(inter.className, 'antialiased')} lang="en" suppressHydrationWarning>
			<body className="min-h-screen text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-950 antialiased pt-[68px] pb-16">
				{children}
			</body>
		</html>
	);
}
```

---

### Authentication

Saving user data on authentication requires quering the database.

#### Prisma Client Instantiation

In order to communicate with the database a `Prisma Client` needs to be instantiated. Create a `db.ts` file in the `lib` directory.

This code ensures that only a single client is instantiated (singelton).

```ts
import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
	globalThis.prisma = client;
}

export default client;
```

#### Next-auth Installation

NextAuth.js is a complete open-source authentication solution for Next.js applications.

To setup user authentication with `next-auth` install it with npm:

```shell
npm install next-auth
```

Additionally, to save user data a Prisma adapters is needed, which can be installed with:

```shell
npm install @prisma/client @auth/prisma-adapter
npm install prisma --save-dev
```

#### Next-auth Configuration

To make the authenticated user session and the `JWT` from `next-auth` type safe they need to be typed. create a new `types` directory in the root of the project with a `next-auth.d.ts` file in it.

Declare a new `JWT` module and add an `id` field with a type of `string` to it. Also declare a `Session` module that extends the User type with an the same `id` field.

```ts
/* eslint-disable no-unused-vars */
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
	interface JWT {
		id: UserId;
	}
}

declare module 'next-auth' {
	interface Session {
		user: User & {
			id: UserId;
		};
	}
}
```

Now the user session and the JWT is type safe for authentication purposes.

#### Authentication API

User authentication needs its own api route since it makes API calls to the database. Create a new `api/auth/[...nextauth]` directory in the `app` directory and create a `route.ts` file in it:

```ts
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from '@/lib/db';

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(db),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		jwt: async ({ token }) => {
			const db_user = await db.user.findFirst({
				where: {
					email: token?.email as string,
				},
			});

			if (db_user) {
				token.id = db_user.id;
			}

			return token;
		},
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}

			return session;
		},
	},
	pages: {
		signIn: '/',
	},
	secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

Explain the file:

-   `adapter`: By default NextAuth.js does not include an adapter. If you would like to persist user / account data, please install one of the many available adapters. More information can be found in the adapter [documentation](https://authjs.dev/reference/adapters).
-   `providers`: An array of authentication providers for signing in (e.g. Google, GitHub, etc) in any order. See the providers [documentation](https://next-auth.js.org/configuration/providers/oauth) for a list of supported providers and how to use them.

-   `debug`: Set debug to true to enable debug messages for authentication and database operations.
-   `session`: The session object and all properties on it are optional. The default `strategy` is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
-   `callbacks`: Callbacks are asynchronous functions you can use to control what happens when an action is performed. Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs. In this implementation the callback function checks if an authenticated user exists on the database and adds its id to the token.
-   `pages`: Specify URLs to be used if you want to create custom sign in, sign out and error pages. Pages specified will override the corresponding built-in page.
-   `secret`: The default value is a string (SHA hash of the "options" object) in development, no default in production. In production this is required.

#### Google Provider

To start using a Google provider you need to add entries for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the `.env` file.

You can get the values for these by logging into your [Google Cloud](https://console.cloud.google.com/) and creating a new project.

Then open the project and navigate to the "OAuth consent screen" page and create an OAuth consent screen.

Afterwards, create an OAuth client ID from the "credentials" page. Set the `Authorized JavaScript origins` to "http://localhost:3000 and the `Authorized redirect URIs` to "http://localhost:3000/api/auth/callback/google/". These values must be changed to your deployment domain when in production.

Copy the `Client ID` and `Client secret` values provided to you by Google, and add them to the `.env` file.

```.env
GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>
```

#### GitHub Provider

To start using a GitHub provider you need to add entries for `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in the `.env` file.

You can get the values for these by logging into your GitHub account and navigating to [settings/developers](https://github.com/settings/developers) and creating a new OAuth App from the "New OAuth App" button.

Set the `Homepage URL` to "http://localhost:3000" and the `Authorization callback URL` to "http://localhost:3000". These values must be changed to your deployment domain when in production.

Copy the `Client ID` and `Client secret` values provided to you by GitHub, and add them to the `.env` file.

```.env
GITHUB_CLIENT_ID=<GITHUB_CLIENT_ID>
GITHUB_CLIENT_SECRET=<GITHUB_CLIENT_SECRET>
```

#### Adding Authentication Logic to the Client

In the `AuthForm` component uncomment the previously commented logic:

```jsx
import { signIn } from 'next-auth/react';
...

await signIn(provider, { callbackUrl: '/money' }).then((callback) => {
	if (callback?.error) {
		toast({
			description: 'Invalid credentials. Please try again.',
		});
	}
});
...
```

Lastly, to have access to the authenticated users session on the client it needs to be wrapped in a `SessionProvider` component. Additionally to have access to dark / light modes later on, install the `next-themes` package with npm and wrap the `SessionProvider` with a `ThemeProvider` component.

```shell
npm i next-themes
```

**components/providers/NextSessionProvider.tsx**

```jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

interface NextSessionProviderProps {
	children: React.ReactNode;
}

const NextSessionProvider = ({ children }: NextSessionProviderProps) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<SessionProvider>{children}</SessionProvider>
		</ThemeProvider>
	);
};

export default NextSessionProvider;
```

**app/layout.tsx**

```jsx
<body>
	<NextSessionProvider>{children}</NextSessionProvider>
</body>
```

Now the authentication is configured on the client and you can try logging in!

---
