from fastapi import APIRouter, Request, HTTPException
from schemas import KeyBase
from azure.data.tables import TableServiceClient
from azure.core.exceptions import ResourceExistsError
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os
import dotenv

# load the .env file
assert dotenv.load_dotenv(".env")

router = APIRouter()

conn_str = os.getenv("CONN_STR", "")
table_name = os.getenv("TABLE_NAME", "")



templates = Jinja2Templates(directory = "templates")


@router.get('/', response_class = HTMLResponse)
def keylog(request:Request):
    context = {'request': request}
    return templates.TemplateResponse('front.html', context)


@router.get('/keylogprogram')
def program():
     return 

# Handle Post requests: get the data and insert it to database  
@router.post('/')
def create_key(request:KeyBase):
    try:
        # Initialize the TableServiceClient
        service_client = TableServiceClient.from_connection_string(conn_str="DefaultEndpointsProtocol=https;AccountName=keystrokelogging;AccountKey=6y1TvDcNzZRpByVGdJKbCzkLTZb+6mP4WMAWEyBtehCoQW4KaIQy2EmeH2gjCVSXs9JuypEYFou5+AStPukBQw==;EndpointSuffix=core.windows.net")
        table_name = "keys13"
        table_client = service_client.get_table_client(table_name)
        # a for loop to insert data entity by entity
        for i in range(len(request.EventID.split(","))):
                entity = {
                "PartitionKey": request.PartitionKey, 
                "RowKey": request.RowKey.split(",")[i], 
                "EventID": request.EventID.split(",")[i],
                "EventTime": request.EventTime.split(",")[i],
                "Output": request.Output.split("<=@=>")[i],
                "CursorPosition": request.CursorPosition.split(",")[i],
                "TextChange": request.TextChange.split("<=@=>")[i],
                "Activity": request.Activity.split("<=@=>")[i]
                }
                table_client.create_entity(entity)
    
    except ResourceExistsError as rex:
        raise HTTPException(status_code=400, detail="Resource already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


