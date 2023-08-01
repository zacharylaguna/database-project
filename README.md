### Zachary Laguna
### Ernest Villafana
### Jack Butler
### Walker Drury
### Kyle Blanco

# Real management

sudo bash real-mgmt/run-background.sh
web: http://3.17.248.106:3000/
app: http://3.17.248.106:4000/


### Client
Create the react app (already completed)
```
npx create-react-app client
```

Getting started
```bash
cd client
npm i
```

To run the react app
```bash
cd client
npm start
```

### Server

Getting started
```bash
cd server
npm i
```

To run the server
```bash
node index.js
```

To make new package.json
```bash
npm init
```

## Example login
### Manager
```
Username: inewton
Password: 123
```

### Tenant
```
Username: cdarwin
Password: 123
```

### Contractor
```
Username: kjenson
Password: 123
```

## Commit to GitHub
Before pulling for the first time, authenticate with GitHub via SSH or through the VS Code prompts.
```bash
cd <root directory with client and server>
git add *
git commit -m "message"
git push
```

## Connect directly to the hosted database
Connecting directly to the database is useful when creating tables for the first time or debugging applications that interact with the database.
```bash
psql --host=real-mgmt-pg-1.cfa8nnooilud.us-east-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=real-mgmt
```
Learn more at the [RDS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html).

## Useful resources
- https://www.youtube.com/watch?v=ldYcgPKEZC8&t=1114s
- https://stackabuse.com/using-aws-rds-with-node-js-and-express-js/
- https://www.youtube.com/watch?v=NjYsXuSBZ5U&t=1s
- https://www.youtube.com/watch?v=XDMgXZUfa10
- https://reactrouter.com/docs/en/v6/getting-started/overview
- https://mherman.org/blog/dockerizing-a-react-app/
- https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-make-a-get-request
