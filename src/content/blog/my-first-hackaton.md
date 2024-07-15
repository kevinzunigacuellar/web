---
title: My first hackathon
description: I participated in my first hackathon ever. Here are some details about the project I worked on and the experience I had.
pubDate: 2024-07-15
hero: "~/assets/heros/shield-og.png"
heroAlt: "The Shield logo"
---

As the title suggests, I recently took part in my very first hackathon. It was an amazing experience where I got to work with a lot of new technologies. While I was familiar with some, many were completely new to me. I learned a ton and had a great time.

At the time of this writing, I'm still polishing some details and maybe adding a few extras, but the first version of the project is already [live](https://shieldz.vercel.app).

## The Project

I named this project **Shield**, inspired by the anime [*The Rising of the Shield Hero*](https://en.wikipedia.org/wiki/The_Rising_of_the_Shield_Hero), which I was watching during the hackathon. If you haven't seen it, I highly recommend it.

Shield is a job post platform designed to streamline the hiring process by using AI to match job descriptions with resumes. 

Employers can create an account and post jobs. The platform provides a URL they can share with potential candidates. Candidates can use this URL to apply for the job. The platform analyzes the job description and the resume, providing a match score to help employers make more efficient hiring decisions.

## Technology Stack

The project was built using the following technologies:

- **Frontend Framework**: Next.js
- **Authentication**: Clerk
- **Database**: Xata & Prisma
- **AI**: Cohere
- **Deployment**: Vercel
- **Background Jobs**: Inngest

## Under the Hood

Here’s a brief overview of the project's architecture and how data flows between the different services.

### Application Flow

Whenever an applicant applies for a job, the following steps are executed:

1. The application is received by Next.js using Server Actions.
2. The resume in the application is uploaded to UploadThing.
3. Once the upload is completed, the server creates a new entry in the database with the URL of the resume.
4. Finally, an event is sent to Inngest to process the resume, provide a match score, and send a confirmation email to the applicant.

![application flow](~/assets/content/application-flow.png)

### Score Calculation Flow

The score calculation flow is run as a background job using Inngest. The following steps are executed:

1. Inngest receives an event with an application ID.
2. Inngest requests the application data from the database.
3. The PDF is downloaded from UploadThing, and the text is extracted using Dynamic PDF.
4. The text is sent to Cohere to generate a match score.
5. The match score is saved in the database.

![score flow](~/assets/content/score-flow.png)

### Email Confirmation Flow

The email confirmation flow is also run as a background job using Inngest. The following steps are executed:

1. Inngest receives an event with an application ID.
2. Inngest requests the application data from the database.
3. The email is sent using Resend.

![email flow](~/assets/content/email-flow.png)

## Final Thoughts

Participating in this hackathon was an incredible experience. I learned a lot and had a great time working on this project. I'm looking forward to participating in more hackathons in the future and building more cool projects.