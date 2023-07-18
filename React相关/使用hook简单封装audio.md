# 使用 hook 简单封装 audio

[演示效果](./_demo/useMedia/index.html)

## 实现

```js
const useMediaPlay = (mediaRef) => {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!mediaRef.current) return;
    const audio = mediaRef.current;
    audio.addEventListener("playing", () => {
      setPlaying(true);
    });
    audio.addEventListener("pause", () => {
      setPlaying(false);
    });
  }, []);

  const play = () => {
    mediaRef.current && mediaRef.current.play();
  };

  const pause = () => {
    mediaRef.current && mediaRef.current.pause();
  };
  return {
    playing,
    play,
    pause,
  };
};

// 播放时间控制
const useMediaDuraion = (mediaRef) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0.1);
  useEffect(() => {
    if (!mediaRef.current) return;
    const audio = mediaRef.current;
    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
  }, []);
  const updateCurrentTime = (value) => {
    mediaRef.current.currentTime = value;
  };
  return {
    currentTime,
    updateCurrentTime,
    duration,
  };
};

// 声音操作控制
const useMediaVolume = (mediaRef) => {
  // volume的范围: [0,1]
  const [volume, setVolume] = useState(0.5);
  useEffect(() => {
    if (!mediaRef.current) return;
    const audio = mediaRef.current;
    audio.addEventListener("volumechange", () => {
      setVolume(mediaRef.current.volume);
    });
  }, []);
  const updateVolume = (value) => {
    mediaRef.current.volume = value;
  };
  return {
    volume,
    updateVolume,
  };
};

// 导出给外部使用的useMedia
const useMediaControl = (item) => {
  const mediaRef = useRef(null);

  useLayoutEffect(() => {
    if (!mediaRef.current) {
      mediaRef.current = document.createElement("audio");
      mediaRef.current.src = item.src;
      mediaRef.current.preload = "auto";
    }
  });

  const { playing, play, pause } = useMediaPlay(mediaRef);

  const { currentTime, updateCurrentTime, duration } =
    useMediaDuraion(mediaRef);

  const { volume, updateVolume } = useMediaVolume(mediaRef);

  return {
    state: {
      playing,
      currentTime,
      duration,
      volume,
    },
    action: {
      play,
      pause,
      updateCurrentTime,
      updateVolume,
    },
  };
};
```

## 相关的库&&文章

[[译]Web视频播放原理：介绍](https://www.dazhuanlan.com/tichuan/topics/957744)

## 参考

- [Video and Audio APIs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs)
- [https://www.zhangxinxu.com/wordpress/2019/07/html-audio-api-guide/](https://www.zhangxinxu.com/wordpress/2019/07/html-audio-api-guide/)