import React, { useEffect, useState } from "react";
function usePagination(callApi, bottom = 400, intialItems = 10) {
  const [paging, setPaging] = useState(true);
  const [page, setPage] = useState(0);
  const [itemsCount, setItesCount] = useState(intialItems);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    // console.log("sdasdsadsads");
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [paging, page]);

  const detectBottomTouch = (bottomDifferenceInPixel = 0) => {
    return (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - bottomDifferenceInPixel
    );
  };

  const handleScroll = async () => {
    // console.log("sdasdsadsads");
    if (itemsCount && detectBottomTouch(bottom) && paging) {
      let newPage = page + 1;
      setPage(newPage);
      setPaging(false);
      setLoader(true);
      try {
        // total count
        let count = callApi && (await callApi(newPage));
        // setItesCount(count);
        setPaging(true);
        setLoader(false);
      } catch (e) {
        setLoader(false);
        setPaging(false);
      }
    }
  };
  return [loader];
}

export default usePagination;
