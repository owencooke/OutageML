# OutageML

https://user-images.githubusercontent.com/83478026/235809636-30e9a382-2c49-4c62-95e2-e0b854d06f58.mov

## Won 2nd Place at the 2023 APIC Energy Hackathon 🎉

![APIC 2023 Certificate](https://github.com/owencooke/OutageML/assets/90405643/b8b590c8-af9d-4e12-9477-05bb225ed6f8)



### Frontend

- React (frontend framework)
  - Create React App (support for TSX, ES6, TypeScript, no need to install bundler, ...etc)
- Leaflet.js
- Tailwind CSS

### Backend

- Python3 (backend language)
  - Poetry (Python dependency management system)
  - Black (formatter)
  - Psycopg2 (PostgreSQL adapter for Python)
  - Python-decouple (to get env file content)
- Django (backend framework)
  - Django REST Framework (Django's toolkit for building Web APIs)
- PostgreSQL (database)
- PyTorch

## Getting Started
Clone this repository to your local machine:

```bash
git clone git@github.com:owencooke/OutageML.git
```

### To run the client

In the project folder,

```bash
cd client
npm i && npm run dev
```

### To run the server

#### Django and PostgreSQL

Need to be on UNIX environment

You first need to have [PostgreSQL](https://www.postgresql.org/download/) installed and running, and create a user and a database. Afterwards, create `./server/.env` file to store your database information along with some Django settings. It should have values for all the following keys:

##### `./server/.env` file

```python
SECRET_KEY = <YOUR_DJANGO_SECRET_KEY>
DEBUG = True  # set to False in production
DB_NAME = <YOUR_DB_NAME>
DB_USER = <YOUR_USER_NAME>
DB_PASSWORD = <YOUR_USER_PASSWORD>
DB_HOST = localhost  # set to your domain name in production
DB_PORT = 5432  # default postgreSQL port
```

#### Poetry

In addition to the database, you need to setup the Python environment. We use [poetry](https://python-poetry.org/docs/#installation) for dependency management, so poetry needs to be installed first. Once installed, in the project folder,

```bash
$ poetry shell  # this should create a virtualenv for you at .venv and start using it
$ poetry install
$ cd server
$ python manage.py migrate  # make sure your selected Python interpreter is the one in .venv
$ python manage.py runserver
```
