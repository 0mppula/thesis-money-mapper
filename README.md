# Thesis Money Mapper

### Creating the Project

#### Initializing the Project

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

#### Cleaning Up

When setting up a Next.js project, the initial codebase will typically include some boilerplate code that is not necessary for your application.

**Css**

Start by deleting everything except the tailwind specific configuration code from `app/globals.css`.

```css
/* app/globals.css (keep these lines) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Tailwind Config**

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

**Landing Page**

In `app/page.tsx` remove all the boilerplate `jsx` inside of the `main` tag and remove its className. Additionally, eliminate all unused import statements.

```jsx
// app/page.tsx
<main>
	<p>Hello World!</p>
</main>
```

**Root Layout**

Replace the default metadata in the root layout of the project.

```jsx
// app/layout.tsx
export const metadata: Metadata = {
	title: 'Money Mapper',
	description: 'Take control of your finances with Money Mapper, ...',
};
```

**.env File**

In the root of your project create an `.env` file for storing the projects environment variables. Finally, include an exception for the `.env` file in the `.gitignore` to prevent the accidental inclusion of sensitive data in your project's version control (git).

```.gitignore
# .gitignore
.env
```

#### Version Control

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
