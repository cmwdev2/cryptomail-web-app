# Account System Design

- Account state is auto persisted in local storage when changed.
- Account state is read from local storage in new app session.

## Signup
1. Provide all user-entered data.

Clear last error before accepting user input. When account name text box is de-focused, call `dispatch(checkAccountNameAvailability)`
if last error is set - show red `-` next to name - name is taken. If error cleared then remove - 

2. Data include eth provider signed eth address.
3. Call `dispatch(signup(userData))`

All other account state fields will be set. Result will be new `Account` in state or last error. Once account is not null is tate, user is logged-in.

## Login
canLogIn: enc_seed in account state
isLoggedIn condition: `all account state fields are not null`

On app startup, user may be auto logged-in by the app. Startup flow should check the login condition and if the user logged in it should try getting thread-boxes for the account and update Account in state with server result and thread-boxes state.

login-flow
1. Clear all account fields besides `enc_seed` in state
2. Display login react component
3. get account name from user input
4. Call getAccountInfo to server to check if account exists - result: error or account_info in store.
5. Call `interactiveLogin` using user provided password

## Logout
- Clear all account state fields EXCEPT enc_seed field

