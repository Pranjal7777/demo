import React from 'react';
import isMobile from '../../../hooks/isMobile';
import Image from '../../image/image';

const productCard = ({ item, setSelectedProduct, selectedProduct = {} }) => {
    const [mobileView] = isMobile();
    const selected = selectedProduct[item.id];
    const productImg = "https://dkjhqx9qelgck.cloudfront.net/eyJidWNrZXQiOiJmYW56bHkiLCJrZXkiOiJ1c2Vycy9wcm9maWxlLzE2MzgyOTg5NjY2NDVfYXBwc2NyaXAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjMwfSwianBlZyI6eyJxdWFsaXR5Ijo4MCwicHJvZ3Jlc3NpdmUiOnRydWUsIm1vempwZWciOnRydWV9fX0=";
    const handleProductTag = () => {
        if (selected) {
            const tempObj = { ...selectedProduct };
            delete tempObj[item.id];
            setSelectedProduct(tempObj);
        } else {
            const tempObj = { ...selectedProduct };
            tempObj[item.id] = true;
            setSelectedProduct(tempObj);
        };
    };

    return (
        <>
            <div className={`${mobileView ? "col-6" : "col-4"} bg-white fnt_poppins py-1`}>
                <Image src={productImg} className="w-100" />
                <div className="fntSz14 fnt_poppins">
                    This is bagpack
                </div>
                <div className="fntSz18 fnt_poppins font-weight-600">
                    $2,999.99
                </div>
                <div className="fntSz10 fnt_poppins font-weight-500 text-line-through text-muted">
                    $2,999.99
                </div>
                <button onClick={handleProductTag} className={`btn text-uppercase ${selected ? 'btn__tagged' : 'btn__tag__outline'}`}>
                    { selected ? "Tagged" : "Tag"}
                </button>
            </div>
            <style jsx>
                {`
    
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
        </>
    )
}

export default productCard;