Add a .env file with those variables: 
```
AWS_URL
AWS_DEFAULT_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

And then run the script with this command: `npx ts-node s3search.ts <your-bucket-name> <the-content-your-looking-for>`