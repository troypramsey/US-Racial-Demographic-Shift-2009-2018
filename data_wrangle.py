# dependencies
import pandas as pd
from census import Census
from us import states

# census API key
from config import api_key

# API CALL
years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

for year in years:
    c = Census(api_key, year=year)

    # From API: Population, State FIPS, County FIPS
    total = pd.DataFrame(c.acs5.state_county('B01003_001E', Census.ALL, Census.ALL))
    white = pd.DataFrame(c.acs5.state_county('B02001_002E', Census.ALL, Census.ALL))
    black = pd.DataFrame(c.acs5.state_county('B02001_003E', Census.ALL, Census.ALL))
    latinx = pd.DataFrame(c.acs5.state_county('B03001_003E', Census.ALL, Census.ALL))
    native = pd.DataFrame(c.acs5.state_county('B02001_004E', Census.ALL, Census.ALL))
    asian = pd.DataFrame(c.acs5.state_county('B02001_005E', Census.ALL, Census.ALL))
    

    # Rename Census variables
    total = total.rename(columns={'B01003_001E': 'total'})
    white = white.rename(columns={'B02001_002E': 'white'})
    black = black.rename(columns={'B02001_003E': 'black'})
    latinx = latinx.rename(columns={'B03001_003E': 'latinx'})
    native = native.rename(columns={'B02001_004E': 'native'})
    asian = asian.rename(columns={'B02001_005E': 'asian'})

    # Create national county FIPS
    total['fips'] = total.state + total.county
    white['fips'] = white.state + white.county
    black['fips'] = black.state + black.county
    latinx['fips'] = latinx.state + latinx.county
    native['fips'] = native.state + native.county
    asian['fips'] = asian.state + asian.county

    # Recast FIPS as integer
    total = total.astype({'fips': 'int32'})
    white = white.astype({'fips': 'int32'})
    black = black.astype({'fips': 'int32'})
    latinx = latinx.astype({'fips': 'int32'})
    native = native.astype({'fips': 'int32'})
    asian = asian.astype({'fips': 'int32'})

    # Merge into single dataframe
    full = pd.merge(total, white, on='fips')
    full = pd.merge(full, black, on='fips')
    full = pd.merge(full, latinx, on='fips')
    full = pd.merge(full, native, on='fips')
    full = pd.merge(full, asian, on='fips')

    # Read in county names
    county_names = pd.read_csv('project_two/static/county_fips_master.csv', encoding = "ISO-8859-1")
    county_names = county_names[['fips', 'county_name', 'state_name']]
    county_names = county_names.astype({'fips': 'int32'})

    # Merge county names into data
    fullCounties = pd.merge(full, county_names, on='fips')

    # Clean data and extract necessary columns only
    fullCounties['white_pct'] = round((fullCounties.white/fullCounties.total*100), 2)
    fullCounties['black_pct'] = round((fullCounties.black/fullCounties.total*100), 2)
    fullCounties['latinx_pct'] = round((fullCounties.latinx/fullCounties.total*100), 2)
    fullCounties['native_pct'] = round((fullCounties.native/fullCounties.total*100), 2)
    fullCounties['asian_pct'] = round((fullCounties.asian/fullCounties.total*100), 2)
    fullCounties['nonwhite_pct'] = fullCounties.black_pct + fullCounties.latinx_pct + fullCounties.native_pct + fullCounties.asian_pct
    fullCounties['year'] = year
    fullCounties = fullCounties[['fips', 'county_name', 'state_name', 'nonwhite_pct', 'white_pct','black_pct', 'latinx_pct', 'native_pct', 'asian_pct', 'year']]
    
    # Export to JSON format
    fullCounties.to_json(f'project_two/data/census{year}.json', orient='records')