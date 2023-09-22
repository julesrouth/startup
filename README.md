
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
-   **WebSocket**  - 
-   **React**  - Application ported to use the React web framework.
