import React from "react";
import * as config from "../../lib/config";

const ItemProduct = props => {
    return (
        <div className="inner__item">

            { props.offer && <span className="offer__tag">on offer</span> }
            <img src={config.PACKAGING} width="90" height="90" className="item__img mb-3" alt="product" />
            <p className="item__title">Small 12 L Backpack leather cloth</p>
            <div className="col-12 px-0 mb-3">
                <div className="form-row">
                    <div className="col-auto">
                        <span className="final_price">$ 299.99</span>
                    </div>
                    <div className="col-auto">
                        <span className="before__price">$ 350</span>
                    </div>
                </div>
            </div>

            {props.tagged ? <button className="btn btn__tagged">Tagged</button>
                : <button className="btn btn__tag__outline">Tag</button>}
            <style jsx>
                {`
                    .inner__item{
                        position: relative;
                        background-color: #ffffff;
                        padding: 15px 5px;
                        padding-top: 45px;
                        border-radius: 3px;
                    } 

                    .item__img{
                        display: block;
                        margin: auto;
                    }

                    .offer__tag{
                        position: absolute;
                        background-color: #527d47;
                        top: 10px;
                        left: 0;
                        color: #ffffff;
                        font-size: 12px;
                        text-transform: uppercase;
                        padding: 2px 12px;
                        z-index: 1;
                        font-family: 'Avenir-Bold',sans-serif !important;
                    }

                    .item__title{
                        font-family: 'Roboto',sans-serif !important;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }

                    .final_price{
                        font-family: 'Roboto',sans-serif !important;
                        color: #000000;
                    }

                    .before__price{
                        font-family: 'Roboto',sans-serif !important;
                        color: #7E7E7E;
                        font-size: 12px;
                        text-decoration: line-through;
                    }

                    .btn__tag__outline, .btn__tag__outline:hover{
                        border: 1px solid var(--l_base);
                        background-color: #ffffff;
                        width: 100%;
                        margin: auto;
                        display: block;
                        padding: 3px 0;
                        font-family: 'Roboto',sans-serif !important;
                        color: var(--l_base);
                        height: 42px;
                        font-size: 14px;
                    }

                    .btn__tagged, .btn__tagged:hover{
                        border: 1px solid var(--l_base);
                        background-color: var(--l_base);
                        width: 100%;
                        margin: auto;
                        display: block;
                        padding: 3px 0;
                        font-family: 'Roboto',sans-serif !important;
                        color: #ffffff;
                        height: 42px;
                        font-size: 14px;
                    }

                `}
            </style>
        </div>
    );
};
export default ItemProduct;
