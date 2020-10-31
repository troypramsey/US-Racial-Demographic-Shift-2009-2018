# dependencies
import pandas as pd
from census import Census
from us import states

# census API key
from config import api_key

years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

for year in years:
    c = Census(api_key, year=year)
                 
    # From API: Population, ZipCode
    total = pd.DataFrame(c.acs5.zipcode('B01003_001E', Census.ALL))
    white = pd.DataFrame(c.acs5.zipcode('B02001_002E', Census.ALL))
    black = pd.DataFrame(c.acs5.zipcode('B02001_003E', Census.ALL))
    latinx = pd.DataFrame(c.acs5.zipcode('B03001_003E', Census.ALL))
    native = pd.DataFrame(c.acs5.zipcode('B02001_004E', Census.ALL))
    asian = pd.DataFrame(c.acs5.zipcode('B02001_005E', Census.ALL))
    

    # Rename Census variables
    total = total.rename(columns={'B01003_001E': 'total', 'zip code tabulation area': 'zipcode'})
    white = white.rename(columns={'B02001_002E': 'white', 'zip code tabulation area': 'zipcode'})
    black = black.rename(columns={'B02001_003E': 'black', 'zip code tabulation area': 'zipcode'})
    latinx = latinx.rename(columns={'B03001_003E': 'latinx', 'zip code tabulation area': 'zipcode'})
    native = native.rename(columns={'B02001_004E': 'native', 'zip code tabulation area': 'zipcode'})
    asian = asian.rename(columns={'B02001_005E': 'asian', 'zip code tabulation area': 'zipcode'})

    # Create national county FIPS
#     total['fips'] = total.state + total.county
#     white['fips'] = white.state + white.county
#     black['fips'] = black.state + black.county
#     latinx['fips'] = latinx.state + latinx.county
#     native['fips'] = native.state + native.county
#     asian['fips'] = asian.state + asian.county

    # Recast zipcode as integer
    total = total.astype({'zipcode': 'int32'})
    white = white.astype({'zipcode': 'int32'})
    black = black.astype({'zipcode': 'int32'})
    latinx = latinx.astype({'zipcode': 'int32'})
    native = native.astype({'zipcode': 'int32'})
    asian = asian.astype({'zipcode': 'int32'})

    # Merge into single dataframe
    full = pd.merge(total, white, on='zipcode')
    full = pd.merge(full, black, on='zipcode')
    full = pd.merge(full, latinx, on='zipcode')
    full = pd.merge(full, native, on='zipcode')
    full = pd.merge(full, asian, on='zipcode')

    # Read in county names
#     county_names = pd.read_csv('project_two/static/county_fips_master.csv', encoding = "ISO-8859-1")
#     county_names = county_names[['fips', 'county_name', 'state_name']]
#     county_names = county_names.astype({'fips': 'int32'})

    # Merge county names into data
#     fullCounties = pd.merge(full, county_names, on='fips')

    # Clean data and extract necessary columns only
    full['black_pct'] = round((full.black/full.total*100), 2)
    full['latinx_pct'] = round((full.latinx/full.total*100), 2)
    full['native_pct'] = round((full.native/full.total*100), 2)
    full['asian_pct'] = round((full.asian/full.total*100), 2)
    full['nonwhite_pct'] = full.black_pct + full.latinx_pct + full.native_pct + full.asian_pct
    full['year'] = year
    full = full[['zipcode', 'nonwhite_pct','black_pct', 'latinx_pct', 'native_pct', 'asian_pct', 'year']]
    
    print(full)
    # Export to JSON format
    full.to_json(f'project_two/data/censuszip{year}.json', orient='records')