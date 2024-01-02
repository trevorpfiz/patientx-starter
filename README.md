
<a name="readme-top"></a>



<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/trevorpfiz/canvas-fhir">
    <img src="https://github.com/trevorpfiz/canvas-fhir/assets/19765785/d073e68e-1f0e-43a8-b830-3fcfb6f50532" alt="Logo" width="80" height="80">

  </a>

<h3 align="center">PatientX Starter (by Trust the Process)</h3>

  <p align="center">
    We built a better patient experience for accessing healthcare services using the Canvas Medical FHIR API. This software starter kit enables developers, healthcare providers, and stakeholders to rapidly deploy and customize a patient experience care pipeline, leveraging the power of the Canvas Medical FHIR API. Get your software off the ground quickly so you can start treating patients!<br>
    <br>
    <a href="https://github.com/trevorpfiz/canvas-fhir/issues">Report Bug</a>
    ·
    <a href="https://github.com/trevorpfiz/canvas-fhir/issues">Request Feature</a>
  </p>
</div>

<!-- PROJECT SHIELDS -->
<p align="center">
   <a href="https://github.com/trevorpfiz/canvas-fhir/graphs/contributors"><img src="https://img.shields.io/github/contributors/trevorpfiz/canvas-fhir.svg?style=for-the-badge" alt="Contributors"></a>
   <a href="https://github.com/trevorpfiz/canvas-fhir/network/members"><img src="https://img.shields.io/github/forks/trevorpfiz/canvas-fhir.svg?style=for-the-badge" alt="Forks"></a>
   <a href="https://github.com/trevorpfiz/canvas-fhir/stargazers"><img height="20px" src="https://img.shields.io/github/stars/trevorpfiz/canvas-fhir.svg?style=for-the-badge" alt="Stars"></a>
   <a href="https://github.com/trevorpfiz/canvas-fhir/issues"><img src="https://img.shields.io/github/issues/trevorpfiz/canvas-fhir.svg?style=for-the-badge" alt="Issues"></a>
   <a href="https://github.com/trevorpfiz/canvas-fhir/blob/main/LICENSE"><img src="https://img.shields.io/github/license/trevorpfiz/canvas-fhir.svg?style=for-the-badge" alt="MIT License"></a>
   <a href="https://linkedin.com/in/trevor-pfizenmaier/"><img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555" alt="Linkedin"></a>
</p>


<!-- TABLE OF CONTENTS -->
<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#key-features-and-functionalities">Key Features and Functionalities</a>
    </li>
    <li>
      <a href="#installation-and-usage">Installation and Usage</a>
    </li>
    <li><a href="#technical-details">Technical Details</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#project-details">Project Details</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- KEY FEATURES AND FUNCTIONALITIES -->
## Key Features and Functionalities

Our patient experience starter offers a suite of features to enhance patient engagement and streamline healthcare processes.

- **New patient onboarding:** Patients can sign up for an account and provide basic info. There is a staging area so you can ensure patients complete self-registration before the initial visit. This can include entering personal info and insurance coverage, completing necessary consents and questionnaires, and providing basic medical history. Once everything is filled out, the patient can schedule an initial consultation.

- **Patient Portal:** Provides easy access to a patient's health records, allows patients to join and book appointments, take video calls with their providers, view and manage billing, and message their care team.

- **View health record:** Patients can see their basic medical history information, inclusive of completed forms (consents, questionnaires), appointment history, conditions, medications, immunizations, allergies, imaging & lab results, clinical notes, and goals. Their health record is automatically updated after changes, such as during a video appointment.

- **Join and book appointments:** Patients can join and schedule appointments with their known care team or an otherwise available clinician. Reminders and alerts can be implemented to reduce no-shows.

- **Billing for services:** Patients can view billing statements as PDFs and provide payment.

<div align="center">
  <video width="320" height="240" controls>
    <source src="https://github.com/trevorpfiz/canvas-fhir/assets/19765785/488415cb-3a45-456c-8f45-de261a148da8" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

TESTING

https://github.com/trevorpfiz/canvas-fhir/assets/19765785/488415cb-3a45-456c-8f45-de261a148da8



<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Installation and Usage

Quick Start Guide: Follow our easy installation guide to set up the starter.

User Guide: Our detailed user guide, complete with step-by-step instructions and screenshots, makes navigation a breeze. [Link to User Guide]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- TECHNICAL DETAILS -->
## Technical Details

- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

Integration with Canvas Medical FHIR API: Understand how we seamlessly integrate with the FHIR API for robust functionality.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

