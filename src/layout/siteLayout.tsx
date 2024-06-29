import Footer from '../components/navigation/footer/footer';
import Header from '../components/navigation/navbar/header';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const SiteLayout = ({ children, className }: Props) => {
  return (
    <div
      className={`flex flex-col justify-center items-center flex-grow ${className}`}
    >
      <div className="max-w-screen-2xl w-full">{children}</div>
    </div>
  );
};

export default SiteLayout;
