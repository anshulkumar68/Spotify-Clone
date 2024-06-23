  import { createContext, useEffect, useRef, useState } from "react";
  import { songsData } from "../assets/assets";

  
  export const PlayerContext = createContext();
  
  const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  // To TRACK SONG STATUS
  const [track, setTrack] = useState(songsData[0]);
  // To TRACK PLAYER STATUS
  const [playStatus, setPlayStatus] = useState(false);
  // TIME DURATION
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // PLAY FUNCTION
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
// PAUSE FUNCTION
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
  }

  // PREVIOUS 
  const previous = async () => {
    if(track.id > 0){
      await setTrack(songsData[track.id -1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  // NEXT
  const next = async () => {
    if(track.id < songsData.length-1){
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  // SEEK SONG FUNCTION
  const seekSong = async(event) => {
    audioRef.current.currentTime = ((event.nativeEvent.offsetX / seekBg.current.offsetWidth)* audioRef.current.duration)
  }

  // TIME UPDATION
  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration*100))+"%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          }
        });
      };
    }, 1000);
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