Upcoming Features: Take a sneak peek at the exciting features on our roadmap.

Feedback and Suggestions: Your feedback is valuable! Share your thoughts and ideas for future enhancements [here].

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Open-Source Contribution: We welcome contributions! Find out how you can contribute to our project [here].

Standards and Procedures: Familiarize yourself with our coding standards, testing procedures, and PR submission guidelines.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- PROJECT DETAILS -->
## Project Details

Please refer to our detailed `PROJECT.md` document: [Project Details](https://github.com/trevorpfiz/canvas-fhir/blob/main/PROJECT.md)

This should give you a comprehensive understanding of the patient experience starter and our design philosophy.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- License -->
## License

Distributed under the [MIT License](https://github.com/trevorpfiz/canvas-fhir/blob/main/LICENSE). See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# create-t3-turbo

> **Note**
> Due to high demand, this repo now uses the `app` directory with some new experimental features. If you want to use the more traditional `pages` router, [check out the repo before the update](https://github.com/t3-oss/create-t3-turbo/tree/414aff131ca124573e721f3779df3edb64989fd4).

> **Note**
> OAuth deployments are now working for preview deployments. Read [deployment guide](https://github.com/t3-oss/create-t3-turbo#auth-proxy) and [check out the source](./apps/auth-proxy) to learn more!

## Installation

There are two ways of initializing an app using the `create-t3-turbo` starter. You can either use this repository as a template:

![use-as-template](https://github.com/t3-oss/create-t3-turbo/assets/51714798/bb6c2e5d-d8b6-416e-aeb3-b3e50e2ca994)

or use Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

## About

Ever wondered how to migrate your T3 application into a monorepo? Stop right here! This is the perfect starter repo to get you running with the perfect stack!

It uses [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  ├─ expo
  |   ├─ Expo SDK 49
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using Nativewind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v10 router definition
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
  └─ db
      └─ Typesafe db calls using Drizzle & Planetscale
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use PlanetScale and is **edge-bound** with the [database.js](https://github.com/planetscale/database-js) driver. If you're using something else, make the necesary modifications to the [schema](./packages/db/schema) as well as the [client](./packages/db/index.ts) and the [drizzle config](./packages/db/drizzle.config.ts). If you want to switch to non-edge database driver, remove `export const runtime = "edge";` [from all pages and api routes](https://github.com/t3-oss/create-t3-turbo/issues/634#issuecomment-1730240214).

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 2. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `pnpm dev` at the project root folder.

> **TIP:** It might be easier to run each app in separate terminal windows so you get the logs from each app separately. This is also required if you want your terminals to be interactive, e.g. to access the Expo QR code. You can run `pnpm --filter expo dev` and `pnpm --filter nextjs dev` to run each app in a separate terminal window.

### 3. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## FAQ

### Does the starter include Solito?

No. Solito will not be included in this repo. It is a great tool if you want to share code between your Next.js and Expo app. However, the main purpose of this repo is not the integration between Next.js and Expo — it's the codesplitting of your T3 App into a monorepo. The Expo app is just a bonus example of how you can utilize the monorepo with multiple apps but can just as well be any app such as Vite, Electron, etc.

Integrating Solito into this repo isn't hard, and there are a few [offical templates](https://github.com/nandorojo/solito/tree/master/example-monorepos) by the creators of Solito that you can use as a reference.

### What auth solution should I use instead of Next-Auth.js for Expo?

I've left this kind of open for you to decide. Some options are [Clerk](https://clerk.dev), [Supabase Auth](https://supabase.com/docs/guides/auth), [Firebase Auth](https://firebase.google.com/docs/auth/) or [Auth0](https://auth0.com/docs). Note that if you're dropping the Expo app for something more "browser-like", you can still use Next-Auth.js for those. [See an example in a Plasmo Chrome Extension here](https://github.com/t3-oss/create-t3-turbo/tree/chrome/apps/chrome).

The Clerk.dev team even made an [official template repository](https://github.com/clerkinc/t3-turbo-and-clerk) integrating Clerk.dev with this repo.

During Launch Week 7, Supabase [announced their fork](https://supabase.com/blog/launch-week-7-community-highlights#t3-turbo-x-supabase) of this repo integrating it with their newly announced auth improvements. You can check it out [here](https://github.com/supabase-community/create-t3-turbo).

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other apps you may add in the future, should only add the `api` package as a dev dependency. This lets you have full typesafety in your client applications, while keeping your backend code safe.

If you need to share runtime code between the client and server, such as input validation schemas, you can create a separate `shared` package for this and import it on both sides.

## Deployment

### Next.js

#### Prerequisites

> **Note**
> Please note that the Next.js application with tRPC must be deployed in order for the Expo app to communicate with the server in a production environment.

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

### Auth Proxy

The auth proxy is a Nitro server that proxies OAuth requests in preview deployments. This is required for the Next.js app to be able to authenticate users in preview deployments. The auth proxy is not used for OAuth requests in production deployments. To get it running, it's easiest to use Vercel Edge functions. See the [Nitro docs](https://nitro.unjs.io/deploy/providers/vercel#vercel-edge-functions) for how to deploy Nitro to Vercel.

Then, there are some environment variables you need to set in order to get OAuth working:

- For the Next.js app, set `AUTH_REDIRECT_PROXY_URL` to the URL of the auth proxy.
- For the auth proxy server, set `AUTH_REDIRECT_PROXY_URL` to the same as above, as well as `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` (or the equivalent for your OAuth provider(s)). Lastly, set `AUTH_SECRET` **to the same value as in the Next.js app** for preview environments.

Read more about the setup in [the auth proxy README](./apps/auth-proxy/README.md).

### Expo

Deploying your Expo application works slightly differently compared to Next.js on the web. Instead of "deploying" your app online, you need to submit production builds of your app to app stores, like [Apple App Store](https://www.apple.com/app-store) and [Google Play](https://play.google.com/store/apps). You can read the full [guide to distributing your app](https://docs.expo.dev/distribution/introduction), including best practices, in the Expo docs.

1. Make sure to modify the `getBaseUrl` function to point to your backend's production URL:

   <https://github.com/t3-oss/create-t3-turbo/blob/656965aff7db271e5e080242c4a3ce4dad5d25f8/apps/expo/src/utils/api.tsx#L20-L37>

2. Let's start by setting up [EAS Build](https://docs.expo.dev/build/introduction), which is short for Expo Application Services. The build service helps you create builds of your app, without requiring a full native development setup. The commands below are a summary of [Creating your first build](https://docs.expo.dev/build/setup).

   ```bash
   # Install the EAS CLI
   pnpm add -g eas-cli

   # Log in with your Expo account
   eas login

   # Configure your Expo app
   cd apps/expo
   eas build:configure
   ```

3. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [`eas.json` build profiles](https://docs.expo.dev/build-reference/eas-json) to create production builds or development, or test builds. Let's make a production build for iOS.

   ```bash
   eas build --platform ios --profile production
   ```

   > If you don't specify the `--profile` flag, EAS uses the `production` profile by default.

4. Now that you have your first production build, you can submit this to the stores. [EAS Submit](https://docs.expo.dev/submit/introduction) can help you send the build to the stores.

   ```bash
   eas submit --platform ios --latest
   ```

   > You can also combine build and submit in a single command, using `eas build ... --auto-submit`.

5. Before you can get your app in the hands of your users, you'll have to provide additional information to the app stores. This includes screenshots, app information, privacy policies, etc. _While still in preview_, [EAS Metadata](https://docs.expo.dev/eas/metadata) can help you with most of this information.

6. Once everything is approved, your users can finally enjoy your app. Let's say you spotted a small typo; you'll have to create a new build, submit it to the stores, and wait for approval before you can resolve this issue. In these cases, you can use EAS Update to quickly send a small bugfix to your users without going through this long process. Let's start by setting up EAS Update.

   The steps below summarize the [Getting started with EAS Update](https://docs.expo.dev/eas-update/getting-started/#configure-your-project) guide.

   ```bash
   # Add the `expo-updates` library to your Expo app
   cd apps/expo
   pnpm expo install expo-updates

   # Configure EAS Update
   eas update:configure
   ```

7. Before we can send out updates to your app, you have to create a new build and submit it to the app stores. For every change that includes native APIs, you have to rebuild the app and submit the update to the app stores. See steps 2 and 3.

8. Now that everything is ready for updates, let's create a new update for `production` builds. With the `--auto` flag, EAS Update uses your current git branch name and commit message for this update. See [How EAS Update works](https://docs.expo.dev/eas-update/how-eas-update-works/#publishing-an-update) for more information.

   ```bash
   cd apps/expo
   eas update --auto
   ```

   > Your OTA (Over The Air) updates must always follow the app store's rules. You can't change your app's primary functionality without getting app store approval. But this is a fast way to update your app for minor changes and bug fixes.

9. Done! Now that you have created your production build, submitted it to the stores, and installed EAS Update, you are ready for anything!

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
