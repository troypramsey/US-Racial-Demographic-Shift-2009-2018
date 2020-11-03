# US Racial Demographic Shift: 2009-2018

### Q: Is the US becoming more diverse?
After some exposure to the US Census module in Python, we wanted to somehow combine census data with JavaScript to build interesting maps and charts. In exploring the data, we discovered various changes in demographic proportions across multiple US counties. We've always *heard* that the US was becoming more diverse year on year, but we wanted to see it, specifically whether that diversification was stretching across all of the country's geography.

### Data
Our data was sourced calling the US Census Bureau API using the Census module in Python. We pulled in data for the five major racial/ethnic categories, determined each category's proportion of a given county's population, and saved each year's worth of data into a dataframe using Pandas. We exported these dataframes into JSON objects and loaded them into MongoDB. We then deployed the objects to a Mongo cluster for cloud access to data so as to mitigate the need to recreate all files locally on a given machine.

### Visualizations
We chose to use two types of visualizations:
- A responsive map built entirely in base D3
- Two charts in Plotly.js, one static line chart to show raw national change over time, and one interactive bar chart to give access to the top ten highest proportion nonwhite majority counties by any given state or year.

### How to Run the App
- Pull down the repository [here](https://github.com/troypramsey/group_project2).
- All necessary Python modules are available in the requirements.txt file. We recommend using pip to install all of them into a new virtual environment, as some modules are inaccessible to Conda.
- Once all necessary modules are installed into your environment, navigate to the root folder of the repository and use "python app.py" in your command line.
- Click the link to your local host in the flask response to open the web app.
- All API call instructions can be found using the 'API' link in the site navbar. Feel free to query any state or year, as the cluster connection has been established using safe read-only parameters with a direct URI.



















<!-- - Pull down this repo and cd into it
- Open requirements.txt, uncomment first line, replace <env> with environment name, and paste the whole document into a GitBash terminal
- Run "python3 app.py" in repo root folder -->