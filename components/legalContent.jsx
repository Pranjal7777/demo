import Link from 'next/link';
import React from 'react'
import isMobile from '../hooks/isMobile';
import { getCookie } from '../lib/session';

const Legalcontentcomp = () => {
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  return (
    <div> <div className='html_page_container d-flex justify-content-center w-100'>
      <div className={`html_page ${!mobileView && "px-5"}`}>
        <ul>
          <li><Link href={{pathname: "/age-and-identity-verification", query: { goback: 'legal'}}} passHref><a>Age & Identity Verification</a></Link></li>
          <li><Link href={{pathname: "/assistance-law-enforcement", query: { goback: 'legal'}}} passHref><a>Assisting Law Enforcement</a></Link></li>
          <li><Link href={{pathname: "/combatting-csam", query: { goback: 'legal'}}} passHref><a>Combatting CSAM</a></Link></li>
          <li><Link href={{pathname: "/DMCA-legacy", query: { goback: 'legal'}}} passHref><a>DMCA</a></Link></li>
          <li><Link href={{pathname: "/helping-creator", query: { goback: 'legal'}}} passHref><a>Helping Creators Protect Their Copyright</a></Link></li>
          <li><Link href={{pathname: "/our-mission-vision-values", query: { goback: 'legal'}}} passHref><a>Our  Mission, Vision and Values</a></Link></li>
          <li><Link href={{pathname: "/modern-slavery", query: { goback: 'legal'}}} passHref><a>Preventing Modern Slavery & Human Trafficking</a></Link></li>
          <li><Link href={{pathname: "/privacy-policy", query: { goback: 'legal'}}} passHref><a>Privacy Policy</a></Link></li>
          <li><Link href={{pathname: "/safeguard-against-money", query: { goback: 'legal'}}} passHref><a>Safeguarding Against Money Laundering & Fraud</a></Link></li>
          <li><Link href={{pathname: "/tackling-hate-speech", query: { goback: 'legal'}}} passHref><a>Tackling Hate Speech</a></Link></li>
          <li><Link href={{pathname: "/terms-and-conditions", query: { goback: 'legal'}}} passHref><a>Terms & Conditions</a></Link></li>
          <li><Link href={{pathname: "/USC-legacy", query: { goback: 'legal'}}} passHref><a>USC 2257 Disclosure Statement</a></Link></li>
        </ul>

      </div>
    </div>
      <style jsx>
        {`
.html_page_container {
  width: 100%;
}
.html_page {
  position: absolute;
  top: 52px;
  width: ${mobileView ? "100%" : "85.359vw"};
}
.html_page p{
  font-size: ${mobileView ? "3.7vw" : "1.7vw"};
}
`}
      </style></div>
  )
}

export default Legalcontentcomp