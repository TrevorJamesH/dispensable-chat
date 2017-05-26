# dispensable-chat
Socket.io party chat
Team name: `dispensable-flicker`

http://jsdev.learnersguild.org/goals/378-Socket-Party_Chat.html

## Instructions

Type the following in your terminal
1. `git clone https://github.com/TrevorJamesH/dispensable-chat.git trevorSocket`
2. `cd trevorSocket`
3. `npm run init-db`
4. Get the Secret code from our team via Slack
5. `echo "The secret code you got from us" > .env`
6. `npm start`
8. Open Google chrome to `localhost:3000`
9. Say "WOW this is amazing!"
10. Give us 100% on the project in slack by typing `/review #dispensable-flicker 100`
11. Give us high-gives too.

## Specifications

Our own added spec. (Gives us credit/points for it? I heard it's a guild wide spec now)
- [X] No linting errors. You can run eslint with `npm run lint`.

### General Specs

- [X] App has a **landing page** (on route `/`) where a user can either **log in** of **sign up**.
- [X] App has a **home page** (on route `/home`) where the user can see a list of chatrooms they have subscribed to along with a feed of all the conversation for currently selected room.
- [X] Uses Socket.io to make a socket.
- [X] Uses ajax/fetch calls to communicate with API endpoints.
- [X] Backend view rendering ( via pug or HTML ) is separated from API and socket actions.
- [X] Uses Javascript and/or jQuery for dymanic DOM mode creation and manipulation.
- [X] Repo includes a README.md with [spec list](http://jsdev.learnersguild.org/) and it is checked off with completed specs.
- [X] All dependancies are properly declared in a `package.json`
- [X] Variables, functions, files, etc. have appropriate and meaningful names.
- [X] Functions are small and serve a single purpose.
- [X] The artifact produced is properly licensed, preferably with the MIT license.

### User log-in/sign-up story

- [X] View has a `log-in` button.
- [X] View has a `sign-up` button.
- [X] When `log-in` button is clicked, both `log-in` and `sign-up` button are hidden and a `log-in form` takes their place on the screen.
- [X] Same as above for `sign` up, but instead of a `log-in form` we see a `sign-up form`.
- [X] On **either form** clicking a `cancel` button removes the form from view, and we again get a view with the two buttons.
- [X] On `log-in form`, clicking submit will check to see if the user exists and authenticate the entered password with the user's stored password.
- [X] On `sign-up form`, clicking submit adds them to the database and logs them in.
- [X] On log-in, after the user is authenticated, a session is set.
- [X] Closing the page and reopening it will redirect user to `/home`
- [X] Session persists until `logout` or after 30 minutes pass.

### User chatroom story

- [X] User can make a new chatroom by clicking a `+` button.
- [X] User can search on a search bar that auto-completes with all of the chatrooms in the database that match the entered string.
- [X] User can see a `chatroom list` of all of the chatrooms they have subscribed too.
- [X] `<div class='messages [other classes] >'` exists as a container to where messages for a current chatroom are displayed.
- [X] When a chatroom in `chatroom list` is clicked, the `<div class='messages [other classes] >` displays a list of all the current messages in that chatroom.
- [X] User can unsubscribe from a chatroom and it is deleted from their `chatroom list`.
- [X] `messages div` has a textarea where you can enter a message.
- [X] User can send a message by clicking a send button and/or pressing the enter keyboard key.
- [X] Messages are displayed in descending chronological order. ( oldest on top of history )
- [X] User's sent messages are displayed on the right side, all other messages on the left side.
- [X] Anytime a message is sent, anyone in the chatroom can see the new message almost immediately. ( You can do this by logging in as a different user on a new browser window )
