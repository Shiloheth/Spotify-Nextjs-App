

export default function MyComponent({audioref}) {
  


function playAudio() {
  audioref.current.play()
  }

return(
<>
<audio ref={audioref}></audio>
  <button className='play' onClick ={playAudio}>PLAY</button>
</>  )
}