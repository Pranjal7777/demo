import React, {useEffect, useState} from 'react'
const around = (n, value) => {return value >= n-5 && value<= n+5}

const HorizonatalPagination = (props) => {
    const { id, pageEventHandler, dataCount, totalCount  } = props;
    const [pageChange, setPageChange] = useState(0);

    useEffect(() => {
        var node = document.getElementById(id);
        if(node){
            node.addEventListener('scroll', ()=>{
                const scrollWidth = node.scrollWidth;
                const clientWidth = node.clientWidth;
                const scrollPosition = node.scrollLeft;
                if(around(parseInt(scrollPosition), parseInt(scrollWidth) - parseInt(clientWidth))){
                    setPageChange(Math.random())
                    // pageEventHandler && pageEventHandler()
                }
            }, { passive: true })
        }
    }, []);


    useEffect(() => {
        if(pageChange){
            // console.log('horizontal scroller is hitting');
            if(dataCount && totalCount){
                if(dataCount < totalCount){
                    pageEventHandler && pageEventHandler()
                }
            }else{
                pageEventHandler && pageEventHandler()
            }
        }
    }, [pageChange]);

    return (
        <div>
            {props.children}
        </div>
    )
}
export default HorizonatalPagination;