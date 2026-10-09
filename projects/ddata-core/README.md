# DDataCore

DData Core module, models & services

## Install

`npm install @netdjw/ddata-core --save`

## Why?

Almost every project needs to fetch data from backend, some case need to store datas in LocalStorage
and keep sync local stored datas with the remote storage.

If you fetch datas from remote or local storage maybe you need to convert plain JSON objects to specified
JavaScript models (class instances). And while the datas loading you want to show a nice spinner or
overlay message to the user to say "Hey, please be patient, I'm working on your request!".

Maybe you need to validate datas before save to local-, or remote storage.

Of course you need to handle errors and present the error messages a nice way to your users.

It this is right, this package is created for you.

## How?

- [Models](src/doc/models.md)
- [Types](src/doc/types.md)
- [Services](src/doc/services.md)
- [Components](src/doc/components.md)
