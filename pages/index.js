import { useState } from 'react';
import { Buffer } from 'buffer';
import dynamic from 'next/dynamic'
import CurrentDate from '../components/Curretdate';
const ComponentWithNoSSR = dynamic(
  () => import('../components/Time'),
  { ssr: false }
)

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
const redirect_uri =  'http://localhost:3000/'
let access_token = null

function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const [likes, setLikes] = useState(0);

  function handleClick() {

    setLikes(likes + 1);
  }
 
  return (
    <>
      <div className='main'>  </div> 
      <div className='container'>  
        <ComponentWithNoSSR/>
        <CurrentDate/> 

 
       
   
        <div className='content' >
     
          <button onClick={authorization}>Like ({likes})</button>
          <button onClick={getAccessToken}>Access</button>
          <button onClick={getRefreshToken}>Refresh</button>
          <button onClick={getRecentlyPlayed}>Recently Played</button>
       
      
        </div>
  
      </div>
    </>
  );
}





function authorization(){
  const scope =  'user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private'
  const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`
 ;
 window.location.href = url
 }
 


async function getAccessToken(){
const code = 'AQARxhH4ZuagExvgv1xEhdlWzt8OlXXljhAMTxJ65LC8zEprE0AjVZKrHDFBUx8MaQS1EjEfqjI2pATNpJsAr3mZCEyIlbaCKgXqb3rr0boUrHv2EZpKJD_enehuL8aruTDUyro4Y9bwsBVmTnO6peXo_WkiExMTT1u6xC3CD5WAOkKcrwM9anYMdMHta8KvGcPp5ofZdhWqpz7xWQVA6zvTF9cgNScpJKJDBaeDj7Db4I69-TNmtBQ1RaJXc4sBE-KwGZ9gFYqjnhF88v2WleN2Zl3h3F3_EY_9TcQVz8bGGrxykJSSMkCWWeSrJF8cfeeRJYvJZcbD2AHh3_9rR5X5oIZzO0DB_nggy4cWhqRgRzT8xXN4AI41HumWTWwtUw4yWSaLxdWUzaFs2GS8asst2mqG-iyxQoIBf_qRW0zi'
const tokenUrl = "https://accounts.spotify.com/api/token";
const auth = Buffer.from(client_id + ':' + client_secret).toString('base64')
const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
    },
    body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`
       }
const response = await fetch(tokenUrl,options)
const data = await response.json()
access_token = data.access_token
      }

     


      async function getRefreshToken(){
        const refresh_token = process.env.NEXT_PUBLIC_REFRESH_TOKEN;
        const url = 'https://accounts.spotify.com/api/token';
        const authOptions = {
          method: 'POST',
          headers: { 
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded' // specify content type
          },
          body: `grant_type=refresh_token&refresh_token=${refresh_token}`
        };
        
        try {
          const res = await fetch(url, authOptions);
          console.log(res); // log the response object
          const data = await res.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      }
      
      async function getRecentlyPlayed(){
        const feedback = await fetch( "https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }})

    const result = await feedback.json()
    console.log(result)
     console.log( result.items[0].track.album.images[0].url)
     document.querySelector('.main').style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`
      document.querySelector('.content').style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`
      }