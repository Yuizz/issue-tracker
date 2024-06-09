import React from "react";
import Navbar from "./NavBar";

type Props = {
  children: string | React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}

export default MainLayout;
