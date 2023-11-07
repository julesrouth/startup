
# Habit Sticker Chart

## Description deliverable

### Elevator pitch

Have you ever tried to start a habit and used a habit tracking app, but then forgot you set it up the next day because it looked so boring? Introducing Habit Sticker Chart, that allows you to use a sticker evertyime you complete your habit goal! No more boring check boxes, but feel like a kid again with many different colorful and fun options to choose from. This application allows you to create habit goals to accomplish weekly and will track your progress over time. It will save each successful week as a sticker chart in a gallery that you can look back on and admire.

### Design Images

![habit sticker chart website layout (1)](https://github.com/julesrouth/startup/assets/99697554/5eadfaa6-3f57-4121-8689-745829fe351b)


### Key features

-   Secure login over HTTPS
-   Ability to create a habit to accomplish
-   Ability to set habit time goal(which days, for how many weeks, ect.)
-   Ability to select a sticker for that habit
-   Ability to put on sticker when habit is accomplished
-   Count for habit accomplished for that week is visible
-   Results are persistently stored
-   Ability for admin to create and delete habits
-  Ability to see old habit charts

### Technologies

I am going to use the required technologies in the following ways.

-   **HTML**  - Uses correct HTML structure for application. 4 HTML pages. Login, Main habit sticker page, Create new habit page, Gallery Page
-   **CSS**  - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
-   **JavaScript**  - Provides login, sticker choice display, applying backend endpoint calls.
-   **Service**  - Backend service with endpoints for:
    -   login
    -   retrieving habits and sticker choice
-   **DB**  - Store users, habits, and stickers in the database
-   **Login**  - Register and login users. Credentials securely stored in database. Can't vote unless authenticated.
-   **WebSocket**  - Realtime data from new habits that will be stored in the gallery
-   **React**  - Application ported to use the React web framework.

### HTML deliverable
For this deliverable I built out the structure of my application using HTML.

-    **HTML pages** - 4 HTML page that represent the ability to login, track your habits with stickers, add new habits, and see a gallery of accomplishments.
-    **Links** - Each page has a menu that links to each other page. The login page links to the main habit page once you submit.
-    **Text** - The habit table is visually written with text, as well as the gallery table, log in box and new habit box
-    **Images** - Images are taking the place of stickers in the habit chart right now.
-    **Login** - Input box and submit button for login.
-    **Database** - The habit data and stickers will be pulled from the database on each page
-    **WebSocket** - The meter on the habit chart will show realtime habit tracking

### CSS deliverable
For this deliverable I properly styled the application into its final appearance.

-    **Header, footer, and main content body**
-    **Navigation elements** - Navigation is in the top left corner
-    **Reponsive to window resizing** - Everything is how I want it for the tables, they stay centered. Still need to work on new habit form.
-    **Application elements** - Used good contrast and whitespace
-    **Application text content** - Consistent fonts
-    **Application images** - Still just png that are in table. Those will be replaced with something from a database
## JavaScript deliverable

For this deliverable I implemented by JavaScript so that the application works for a single user. I also added placeholders for future technology.

- **login** - When you press enter or the login button it takes you to the habits page
- **database** -Displayed current habits for the week. Held in local storage which will be replaced by the database
- **WebSocket** - Gallery displays finished habits from all users in the database
- **application logic** - Adds a new habit and takes you to the habits page where it shows the habits for the week. Can increase the accomplished habit count by pressing a button. Still need to implent the sticker option, but this function will suffice for now

### Service deliverable

For this deliverable I added backend endpoints that receives habits

- **Node.js/Express HTTP service** -
- **Static middleware for frontend** - 
- **Calls to third party endpoints** - 
- **Backend service endpoints** - 
- **Frontend calls service endpoints** -
