# Project Details

## Gap in Headless Patient Care Pipelines
There is currently a notable gap in headless patient care pipelines, especially for emerging API providers like Canvas Medical. Our goal is to provide a solution that enables smoother digital patient care.

## Defining Effective Digital Patient Care
Defining what constitutes effective digital patient care is complex, given its novelty in the healthcare landscape. Our team, working in tandem with the guidelines from Canvas Medical, has dedicated efforts to exploring this question. Our focus has been exclusively on enhancing the patient experience, delving deep into what makes digital healthcare both efficient and user-friendly. As such, our insights and developments are centered on the patient perspective, aiming to streamline their journey in the digital healthcare environment without delving into the provider's side of the experience.

## 1. New Patient Onboarding
- **The First Truth:** A patient must have an account. This is currently the best way to store and manage patient data. The ideal scenario involves using Single Sign-On (SSO) with common accounts like Google, simplifying the process by eliminating the need for creating new credentials. However, for this specific challenge, we were restricted from using a third-party database, leading us to bypass the usual account creation process. Consequently, we focused on ensuring robust data security by exclusively interacting with the Canvas FHIR API. Canvas Medical facilitated this by providing us with pre-signed-in user accounts, enabling us to develop our software pipeline in a secure environment without the typical account infrastructure. This approach not only streamlined our development process but also maintained a high standard of data security and privacy.
- **Collecting Personal Information:** So the first real step in our starter is to collect a patient's personal information. This allows us to verify the identity of the patient using the account, and determine their eligibility for our services (location can be an issue). Since we may be showing PHI (protected health information) in the health record later down the care pipeline, we must verify the patient's identity upfront.

### We collect the following:
- Name
- Birth Date
- Gender
- Street Address
- City
- State
- Postal Code
- Phone Number
- Generic Consent

## 2. New Patient Staging
Once the patient submits valid information during the initial onboarding, they transition to a virtual 'staging area'. Think of it as your healthcare waiting room but without the old magazines, where additional necessary details are gathered before their first visit. Understanding the importance of not overwhelming patients, this staging area is designed to be user-friendly and efficient.

Patients are presented with a checklist of items that need to be completed before they can schedule their appointment. Each item is clearly listed with a checkbox for easy tracking of progress. This method effectively communicates what is required from the patient and guides them through each step in a structured manner. Once they have completed all the tasks in this checklist, they are then able to proceed to schedule their initial visit, ensuring a smooth and organized preparation process.

### We collect the following during staging:
- Medical History (ideally from a third-party solution)
- Insurance Card and Consent (ideally with a third-party verification solution)
- Questionnaires

Medical history intake forms are time-consuming and a significant barrier to efficient digital patient care. A seamless third-party integration that can automatically pull this data based on a patient's personal information would be a game-changer. We don't have this capability in the starter currently, but medical history intake forms need to go by the wayside, stat!

## 3. Initial Appointment Scheduling
A patient should have to make as few decisions as possible. We believe that the patient should only have to select the date and time that works best for them, without the need to select a provider.

### We collect the following during initial appointment scheduling:
- Date and time for appointment

In an ideal system, the healthcare organization should determine the best provider for each patient based on the collected information during onboarding and the date and time selected, and assign them to the patient for the initial appointment. This minimizes the decisions the patient has to make, enables maximum operational efficiency for the organization, and provides the best provider for each patient.

Since the organization holds comprehensive knowledge about both its providers' expertise and the patient's requirements, while the patient's knowledge is limited to their own, the healthcare organization is better equipped to make this match. So the patient provides a date and time for the appointment, and the organization will match with an appropriate provider, ideally automatically through software logic.

## 4. Patient Portal
We've finally made it to a patient's final destination, where all aspects of a patient's healthcare are managed, the patient portal. Conceptually, the patient portal is akin to a task management app. It organizes and presents various healthcare activities such as scheduled appointments, medication dosages, tests, and lifestyle modifications in an orderly and accessible manner. This functionality is especially beneficial for managing chronic conditions, where consistent and readily available digital care is crucial.

Recognizing the parallels between patient care needs and task management efficiency, we've integrated the best elements of both into our patient portal design. It truly gives the patient red carpet treatment, where the software holds their hand through every step.

### Primary functions provided through the patient portal:
- Join and book appointments (video calls)
- View health record
- See charges and pay bills
- Message care team

### Additional functions we hope to add:
- Treatment journey (day-by-day hour-by-hour tasks)
- Community
- Customer support
- Patient feedback (PROMs, platform-specific)
- Patient education
- Managed testing, prescriptions, and supplements (ordering, shipping, results)

### Join and book appointments (video calls)
Joining and scheduling appointments in our system is designed to be straightforward and user-friendly. When it's time for an appointment, patients can easily join their video call by clicking a notification on the homepage, prominently displayed for easy access. To further reduce the chances of missed appointments, we incorporate reminders and confirmations.

As for scheduling, the ideal system would guide patients through the process, suggesting the next steps in their treatment journey and allowing them to select convenient dates and times. Should a patient need to book a new appointment independently, they should only need to provide their preferred timing and some information, and the system would intelligently match them with the appropriate healthcare provider, eliminating the need for them to choose a provider themselves.

