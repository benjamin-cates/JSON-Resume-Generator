# Dynamic JSON Resume Creator

This program allows the creation of a resume using easy JSON data structures. The resume can be edited to hide or show certain elements so every resume can be easily tailored to the application.

## Getting Started

1. Fork this repository and make sure it is private
2. Clone the repository to your personal computer
3. Rename the file `example_resume.json` to `resume.json`.
4. Fill in personal information according to the "JSON Structure" section
5. Open the file `index.html` in the browser.
6. Make any necessary edits so the page looks nice.
7. (optional) Edit the CSS file `format.css` to make it unique (you may need to edit page width as well).
8. Print by pressing `Ctrl + P` (you can use save to PDF in the printer selection).

## JSON Structure

There are 4 important parts to the resume data:
1. List of experiences
2. Contact info
3. References
4. Experience locations

### List of experiences
Each experience is an object that can contain these properties:
- "type" - This required field says what category it goes in
- "title" - Job title, award name, project name, etc.
- "start" - Start of the time period
- "end" - end of the time period (start is required if this is specified)
- "description" - Body text of the experience
- "company" (optional)
- "contact" - Name of the contact for this experience, should match the name in references exactly
- "hidden" - If true, experience is hidden by default
- "veryhidden" - If true, experience is not displayed as all

In addition, there is also a list of descriptions in `resume.descriptions` You can add an arbitrary amount of descriptions to cycle through. They are intended to be something like "A student looking to assist the team at {company name here}".

In order to generate the resume, the array of experiences in `resume.experience` is sorted by type and then rendered. See example_resume.js if this does not make sense.

### Contact info
These are the properties of `resume.contact`, all of them are optional but most are recommended.
- "name"
- "pronouns"
- "city" - The city you live in, can also include state, country, and zip code if felt necessary.
- "address" - Your address (not really recommended)
- "email"
- "phone"
- "other" - Any other info you would like to include in the top right

### References
`references` is a dictionary outside of the main resume object. Each pair matches a name to a phone number or email, which will be shown in bold. The list of contacts is sorted by last name and automatically updated depending on whether it is visible in the print form of the resume. If all of the experiences which have "contact" set to this exact name are hidden, the reference will be hidden. References are automatically added to the bottom right of the resume.

### Experience Locations
This is an object which contains the location of the "type" for each experience. Each type is mapped to either left or right. If you're copying from `example_resume.js`, this doesn't have to be changed.


