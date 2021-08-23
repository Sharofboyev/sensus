# Test project for sensus

1) Надо сначала скачать код и на команлном строке надо писать 
```
npm install
```

2) Создание .env файла
Пример .env файла
```
DB_HOST=localhost
DB_NAME=WAADSU
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_APPLICATION=waadsu_api
API_PORT=4000
```

Я сохранил координаты на формате JSON, так как не все PostgreSQL серверы могут иметь расширение PostGIS

В конце надо в командном строке писать
```
npm start
```