In cases of no-shows, the system should automatically propose a rescheduled appointment while giving patients the option to confirm or choose a different time. To address frequent no-shows, we propose implementing a policy where patients with repeated missed appointments may undergo a manual scheduling process or consultation to reassess their needs.

Additionally, enhancing patient appointments with post-visit transcripts or recordings from video calls, generated via AI solutions, is a potential future feature that could significantly aid in patient recall and understanding of their consultations.

### View health record
Patients can see their basic medical history information, inclusive of completed forms (consents, questionnaires), appointment history, conditions, medications, immunizations, allergies, imaging & lab results, clinical notes, and goals. This is updated automatically after changes such as during a consultation or a new lab result.

### See charges and pay bills
Two billing methods could be implemented: delayed or upfront billing. Delayed billing is going to be the default, as many factors make upfront billing difficult to implement.

So for delayed billing, as the patient receives services, the system accumulates the charges, keeping track of all billable items and displaying them in the billing section of the patient portal. On a predetermined schedule (e.g., monthly), the system generates a statement of all charges incurred during that period. A pipeline could be set up that would verify insurance coverage and benefits to determine the covered amount and patient’s out-of-pocket costs. The patient would be able to pay digitally or set up automated monthly billing.

For upfront billing, services would be activated upon successful payment. The patient would be able to pay digitally and this could be done through a bulk payment or subscription. The payment history would be available to view in the billing section.

### Message care team
Our system supports asynchronous messaging of a patient’s care team. This is done through a chat widget with notifications.

Ideally, the patient does not have to select who to send a message to. They just send a message and the software or organization deals with the routing. However, there are situations where a patient may like to privately message a provider, so this could be implemented if needed.

### Treatment journey
The treatment journey should be designed for ease and clarity, resembling a task management app to guide patients through their care. Instead of expecting patients to recall every detail from a video call or sift through extensive reports, we provide structured, simple-to-follow instructions. The portal lays out a clear treatment plan with daily and hourly tasks, making it straightforward for patients to understand and follow their prescribed regimen. While we recognize that perfect compliance isn't always achievable, this approach significantly simplifies the treatment process. Patients are empowered to actively participate in their care by completing manageable tasks each day, leading to better outcomes and a smoother treatment journey.

### Community
Incorporating a community feature into the patient care pipeline can greatly enhance the patient experience. By creating a space where patients undergoing similar treatments can connect and share their journeys, we foster a supportive environment. This community aspect allows patients to exchange insights, offer encouragement, and receive emotional support from others who truly understand their experiences. Such peer support is not only comforting but can also be informative, contributing to a more comprehensive and fulfilling patient experience. Integrating this feature would be a significant step towards making the software not just a tool for treatment management, but a holistic platform that addresses the broader needs of patient care.

### Customer support
Effective customer support is vital for a seamless digital patient experience. Recognizing that patients may face issues like accessing billing statements or encountering technical difficulties, it's essential to provide a dedicated support channel that doesn't burden the healthcare team with non-medical inquiries. To address this, we propose the integration of a customer support feature within the platform. This allows patients to directly seek help for any platform-related issues, ensuring that their concerns are resolved promptly without distracting the care team from their primary medical responsibilities. Initially, this could be effectively managed through a designated customer support section, potentially evolving into a more sophisticated messaging routing system in the future. This approach ensures a smooth and uninterrupted experience for patients, contributing to overall satisfaction and trust in the platform.

### Patient feedback (PROMs, platform-specific)
Patient feedback is a crucial element in enhancing digital patient care. By actively involving patients in the feedback process, we can gather invaluable insights about their treatment journey and their experiences with the digital platform. Implementing native Patient-Reported Outcome Measures (PROMs) within the platform allows patients to easily share their health outcomes and perceptions of care. Additionally, providing a straightforward mechanism for patients to offer feedback on the platform itself enables us to continuously improve the user experience. This dual approach to feedback - focusing on both the treatment and the digital interface - is fundamental to optimizing patient care and ensuring that our digital solutions truly meet the needs of those they are designed to serve.

### Patient education
Effective patient education is a nuanced aspect of healthcare. Ideally, patients should receive comprehensive education during their video calls and throughout their treatment process. Understanding that people often seek healthcare with limited time and desire to delve deeply into medical knowledge, our focus is on delivering concise, relevant information. Detailed explanations of specific tests or therapies, provided through accessible mediums like a chat assistant or step-by-step guides, can be particularly beneficial. While in-depth online courses about health conditions and lifestyle modifications might be useful for some, they may not meet the needs of the majority. Therefore, we advocate for integrating patient education seamlessly into the treatment journey, offering pertinent information as part of the care process itself, rather than as separate, extensive educational content. This approach aligns with the realistic needs and preferences of most patients, ensuring they receive crucial information in the most digestible and practical manner.

### Managed testing, prescriptions, and supplements (ordering, shipping, results)
Testing, prescriptions, and supplements should be made as easy as possible for patients. The organization should handle the ordering, shipping, and updating of the results. The patient should only have to perform the test kit, ship it back, and take their pills at the correct dosage. That's it.
