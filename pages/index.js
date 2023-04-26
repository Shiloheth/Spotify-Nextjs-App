import { Buffer } from 'buffer';
import React, { useRef,useState,useEffect } from 'react';

import dynamic from 'next/dynamic'
import CurrentDate from '../components/Curretdate';
import MyComponent from '../components/Sound';
import { supabase } from './../lib/supabaseClient';
import Loader from '../components/Loader';



const ComponentWithNoSSR = dynamic(() => import('../components/Time'), { ssr: false });

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const code = process.env.NEXT_PUBLIC_CODE;
const redirect_uri = 'http://localhost:3000/'



export default function HomePage() {
  const inputRef = useRef(null);
  const[isPlaying,setIsPlaying]=useState(false)
  const[lastSeen,setLastSeen] = useState(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (inputRef.current?.paused) {
        fetchSongs();
      }
  
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

 


  async function fetchSongs() {
  const access_token = await getToken()
  try{
  const feedback = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  })

  const result = await feedback.json()

  if(!feedback.ok){throw new Error(result.error.message)}



 

  if (result.is_playing === false || result.currently_playing_type !== 'track') {

    const feedback = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })
    
 
    const result = await feedback.json()
    setIsPlaying(false)
    setLastSeen(result.items[0].played_at.slice(11,19))                    
    document.querySelector('.main').style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`
    document.querySelector('.content').style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`
    document.querySelector('.artist').textContent = result.items[0].track.artists[0].name
    document.querySelector('.song').textContent = result.items[0].track.name
    inputRef.current.src = result.items[0].track.preview_url;
    document.querySelector('.loader').classList.remove("loader")

  } else{
    setIsPlaying(true)
    document.querySelector('.main').style.backgroundImage = `url(${result.item.album.images[0].url})`
    document.querySelector('.content').style.backgroundImage = `url(${result.item.album.images[0].url})`
    document.querySelector('.artist').textContent = result.item.artists[0].name
    document.querySelector('.song').textContent = result.item.name
    inputRef.current.src = result.item.preview_url;
    document.querySelector('.loader').classList.remove("loader");
  }
  }
  catch(error){
    console.log(error.message)
    if(error.message==='The access token expired'){
    getRefreshToken()}
  }






   }





 async function getAccessToken(){
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const auth = Buffer.from(client_id + ':' + client_secret).toString('base64');
  const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
      },
      body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`
  };
  
  const response = await fetch(tokenUrl,options);
  const data = await response.json();
 

  
  updateToken(1, data.access_token)
  setrefreshtoken(1,data.refresh_token)
  getToken()



  
 }

 
  return (
     <>
      
       <div className='main'></div> 
       <Loader/>
       {isPlaying?<div className='circle'>LIVE</div>:<div className='lastSeen'>Last Seen:{lastSeen}</div>}
       <div className='container'>  
        <ComponentWithNoSSR />
        <CurrentDate /> 
        <div className='content'>
        </div>
        <MyComponent audioref={inputRef} />
   
        <div className='track'>
          <div className='song'></div>
          <div className='artist'></div>
      
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


 async function getRefreshToken() {
  const refresh_token = await getRefresh()
  const url = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`
  };

  try {
    const res = await fetch(url, authOptions);
    const data = await res.json();
    updateToken(1,data.access_token)
  } catch (error) {
   
  }
}

      
async function setrefreshtoken(id,refreshtoken){
 
    const { data, error } = await supabase
      .from('RefreshToken')
      .update({ Refreshtoken: refreshtoken })
      .eq('id', id)
  
    if (error) {
    
    }
  
    
  
}

async function getToken() {

  let { data } = await supabase.from('Token').select()
  return data[0].accessTokens
}

async function getRefresh() {

  let { data } = await supabase.from('RefreshToken').select()
 
  return data[0].Refreshtoken
}

 async function updateToken (id, newToken) {
  const { data, error } = await supabase
    .from('Token')
    .update({ accessTokens: newToken })
    .eq('id', id)

  if (error) {
   
  }


}






