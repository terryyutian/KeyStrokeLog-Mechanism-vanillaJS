from fastapi import FastAPI
from routers import key
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static/keylog", StaticFiles(directory="static"), name="static")
app.include_router(key.router)










