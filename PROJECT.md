# Project Details

## Gap in Headless Patient Care Pipelines
There is currently a notable gap in headless patient care pipelines, especially for emerging API providers like Canvas Medical. Our goal is to provide a solution that enables smoother digital patient care.

## Defining Effective Digital Patient Care
Defining effective digital patient care is challenging due to its newness in healthcare. In collaboration with Canvas Medical's guidelines, our team has focused on enhancing the patient experience, exploring what makes digital healthcare efficient and user-friendly. Our efforts are centered on the patient perspective, aiming to streamline their digital healthcare journey without focusing on the provider side.

## 1. New Patient Onboarding
- **The First Truth:** A patient must have an account. This is currently the best way to store and manage patient data. Ideally, we'd use Single Sign-On (SSO) with common platforms like Google to simplify sign-ups. However, due to constraints in this project, we couldn't use a third-party database and instead focused on secure data management through direct interaction with the Canvas FHIR API. Canvas Medical provided pre-signed-in user accounts, allowing us to develop a secure and streamlined software pipeline without standard account infrastructure.
- **Collecting Personal Information:** So the first real step in our starter involves collecting personal information from patients to verify their identity and determine eligibility for services, essential for handling protected health information (PHI) securely in later stages.

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
After submitting their initial information, patients enter a virtual 'staging area', akin to a digital waiting room. Here, they're provided with a user-friendly checklist of tasks to complete before scheduling their first appointment. This checklist, complete with checkboxes for tracking progress, clearly outlines the necessary steps, guiding patients without overwhelming them. Once all tasks are completed, patients can seamlessly proceed to schedule their initial visit, ensuring an organized and efficient preparation process.

### We collect the following during staging:
- Medical History (ideally from a third-party solution)
- Insurance Card and Consent (ideally with a third-party verification solution)
- Questionnaires

Medical history intake forms are time-consuming and a significant barrier to efficient digital patient care. A seamless third-party integration that can automatically pull this data based on a patient's personal information would be a game-changer. We don't have this capability in the starter currently, but medical history intake forms need to go by the wayside, stat! [Zus](https://zushealth.com/) integration with Canvas Medical may provide this functionality with their Zus Aggregated Profile, a shareable view of a patient that makes it quick and easy for care teams to understand all of a patient's recent and ongoing healthcare interactions. Additionally, with FHIR support, Canvas Medical can potentially interact directly with EHRs or QHINs that also use FHIR standards, facilitating access and importing patient health data directly into the Canvas platform. Another third-party integration that may simplify this process or provide broader access to patient data would be [Particle Health](https://www.particlehealth.com/), which can pipe in patient medical records from the largest healthcare networks.

Insurance coverage verification needs to be automated. During staging, a patient should be able to take a picture of the front and back of their insurance card, much like depositing a check using their phone, and be verified. It should work at the point of care and take seconds, much like an API call that returns true or false. There should be no need for manual checks. [Opkit](https://www.opkit.co/) may provide this functionality with their health insurance verification platform, which exposes a JSON REST API that allows developers to completely automate the insurance verification process.

## 3. Initial Appointment Scheduling
Our system simplifies patient decision-making by requiring them to only choose their preferred appointment date and time, not the provider. Leveraging the information gathered during onboarding, the healthcare organization then matches the patient with the most suitable provider based on their needs and the selected timing. This approach enhances operational efficiency and ensures patients receive care from the best-matched provider. Since the organization holds comprehensive knowledge about both its providers' expertise and the patient's requirements, while the patient's knowledge is limited to their own, the healthcare organization is better equipped to make this match. The matching process is ideally automated through software logic for efficiency and accuracy.

### We collect the following during initial appointment scheduling:
- Date and time for appointment

## 4. Patient Portal
We've finally made it to a patient's final destination, where all aspects of a patient's healthcare are managed, the patient portal. Conceptually, the patient portal is akin to a task management app. It efficiently organizes and displays key healthcare activities – appointments, medication schedules, tests, and lifestyle changes – in a user-friendly format. This is particularly advantageous for managing chronic conditions, requiring consistent and accessible digital care. By blending task management principles with patient care needs, our portal design provides an intuitive and supportive experience, guiding patients through their healthcare journey with ease.

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

As for scheduling, the ideal system would suggest appointments to be scheduled and allow the patient to select convenient dates and times. Should a patient need to book a new appointment independently, they should only need to provide their preferred timing and inquiry information, and the system would intelligently match them with the appropriate healthcare provider, eliminating the need for them to choose a provider themselves.

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
The treatment journey should be designed for simplicity, mirroring a task management app to ease patient navigation through their care. It should offer clear, structured instructions, laying out daily and hourly tasks in the portal, rather than overwhelming patients with extensive recall or reports. This approach simplifies adherence, acknowledges that perfect compliance is challenging, and empowers patients to actively engage in their care, ultimately leading to improved outcomes and a smoother healthcare experience.

### Community
Integrating a community feature into our patient care platform would enhance the experience by fostering a supportive space for patients to connect and share their journeys. This allows for the exchange of insights, encouragement, and emotional support among peers undergoing similar treatments, adding a comforting and informative dimension to the patient experience. Such a feature transforms the software from a mere treatment management tool into a holistic platform that caters to the broader aspects of patient care.

### Customer support
Effective customer support is crucial for a seamless digital patient experience. To address issues like accessing billing statements or technical difficulties, we advocate for a dedicated support channel within the platform. This feature enables patients to resolve platform-related issues promptly, without overburdening healthcare staff with non-medical queries. Starting with a designated customer support section, we could evolve this into a sophisticated messaging system. This ensures a smooth patient experience, enhancing satisfaction and trust in the platform.

### Patient feedback (PROMs, platform-specific)
Patient feedback is essential for improving digital patient care. Involving patients in the feedback process provides valuable insights into their treatment and platform experience. We would use native Patient-Reported Outcome Measures (PROMs) for easy sharing of health outcomes and care perceptions. Additionally, a simple feedback mechanism on the platform itself would help us enhance the user experience. This two-pronged approach, focusing on both treatment and the digital interface, is key to optimizing patient care and ensuring our digital solutions effectively meet patient needs.

### Patient education
Effective patient education is tailored to fit within the healthcare process, focusing on concise and relevant information. We aim to integrate education seamlessly into treatment, utilizing accessible tools like chat assistants or step-by-step guides for specific tests or therapies. Recognizing that not all patients have the time or inclination for in-depth study, we prioritize delivering essential information as an integral part of the care journey, rather than as separate, extensive content. This approach ensures patients receive the vital information they need in a practical, digestible format.

### Managed testing, prescriptions, and supplements (ordering, shipping, results)
Testing, prescriptions, and supplements should be made as easy as possible for patients. The organization should handle the ordering, shipping, and updating of the results. The patient should only have to perform the test kit, ship it back, and take their pills at the correct dosage. That's it.
