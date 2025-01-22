The goal is to implement the new backend.
We will do this in 3 steps:
- Step 1: Implement data fetching for items and collections **->you will do this**
- Step 2: Implement data mutations (you can do this if you're fast, but do 1 first and let us know if you're done)
- Step 3: Implement new function calls (this is not ready yet)


Here's the API (it's slow when you query it first after a while of inactivity, just wait. This is temporary):
https://clip-api-119123333996.us-central1.run.app/graphql

Use the visual explorer to understand it. Check out the demo code in /INSTRUCTIONS/test_frontend.zip

This code already implements the new backend. You can take it as inspiration (it uses **apollo** to implement the graphql API).

You're task: 
- Implement the new API and pass a firestore token: `auth.currentUser.getIdToken()` (if you fail with auth, the API will still return demo data, just so you know)
- Complete Step 1, by replacing the data fetching from firestore with fetching for collections and items from the new API instead.
Ignore features that don't have endpoints in the API yet.

You can use email login with these credentials to have data available: demo@clipmate.ai, Demo-123

There's some documentation on the firestore setup in the project in INSTRUCTIONS/Clipmate...pdf


I will follow up with a loom, ask me any question directly if you get stuck.
