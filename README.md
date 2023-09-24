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

**Users model**

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

**Account model**

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

**FinancialRecord model**

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

### Authentication
