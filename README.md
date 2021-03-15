#Description:
API that scrapes an input URL and parse its OG metadata. If the page has OG parameters set exclusively, then the API must return all the OG parameters. If
they are not set, the API must parse the webpage to get relevant details such as title, description, images etc.

#Design:

application is designed in a RESTful API to which the URL to be fetched is given as an input parameter.

#Tech Stack Requirements:

RESTful API is being built, it uses the following stack:

1. Nodejs
2. Any FaaS platform - AWS Lambda or Azure Functions
3. Serverless Framework for deployment

#Extensibility:

multiple URL should be passed adn get all the meta informartions at once.