import React, {useState, useEffect} from 'react';

function StickyHeader({ children, stickyHandler, className, ...rest }){
  const [isSticky, setIsSticky] = useState(false)
  const ref = React.createRef()
  
  // mount 
  useEffect(()=>{
    const cachedRef = ref.current,
          observer = new IntersectionObserver(
            ([e]) => {setIsSticky(e.intersectionRatio < 1); 
                stickyHandler && stickyHandler(e.intersectionRatio < 1)
            },
            {threshold: [1]}
          )

    observer.observe(cachedRef)
    // unmount
    return function(){
      observer.unobserve(cachedRef)
    }
  }, [])
  return (
    <header style={{
      position: 'sticky',
      top: '-1px',
      transition: '.6s ease-out',
    }} className={isSticky ? " isSticky" : ""} ref={ref} {...rest}>
      {children}
    </header>
  )
}
export default StickyHeader