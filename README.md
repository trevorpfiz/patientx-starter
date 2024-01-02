
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

https://github.com/trevorpfiz/canvas-fhir/assets/19765785/488415cb-3a45-456c-8f45-de261a148da8

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Installation and Usage

Quick Start Guide: Follow our easy installation guide to set up the starter.

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database **NOTE: Not integrated yet because of remote data restrictions**
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


User Guide: Our detailed user guide, complete with step-by-step instructions and screenshots, makes navigation a breeze. [Link to User Guide]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- TECHNICAL DETAILS -->
## Technical Details

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [NativeWind](https://www.nativewind.dev/v4/overview)
- [tRPC](https://trpc.io/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

Integration with Canvas Medical FHIR API: We have created a fully type-safe Zod client to work with FHIR APIs.

It uses [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy **NOTE: Not integrated yet because of remote data restrictions**
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
  |   └─ tRPC v10 router definition. Type-safe Canvas FHIR API Zod client.
  ├─ shared
  |   └─ Zod schemas for app-wide type-safety and validation.
  ├─ ui
  |   └─ shadcn/ui. **NOTE: Only used for the Next.js app at this time**
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Not integrated yet because of remote data restrictions**
  └─ db
      └─ Typesafe db calls using Drizzle & Planetscale **NOTE: Not integrated yet because of remote data restrictions**
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

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other apps you may add in the future, should only add the `api` package as a dev dependency. This lets you have full typesafety in your client applications, while keeping your backend code safe. We have created a separate `shared` package that allows us to share runtime code between the client and server, such as input validation schemas.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

Upcoming Features: Take a sneak peek at the exciting features on our roadmap.

Feedback and Suggestions: Your feedback is valuable! Share your thoughts and ideas for future enhancements [here].

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Open-Source Contribution: We welcome contributions! Find out how you can contribute to our project [here].

Standards and Procedures: Familiarize yourself with our coding standards, testing procedures, and PR submission guidelines.

<a href="https://github.com/trevorpfiz/canvas-fhir/graphs/contributors">
  <p align="center">
    <img width="720" src="https://contrib.rocks/image?repo=trevorpfiz/canvas-fhir" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

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



<!-- References -->
## References

The repo originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

Feel free to check out the project if you are running into issues with running/deploying the starter.
