# Next.js Nikola Shop
To start, you will need the database to be running locally
```
docker-compose up -d
```

* Here the flag -d means __detached__

* MongoDB local URL:
```
mongodb://localhost:27017/nikoladb
```

* Rebuild node modules and start nextJS dev enviroment
```
npm install
npm run dev
```

## Configure env variables
Rename the file __.env.template__ to __.env__

## Fill database with sample information
Call:
```
    http://localhost:3000/api/seed
```