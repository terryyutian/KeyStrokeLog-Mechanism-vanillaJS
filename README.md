# Keystroke_Logging_OpenSource

A keystroke logging mechanism to collect keystroke data for research and development purposes.

The keystroke logging program was written in vanilla JavaScript. It unobtrusively collects information about users' keystroke and mouse operations from the front end. The information is aggregated and posted to the back end whenever the user hits the "Send" button in the chatbot. At the back end, the keystroke information is handled via a FastAPI app that connects to a cloud-based Azure table storage. Finally, all the keystroke information is stored in the Azure table storage in tabular format.

In the output of keystroke data, Event ID indexes the keyboard and mouse operations in chronological order. EventTime denotes the time (in milliseconds) when a key or the mouse was pressed. Output shows the content of the keystroke or mouse event. CursorPosition registers cursor position information to help keep track of the location of the leading edge. Additionally, TextChange shows the exact changes made to the current text while Activity indicates the nature of the changes (e.g., Input, Remove/Cut).

To run this package on your computer, please build docker images and contains following the instructions below:

#### Docker images and containers

Create a `.env` file in the project root.

```bash
touch .env
```

Define the following env variables inside the `.env` file (note that in the example fastAPI, the keystroke logs will be ingested to an Azure table storage):

`CONN_STR`=""
`TABLE_NAME`=""

Build the docker images and container.

```bash
docker-compose up
```

#### Moderations to be made for the implementation of the package

1. Use the keystroke logging program in the static folder (keylogprogram.js) to collect keystroke information in the textarea. Depending on the html webpage you use, you need to change the textarea id and submit button id in the keylogprogram.js file.
2. If you also want to use the fastAPI in this package, depending on which storage system you use, you need to change the code to connect to the target database. Note that this example fastAPI connects to an Azure table storage, which is a NoSQL database that stores data in tabular format.
