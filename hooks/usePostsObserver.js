import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { VideoAnalytics } from '../lib/rxSubject';
import { getCookie } from '../lib/session';
import { postImpressionApi } from '../services/assets';
const usePostsObserver = (posts) => {
  const auth = getCookie("auth");
  const router = useRouter()
  if (!auth || router.pathname === "/profile") return null
  const viewPortItem = useRef({});
  const videoPayload = useRef({});
  const timeOutRef = useRef()
  const profile = useSelector((state) => state.profileData);
  let observer;

  useEffect(() => {
    const postObs = VideoAnalytics.subscribe((data) => {
      videoPayload.current[data.postId] = {
        ...data,
        viewerId: profile._id,
      }
    })
    return () => postObs.unsubscribe();
  }, [])

  const setIntersectionObserver = async (data = {}) => {

    const moment = (await import('moment')).default;
    observer = new IntersectionObserver(
      (entries, observer) => {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            let currentObj = viewPortItem.current[entry.target.id]
            viewPortItem.current[entry.target.id] = {
              postId: entry.target.id,
              startTime: entry.isIntersecting ? Date.now() : currentObj?.startTime,
              watchedDuration: (entry.isIntersecting ? (currentObj?.watchedDuration || 0) : currentObj?.watchedDuration + moment().diff(currentObj?.startTime, "seconds")) || 0,
              postType: posts.find(p => p.postId === entry.target.id)?.postType || 3,
              viewerId: profile._id,
              mediaType: 1,
            }
          }
        });
      },
      { threshold: 0.8 }
    );
    for (let item of posts) {
      if (item.isVisible) {
        const node = document.getElementById(item.postId);
        if (node && observer && observer.observe) {
          observer.observe(node);
        }
      }
    }
  };
  useEffect(() => {
    if (getCookie("auth")) {
      setIntersectionObserver()
    };
    if (timeOutRef.current) {
      let payload = [...Object.values(viewPortItem.current), ...Object.values(videoPayload.current)]
      if (payload.length) {
        postImpressionApi({ posts: payload });
        viewPortItem.current = {}
      }
      clearInterval(timeOutRef.current)
    }
    timeOutRef.current = setInterval(() => {
      let payload = [...Object.values(viewPortItem.current), ...Object.values(videoPayload.current)]
      if (payload.length) {
        postImpressionApi({ posts: payload });
        viewPortItem.current = {}
      }
    }, 10000)
  }, [posts]);
  useEffect(() => {
    return () => {
      let payload = [...Object.values(viewPortItem.current), ...Object.values(videoPayload.current)]
      if (payload.length) {
        postImpressionApi({ posts: payload });
      }
    }
  }, [])
  return null
}
export default usePostsObserver;