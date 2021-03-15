# Description:
API that scrapes an input URL and parse its OG metadata. If the page has OG parameters set exclusively, then the API must return all the OG parameters. If
they are not set, the API must parse the webpage to get relevant details such as title, description, images etc.

# Sample Input :

# API :: https://uozstipovc.execute-api.us-east-1.amazonaws.com/dev/fetchMetaData
#  Body ::
{
"url": "https://github.com/vishnuaug16/DiagnalWorkshop/tree/develop"
}

#  Response :: 

{
    "title": "vishnuaug16/DiagnalWorkshop",
    "description": "Contribute to vishnuaug16/DiagnalWorkshop development by creating an account on GitHub."
}

#  Sample 2 ::
#  Input :
{
"url": "https://google.com/"
}
#  Response:
{
    "description": "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
    "robots": "noodp",
    "image": "/images/branding/googleg/1x/googleg_standard_color_128dp.png"
}



# Design:

application is designed in a RESTful API to which the URL to be fetched is given as an input parameter.

# Tech Stack Requirements:

RESTful API is being built, it uses the following stack:

1. Nodejs
2. Any FaaS platform - AWS Lambda or Azure Functions
3. Serverless Framework for deployment

# Extensibility:

multiple URL should be passed adn get all the meta informartions at once.