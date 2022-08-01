import { Link } from 'react-router-dom';
import { HOMEPAGE } from './App';

/**
 * simple component to display the Tailwind logo and navigates to the homepage when clicked
 */
export const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Link to={HOMEPAGE}>
    <img {...props} src='/logo.png' alt='Tailwind Logo' />
  </Link>
);
