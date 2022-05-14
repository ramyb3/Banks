import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Bank from './bank';

function App()
{
    const [banks,setBanks]= useState([]);
    const [city,setCity]= useState('');

    useEffect(()=>
    {
        // check permission to user location
        window.navigator.permissions && window.navigator.permissions.query({name: 'geolocation'})
        .then(async function(PermissionStatus) 
        {
            if (PermissionStatus.state === 'granted' || PermissionStatus.state === 'prompt') 
            {
                window.navigator.geolocation.getCurrentPosition(async(position) => {

                    let location= await getLocation([position.coords.latitude,position.coords.longitude]);
                    let list= await getData(location);
                    
                    setBanks(list);
                }); 
            }
        })  
    },[])

    const getBanks= async()=>
    {
        if(city!='')
        {
            let list= await getData(city);
            setBanks(list)

            if(list.length==0)
            alert('אין תוצאות! נסו שוב')
        }

        else
        alert('נא להקליד עיר בשביל לקבל תוצאה!')
    }

    return (<>

        <h1>כל סניפי הבנקים שבעיר שלך</h1>
        
        {banks.length>0?
            <div className="container">     
            {
                banks.map((bank,index)=> 
                {
                    return <div className="card" key={index}>
                        <Bank bank={bank}/>
                    </div>
                })
            }
            </div>
            : 
            <> 
                <input placeholder='הזן עיר' type='text' onChange={e=> setCity(e.target.value)}/>
                <button onClick={getBanks}>חפש</button>
            </>
        }
    </>)
}

export default App;

export const getData = async (location) => // get data about banks
{
    let resp= await axios.get('https://data.gov.il/api/3/action/datastore_search?resource_id=1c5bc716-8210-4ec7-85be-92e6271955c2&&limit=0')
    let total= resp.data.result.total; //get all israel banks
    
    resp= await axios.get('https://data.gov.il/api/3/action/datastore_search?resource_id=1c5bc716-8210-4ec7-85be-92e6271955c2&&limit='+total)

    //returns all banks in the city
    return resp.data.result.records.filter(x=> x.City.replace(/\s/g, '').includes(location.replace(/\s/g, '')) && x.Date_Closed=='')
}

export const getLocation= async (position)=> // get location using google maps api
{
    const key='<PUT YOUR API KEY HERE>'; // api key

    let resp= await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${position[0]},${position[1]}&key=${key}`);
    return resp.data.results[0].address_components.find(x=> x.types.includes('locality') && x.types.includes('political')).long_name; //get user's city    
}
