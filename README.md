# Linkapi Challenge

## Architecture 01 (Active)
![alt text](https://github.com/vitormarcelino/linkapi-challenge/blob/main/architecture1.png?raw=true)

To run integration, run:

```
adonis sync:pipedrive:deal
```


## Architecture 02 (Passive)
![alt text](https://github.com/vitormarcelino/linkapi-challenge/blob/main/architecture2.png?raw=true)

To run integration, run:

```
adonis consume:pipedrive:update
```

## Configuration
Copy .env.example file to .env and configure the variables

## Run Aplication
To run the application, run:

```
pm2 start
```