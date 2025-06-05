Add a .env file with those variables: 
```
AWS_URL
AWS_DEFAULT_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

And change the last lign `searchContentInS3('YourBucketName', 'TheContentToSearch')` before running the script with `npx ts-node s3search.ts`
