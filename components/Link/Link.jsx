import Link from "next/link";

const CustomLink = (props) => {
  const { href, as, target, ...others } = props;
  return (
    <>
    <Link href={href} as={as} {...others} passHref>
      <a target={target || '_self'}>
      {props.children}
      </a>
    </Link>
    <style jsx>{`
      a{
        text-decoration: none;
      }
    `}</style>
    </>
  );
};

export default CustomLink;
