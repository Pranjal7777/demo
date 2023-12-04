import Link from "next/link"

const Logindropdown=()=>{ 
    return(
        <>
        <div className="dropbox">
            <ul>
                    <Link href={"/signup-as-user"}><a><li className="user-link" >Join as a User</li></a></Link>
                    <Link href={"/signup-as-creator"}><a><li className="creator-link" >Join as a Creator</li></a></Link>
            </ul>
        </div>
           
            <style jsx>{
                `
                :global(.dropbox li a) {
                      font-family: Raleway !important;
                    }
                li{
                    color:black;
                    font-size:16px;
                    font-weight:500;
                    list-style-type: none;
                    cursor:pointer;
                    padding:10px 30px 10px 10px;
                    border:1px solid #D7D7D7;
                }
              
                .user-link{
                    border-top-left-radius:10px;
                    border-top-right-radius:10px;
                }
                .creator-link{
                    border-bottom-left-radius:10px;
                    border-bottom-right-radius:10px;
                }
                a{
                    text-decoration:none;
                }
                @media screen and (max-width: 768px) {
                    li{
                        font-size:12px;
                        padding:5px;  
                    }
                    .dropbox{
                        // border:2px solid red;
                        background:#fff;
                        margin-top:-20px; 
                    }
                }

                `
            }
            
        </style>
        </>
        
    )
}

export default Logindropdown